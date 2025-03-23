from logging.config import fileConfig
from sqlalchemy import create_engine, pool
from sqlmodel import SQLModel
from alembic import context
import os
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Get DATABASE_URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# ✅ Check if DATABASE_URL is set
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables!")

# ✅ Alembic Config object
config = context.config

# ✅ Set the database URL in Alembic config (AFTER validation)
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# ✅ Setup logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ✅ Import all models dynamically (instead of manually importing each one)
from models import user, exercise_log  # Add all model files here

# ✅ Set metadata for autogeneration
target_metadata = SQLModel.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    context.configure(
        url=DATABASE_URL,  # ✅ Use DATABASE_URL directly
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    engine = create_engine(DATABASE_URL, poolclass=pool.NullPool)  # ✅ Use create_engine()

    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()