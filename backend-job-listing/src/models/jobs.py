# File: src/models/job.py

from src.db import db # Import the shared db object from src/db.py
from datetime import datetime

class Job(db.Model):
    """
    Model representing a job listing in the database.
    Corresponds to the 'jobs' table with fields from the user-defined schema.
    """
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    # Changed posting_date to DateTime for better database practices
    posting_date = db.Column(db.DateTime) 
    job_type = db.Column(db.String(50), default='Full-time')
    # Use Text for tags to allow for longer lists
    tags = db.Column(db.Text) 
    
    # Standard metadata columns
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # Automatically updates the timestamp on every record modification
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Job {self.title} at {self.company}>'

    def to_dict(self):
        """Convert job object to a dictionary for API/JSON responses."""
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'location': self.location,
            # Format date columns to ISO 8601 string
            'posting_date': self.posting_date.isoformat() if self.posting_date else None,
            'job_type': self.job_type,
            # Splits the comma-separated string of tags into a Python list
            'tags': self.tags.split(',') if self.tags else [], 
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }