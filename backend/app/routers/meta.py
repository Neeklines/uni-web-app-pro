from fastapi import APIRouter
from app.config import ENV, GIT_COMMIT, DEPLOYED_AT

router = APIRouter(prefix="/meta", tags=["meta"])


@router.get("")
def get_meta():
    return {
        "env": ENV,
        "version": GIT_COMMIT,
        "deployed_at": DEPLOYED_AT,
    }
