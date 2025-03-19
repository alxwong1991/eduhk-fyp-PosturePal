import bcrypt
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Secure JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")  # Use a strong, secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token expires in 60 minutes

# ✅ Password Hashing Functions
def hash_password(password: str) -> str:
    """✅ Hash password before storing."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """✅ Compare plain password with stored hash."""
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

# ✅ JWT Token Functions
def create_access_token(data: dict, expires_delta: timedelta = None):
    """✅ Generates a secure JWT token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)) 
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_access_token(token: str):
    """✅ Verifies a JWT token and extracts the payload."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Returns the decoded user data
    except JWTError:
        return None  # Invalid token