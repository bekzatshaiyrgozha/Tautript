"""Collect real tour offers from partner websites into one JSON file.

    python scripts/scrape_tours.py                      # writes ../mobile/src/data/offers.json
    python scripts/scrape_tours.py --out offers.json    # anywhere else

Only the standard library is used, so it runs without installing anything.
Every site has its own small parser below; a site that fails is reported and skipped,
the others still go to the file. Each offer keeps the link to the page it came from.

Sites (from the team research): Azimut Travel, Algri Travel, Monte.
Not parsed yet: Sxodim (city picker is rendered by JavaScript), Ticketon (bot protection
answers with a queue page), Kan Tengri (no prices on the pages), uvu.kz (transport site,
not a tour operator).
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import re
import sys
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (compatible; TauTripBot/0.1; student project, Almaty)"
TIMEOUT = 25
TODAY = dt.date.today()

MONTHS = {
    "январ": 1, "феврал": 2, "март": 3, "апрел": 4, "ма": 5, "июн": 6,
    "июл": 7, "август": 8, "сентябр": 9, "октябр": 10, "ноябр": 11, "декабр": 12,
}

# Destination ids the app knows (src/data/destinations.ts) and the words that point to them.
DESTINATIONS = {
    "kolsai": r"кольса|көлса|каинд|қайың|kolsa",
    "charyn": r"чарын|шарын|charyn",
    "bao": r"большое алматинское озеро|\bбао\b|mnt\.kz/bao$",
    "turgen": r"тургень|тургенск|медвеж|ассы|issyk|assy",
    "kok-zhailau": r"кок-жайля|көк-жайла|kok-zhailau",
    "butakovka": r"бутаков|butakov",
    "altyn-emel": r"алтын-эмел",
}


# ---------- helpers ----------


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "ru"})
    with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
        return response.read().decode("utf-8", "ignore")


def text_of(fragment: str) -> str:
    fragment = re.sub(r"<script.*?</script>|<style.*?</style>", " ", fragment, flags=re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", fragment))).strip()


def money(value: str) -> int:
    return int(re.sub(r"\D", "", value))


def month_number(word: str) -> int | None:
    word = word.lower()
    for stem, number in MONTHS.items():
        if word.startswith(stem):
            return number
    return None


def to_dates(month: int, days_text: str) -> list[str]:
    """'2, 4, 7' or '3–5, 6–8' (a range = a trip starting on its first day) → ISO dates of this year."""
    dates = []
    for part in re.split(r",\s*", days_text):
        first = re.match(r"\s*(\d{1,2})", part)
        if not first:
            continue
        try:
            dates.append(dt.date(TODAY.year, month, int(first.group(1))).isoformat())
        except ValueError:
            continue
    return dates


def destinations_of(*texts: str) -> list[str]:
    joined = " ".join(texts).lower()
    return [key for key, pattern in DESTINATIONS.items() if re.search(pattern, joined)]


def offer(**fields) -> dict:
    fields.setdefault("dates", [])
    fields.setdefault("priceKzt", None)
    fields.setdefault("priceNote", None)
    fields.setdefault("meetingPoint", None)
    fields["checkedAt"] = TODAY.isoformat()
    return fields


# ---------- Azimut Travel: weekend tours page, one <article class="ik-card"> per tour ----------


def parse_azimut() -> list[dict]:
    url = "https://azimut-travel.kz/tury-vyhodnogo-dnya-iz-almaty"
    page = fetch(url)
    offers = []
    for card in re.findall(r'<article class="ik-card".*?</article>', page, flags=re.S):
        title = text_of(re.search(r"<h3[^>]*>(.*?)</h3>", card, flags=re.S).group(1))
        description = text_of((re.search(r'itemprop="description">(.*?)</p>', card, flags=re.S) or [None, ""])[1])
        where = destinations_of(title, description)
        if not where:
            continue  # city tours, Turkestan… are not nature tours
        price = re.search(r'ik-card-price">(.*?)</div>', card, flags=re.S)
        tag = re.search(r'ik-tag">(.*?)</div>', card, flags=re.S)
        anchor = re.search(r'id="([^"]+)"', card)
        days = re.search(r'data-days="(\d+)"', card)

        dates: list[str] = []
        block = re.search(r"(Опубликованные|Запланированные) даты</h4>(.*?)<p class=\"ik-note\"", card, flags=re.S)
        if block:
            for month_word, days_text in re.findall(r"([А-Яа-я]+):\s*</span>\s*([^<]+)", block.group(2)):
                month = month_number(month_word)
                if month:
                    dates += to_dates(month, days_text)
        meeting = re.search(r"Место и время сбора</h4>\s*<p>(.*?)</p>", card, flags=re.S)

        offers.append(
            offer(
                company="azimut",
                title=title,
                description=description,
                url=f"{url}#{anchor.group(1)}" if anchor else url,
                destinations=where,
                priceKzt=money(text_of(price.group(1))) if price else None,
                priceNote="perPerson",
                days=int(days.group(1)) if days else 1,
                durationLabel=text_of(tag.group(1)) if tag else None,
                dates=sorted(set(dates)),
                meetingPoint=text_of(meeting.group(1)) if meeting else None,
            )
        )
    return offers


# ---------- Algri Travel: one page per tour with «Расписание выездов … Цена тура …» ----------

ALGRI_PAGES = [
    ("https://algritravel.kz/charynskiy_kanon", 1),
    ("https://algritravel.kz/ozero_issyk", 1),
    ("https://algritravel.kz/plato-assy-vodopad-medvezhij-1-den", 1),
    ("https://algritravel.kz/kolsayskie_ozera", 2),
]


def parse_algri() -> list[dict]:
    offers = []
    for url, days in ALGRI_PAGES:
        page = fetch(url)
        text = text_of(page)
        title = text_of(re.search(r"<h1[^>]*>(.*?)</h1>", page, flags=re.S).group(1)) if "<h1" in page else ""
        if not title:
            title = text_of(re.search(r"<title>(.*?)</title>", page, flags=re.S).group(1))
        title = re.split(r"\s[—–-]\s|\s?-\s?одноднев| из Алматы", title)[0].strip()
        # «Расписание выездов на Чарын 21, 22, 28, 29 ноября Цена тура 10 000 тг»
        # «Даты туров на Кольсай и Каинды 5-7, 12-14 … июня Цена 30 000 тенге»
        schedule = re.search(
            r"(?:Расписание выездов|Даты туров)[^0-9]*((?:\d{1,2}(?:\s?[-–]\s?\d{1,2})?,?\s*)+)([А-Яа-я]+)\s+Цена(?: тура)?\s+([\d\s]+)\s*(?:тг|тенге)",
            text,
        )
        if not schedule:
            print(f"  algri: no schedule on {url}", file=sys.stderr)
            continue
        month = month_number(schedule.group(2))
        offers.append(
            offer(
                company="algri",
                title=title,
                url=url,
                destinations=destinations_of(title, url),
                priceKzt=money(schedule.group(3)),
                priceNote="perPerson",
                days=days,
                durationLabel=f"{days} дн." if days > 1 else "1 день",
                dates=to_dates(month, schedule.group(1)) if month else [],
            )
        )
    return offers


# ---------- Monte: private hikes with a guide, price per person depends on the group size ----------

MONTE_PAGES = [
    "https://mnt.kz/bao",
    "https://mnt.kz/kok-zhailau",
    "https://mnt.kz/butakovskiy-vodopad",
    "https://mnt.kz/kolsai-tri-ozera",
    "https://mnt.kz/timbilding-charyn",
]


def parse_monte() -> list[dict]:
    offers = []
    for url in MONTE_PAGES:
        page = fetch(url)
        text = text_of(page)
        title = text_of(re.search(r"<title>(.*?)</title>", page, flags=re.S).group(1))
        title = re.split(r"[.!|]\s", title)[0].strip()
        per_person = [(int(n), money(p)) for n, p in re.findall(r"(\d+) человек\w*\s+[\d\s]+тг\s+([\d\s]+?)\s*тг/чел", text)]
        single = re.search(r"1 человек\s+([\d\s]+?)\s*тг", text)
        if not per_person and not single:
            print(f"  monte: no prices on {url}", file=sys.stderr)
            continue
        group, cheapest = min(per_person, key=lambda pair: pair[1]) if per_person else (1, money(single.group(1)))
        duration = re.search(r"Продолжительность\s+(около\s+)?([\d\-–]+\s+(?:час\w*|дн\w*|день))", text)
        label = (duration.group(2) if duration else "").strip()
        days = int(re.match(r"\d+", label).group(0)) if "дн" in label or "день" in label else 1
        offers.append(
            offer(
                company="monte",
                title=title,
                url=url,
                destinations=destinations_of(title, url),
                priceKzt=cheapest,
                priceNote=f"group:{group}",
                days=days,
                durationLabel=label or None,
                dates=[],  # private hike: the date is agreed with the guide
            )
        )
    return offers


COMPANIES = {
    "azimut": {"name": "Azimut Travel", "site": "https://azimut-travel.kz", "parse": parse_azimut},
    "algri": {"name": "Algri Travel", "site": "https://algritravel.kz", "parse": parse_algri},
    "monte": {"name": "Monte", "site": "https://mnt.kz", "parse": parse_monte},
}


def main() -> None:
    default_out = Path(__file__).resolve().parents[2] / "mobile" / "src" / "data" / "offers.json"
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--out", type=Path, default=default_out)
    args = parser.parse_args()

    offers, sources = [], []
    for key, company in COMPANIES.items():
        try:
            found = company["parse"]()
            found = [o for o in found if o["destinations"]]
            for index, item in enumerate(found):
                item["id"] = f"{key}-{index + 1}"
            offers += found
            sources.append({"id": key, "name": company["name"], "site": company["site"], "ok": True, "count": len(found)})
            print(f"{company['name']}: {len(found)} offers")
        except Exception as error:  # one broken site must not stop the others
            sources.append({"id": key, "name": company["name"], "site": company["site"], "ok": False, "count": 0})
            print(f"{company['name']}: FAILED ({error})", file=sys.stderr)

    data = {"generatedAt": dt.datetime.now().isoformat(timespec="seconds"), "sources": sources, "offers": offers}
    args.out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"→ {args.out} ({len(offers)} offers)")


if __name__ == "__main__":
    main()
