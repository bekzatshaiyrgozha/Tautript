from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel

from app import __version__

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    status: Literal["ok"]
    version: str


@router.get("/health", response_model=HealthResponse, summary="Service health check")
def health() -> HealthResponse:
    """Returns 200 while the server is up. Used by the mobile app and monitoring."""
    return HealthResponse(status="ok", version=__version__)
