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
| `SECRET_KEY` | random (set by `make run`) | Signs login tokens — keep it secret |
| `ACCESS_TOKEN_EXPIRE_DAYS` | `30` | How long a login lasts |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | empty | Email for verification codes (empty = dev mode) |
| `DB_URL` | `sqlite:///./tautrip.db` | Database connection string |
| `CORS_ORIGINS` | `http://localhost:8081,http://127.0.0.1:8081` | Browser origins allowed to call the API (Expo web preview) |
| `API_KEY_WEATHER` | — | Key for the mountain weather API |

Port 8000 busy (another project running)? Set `PORT=8001` in `.env`.

`.env` is git-ignored. Never commit real keys — add new variables to `.env.example` instead.

## API

Full interactive docs: http://127.0.0.1:8000/docs

| Endpoint | What |
|----------|------|
| `GET /health` | Health check |
| `POST /auth/signup/start` | Sign-up step 1: `{email, tag}` → sends a 6-digit code |
| `POST /auth/signup/verify` | Step 2: `{email, code}` → `signup_token` |
| `POST /auth/register` | Step 3: `{signup_token, tag, password, name, birthday?, gender?, preferences[]}` → login token |
| `POST /auth/login` | `{email, password}` → login token |
| `GET /auth/me` | Current user (header `Authorization: Bearer <token>`) |
| `POST /auth/password/forgot` | `{email}` → sends a reset code |
| `POST /auth/password/reset` | `{email, code, new_password}` → login token |

Errors return `{"detail": "<code>"}` (e.g. `email_taken`, `tag_taken`, `invalid_code`, `invalid_credentials`) — the app translates them.

**Email codes in development:** with `SMTP_HOST` empty, codes are not emailed — they are printed in the server log and returned as `dev_code`, and the app shows them as a hint. Set the `SMTP_*` variables to send real emails.

**Database:** SQLite file `backend/tautrip.db`, tables are created on start. There are no migrations yet — if a model changes, delete `tautrip.db` (local data is lost).

## Project structure

```
backend/
├── app/
│   ├── __init__.py      # app version (0.1.0)
│   ├── __main__.py      # `python -m app` entry point
│   ├── main.py          # FastAPI app factory
│   ├── db.py            # SQLAlchemy engine / session
│   ├── api/             # HTTP endpoints (routers)
│   │   ├── health.py    # GET /health
│   │   ├── auth.py      # sign-up, login, password reset
│   │   └── deps.py      # current user from the Bearer token
│   ├── config/          # settings from env / .env
│   ├── models/          # User, VerificationCode
│   └── services/        # security (passwords, tokens), email codes
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
