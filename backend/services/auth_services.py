import re
from fastapi import HTTPException, Depends
from sqlmodel import Session, select
from database import get_session
from models.user import User
from utils.security import hash_password, verify_password, create_access_token, verify_access_token
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

def register_user_service(user_data, session: Session):
    """Register a new user with hashed password."""
    if not re.match(EMAIL_REGEX, user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = hash_password(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        gender=user_data.gender,
        dob=user_data.dob,
        height_cm=user_data.height_cm,
        weight_kg=user_data.weight_kg,
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User registered successfully"}

def login_user_service(login_data, session: Session):
    """Log in and return a JWT token after verifying hashed password."""
    user = session.exec(select(User).where(User.email == login_data.email)).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"user_id": user.id, "email": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user_service(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    """Get current logged-in user from JWT token."""
    try:
        payload = verify_access_token(token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    user = session.exec(select(User).where(User.email == payload["email"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user