from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]
# backend/.env — resolved from this file so it works from any working directory
ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    """App settings. Values come from environment variables or backend/.env."""

    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding="utf-8", extra="ignore")

    app_name: str = "TauTrip API"
    host: str = "127.0.0.1"
    port: int = 8000
    reload: bool = False
    db_url: str = f"sqlite:///{BACKEND_DIR / 'tautrip.db'}"
    # Signs login tokens. `make run` generates a random one into .env.
    secret_key: str = "dev-only-secret-key-change-me-0123456789"
    access_token_expire_days: int = 30
    verification_code_ttl_minutes: int = 10
    # Email for verification codes. Empty SMTP_HOST = dev mode: the code is
    # printed in the server log and returned as `dev_code` (never in production).
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "TauTrip <no-reply@tautrip.kz>"

    @property
    def email_dev_mode(self) -> bool:
        return not self.smtp_host
    api_key_weather: str = ""
    # Comma-separated browser origins allowed to call the API (Expo web preview)
    cors_origins: str = "http://localhost:8081,http://127.0.0.1:8081"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
