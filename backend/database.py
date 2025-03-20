import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create Engine
engine = create_engine(DATABASE_URL, echo=True)

# DB Session
def get_session():
    with Session(engine) as session:
        yield session