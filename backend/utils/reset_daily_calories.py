from sqlmodel import select
from models.user import User
from database import get_session
from datetime import datetime, timedelta, timezone
import asyncio

# Define Hong Kong Timezone (UTC+8)
HKT = timezone(timedelta(hours=8))

async def reset_daily_calories():
    """Reset `daily_calories_burned` exactly at midnight HKT."""
    while True:
        now_utc = datetime.now(timezone.utc)  # Get the current UTC time
        now_hkt = now_utc.astimezone(HKT)  # Convert UTC → HKT

        print(f"Checking HKT Time: {now_hkt.strftime('%Y-%m-%d %H:%M:%S')}")

        if now_hkt.hour == 0 and now_hkt.minute == 0:  # Only reset at exactly midnight (00:00 HKT)
            print("Midnight HKT detected! Resetting `daily_calories_burned`...")

            # FIX: Use `async for` instead of `async with`
            async for session in get_session():
                result = await session.exec(select(User))
                users = result.all()

                for user in users:
                    print(f"Resetting user {user.id} calories from {user.daily_calories_burned} to 0")
                    user.daily_calories_burned = 0

                await session.commit()
                print("Daily calories burned reset for all users.")

        await asyncio.sleep(60)  # Wait 60 seconds before checking again