from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/.env — resolved from this file so it works from any working directory
ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    """App settings. Values come from environment variables or backend/.env."""

    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding="utf-8", extra="ignore")

    app_name: str = "TauTrip API"
    host: str = "127.0.0.1"
    port: int = 8000
    reload: bool = False
    db_url: str = "sqlite:///./tautrip.db"
    api_key_weather: str = ""
    # Comma-separated browser origins allowed to call the API (Expo web preview)
    cors_origins: str = "http://localhost:8081,http://127.0.0.1:8081"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
