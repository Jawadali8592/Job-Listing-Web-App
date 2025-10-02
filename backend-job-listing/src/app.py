from flask import Flask
from src.config import Config
from src.db import init_db, db 
from src.models.jobs import Job # Import the Job model
from src.routes.job_routes import job_blueprint
from flask_cors import CORS

# --- Application Factory Function ---
def create_app():
    """Initializes the core application."""
    app = Flask(__name__)
    
    # 1. Load Configuration
    app.config.from_object(Config)

    # 2. Initialize Extensions
    init_db(app)

    CORS(app)  
    
    app.register_blueprint(job_blueprint, url_prefix="/api")
   
            
    return app

# --- Run the Application ---
if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        
        db.create_all()
    
    app.run(debug=True)