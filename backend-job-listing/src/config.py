import os
from dotenv import load_dotenv

load_dotenv() # Load variables from .env

# --- Flask Configuration Class ---
class Config:
    """Configuration settings for the Flask application."""
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")
    
    # Construct the SQLAlchemy Database URI using loaded environment variables
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Add other settings like SECRET_KEY here