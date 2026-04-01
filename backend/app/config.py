import os
from dotenv import load_dotenv

load_dotenv() # REQUIRED for local

ENV = os.getenv("ENV", "local")

MYSQL_URL = os.getenv("MYSQL_URL", "mysql+pymysql://user:password@localhost/demo_db")

SQLITE_URL = "sqlite:///./local.db"


def get_database_url():
    if ENV == "prod":
        return MYSQL_URL
    return SQLITE_URL


SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)
)