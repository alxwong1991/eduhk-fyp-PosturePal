from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import EmailStr
import bcrypt

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: EmailStr = Field(unique=True)
    password_hash: str

    def verify_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode(), self.password_hash.encode())

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()