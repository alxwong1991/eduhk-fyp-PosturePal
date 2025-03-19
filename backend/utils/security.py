import bcrypt

def hash_password(password: str) -> str:
    """✅ Hash password before storing."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """✅ Compare plain password with stored hash."""
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())