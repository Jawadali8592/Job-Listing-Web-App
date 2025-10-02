from flask_sqlalchemy import SQLAlchemy

# Initialize the SQLAlchemy object without passing the app immediately.
db = SQLAlchemy()

def init_db(app):
    """Initializes the database connection with the Flask app."""
    db.init_app(app)