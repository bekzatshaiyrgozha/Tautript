# TauTrip — Backend

Python 3.11+ · FastAPI · SQLite. REST API for the TauTrip iOS app.

## Run locally

**Requirements:** Python 3.11+ (`python3 --version`), `make` (preinstalled on macOS).

```bash
git clone https://github.com/bekzatshaiyrgozha/Tautript.git
cd Tautript/backend
make run
```

That's it. On first run `make run` creates `.venv`, installs pinned dependencies and copies `.env.example` → `.env`. Then it starts the server at **http://127.0.0.1:8000**.

Check it works:

```bash
curl http://127.0.0.1:8000/health
# {"status":"ok","version":"0.1.0"}
```

| URL | What |
|-----|------|
| http://127.0.0.1:8000/health | Health check |
| http://127.0.0.1:8000/docs   | Swagger UI (try endpoints in the browser) |
| http://127.0.0.1:8000/redoc  | ReDoc API docs |

### Without `make` (e.g. Windows)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env               # Windows: copy .env.example .env
python -m app
```

## Commands

| Command | What it does |
|---------|--------------|
| `make run`     | Install (first time) and start the API |
| `make run-lan` | Same, but reachable from an iPhone on the same Wi-Fi |
| `make test`    | Run tests |
| `make install` | Only create `.venv` and install dependencies |
| `make clean`   | Delete `.venv` and caches |

## Configuration (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `127.0.0.1` | Set `0.0.0.0` to open the API from an iPhone on the same Wi-Fi |
| `PORT` | `8000` | Server port |
| `RELOAD` | `false` (`true` in `.env.example`) | Auto-restart on code changes |
| `DB_URL` | `sqlite:///./tautrip.db` | Database connection string |
| `CORS_ORIGINS` | `http://localhost:8081,http://127.0.0.1:8081` | Browser origins allowed to call the API (Expo web preview) |
| `API_KEY_WEATHER` | — | Key for the mountain weather API |

Port 8000 busy (another project running)? Set `PORT=8001` in `.env`.

`.env` is git-ignored. Never commit real keys — add new variables to `.env.example` instead.

## Project structure

```
backend/
├── app/
│   ├── __init__.py      # app version (0.1.0)
│   ├── __main__.py      # `python -m app` entry point
│   ├── main.py          # FastAPI app factory
│   ├── api/             # HTTP endpoints (routers)
│   │   └── health.py    # GET /health
│   ├── config/          # settings from env / .env
│   ├── models/          # database models
│   └── services/        # business logic, external APIs (weather)
├── tests/
├── requirements.txt     # runtime deps (pinned)
├── requirements-dev.txt # + test deps
├── .env.example
└── Makefile
```

Adding an endpoint: create `app/api/<name>.py` with an `APIRouter`, register it in `app/api/__init__.py`, add a test in `tests/`.

## Workflow

- Branch from `main`: `feature/<short-name>`.
- Open a pull request to `main`; `make test` must pass.
