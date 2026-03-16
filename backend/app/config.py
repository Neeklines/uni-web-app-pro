import os

ENV = os.getenv("ENV", "local")

MYSQL_URL = os.getenv("MYSQL_URL", "mysql+pymysql://user:password@localhost/demo_db")

SQLITE_URL = "sqlite:///./local.db"


def get_database_url():
    if ENV == "prod":
        return MYSQL_URL
    return SQLITE_URL
