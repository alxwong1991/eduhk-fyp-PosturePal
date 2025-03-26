import re
from fastapi import HTTPException, Depends
from sqlmodel import select
from database import get_session
from models.user import User
from utils.security import hash_password, verify_password, create_access_token, verify_access_token
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

async def get_user(session: AsyncSession, user_id: int) -> User | None:
    """Fetch user details from the database."""
    try:
        result = await session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()  # ✅ Return `User` or `None`
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")  # ✅ Raise exception for DB errors

async def register_user_service(user_data, session: AsyncSession):
    """Register a new user with hashed password."""
    if not re.match(EMAIL_REGEX, user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    result = await session.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
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
    await session.commit()
    await session.refresh(new_user)

    return {"message": "User registered successfully"}

async def login_user_service(login_data, session: AsyncSession):
    """Log in and return a JWT token after verifying hashed password."""
    result = await session.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"user_id": user.id, "email": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user_service(
    token: str = Depends(oauth2_scheme), 
    session: AsyncSession = Depends(get_session)
) -> User:
    """Get the current logged-in user from JWT token."""
    try:
        payload = verify_access_token(token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))  # ✅ Raise an exception instead of returning a tuple

    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")  # ✅ Return error properly

    user = await get_user(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")  # ✅ Raise an exception if the user is missing

    return user  # ✅ Return a single `User` object

async def logout_user_service(user):
    """Logs out the user by clearing session/token (if applicable)."""
    return {"message": f"User {user.email} logged out successfully"}