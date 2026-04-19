import os
from dotenv import load_dotenv

load_dotenv()  # REQUIRED for dev

ENV = os.getenv("ENV", "dev")

# Database
MYSQL_URL = os.getenv("MYSQL_URL", "mysql+pymysql://user:password@localhost/demo_db")
SQLITE_URL = "sqlite:///./local.db"

# Auth
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# Meta
GIT_COMMIT = os.getenv("GIT_COMMIT", "unknown")
DEPLOYED_AT = os.getenv("DEPLOYED_AT", "unknown")


def get_database_url():
    if ENV == "prod":
        return MYSQL_URL
    return SQLITE_URL


FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
PASSWORD_RESET_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("PASSWORD_RESET_TOKEN_EXPIRE_MINUTES", 30)
)

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)
