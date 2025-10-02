from flask import Blueprint, jsonify, request
from src.models.jobs import Job
from src.db import db

job_blueprint = Blueprint("job_routes", __name__)

# Home route
@job_blueprint.route("/")
def index():
    try:
        job_count = db.session.query(Job).count()
        return f"Database connection successful! There are {job_count} jobs in the 'jobs' table."
    except Exception as e:
        return f"Database connection error: {e}"

# Create tables route
@job_blueprint.route("/create_tables")
def create_tables():
    db.create_all()
    return "Database tables created (if they didn't exist)."



# GET endpoint to retrieve all job listings with pagination
# Supports optional filtering, sorting, and pagination via query parameters
@job_blueprint.route("/jobs", methods=["GET"])
def get_jobs():
    """
    Retrieve a list of all job postings with optional filtering, sorting, and pagination.
    
    Query Parameters:
        - job_type (str): Filter by job type (e.g., 'Full-time', 'Part-time')
        - location (str): Filter by location (partial match)
        - tag (str): Filter by a specific tag
        - sort (str): Sort results ('posting_date_desc', 'posting_date_asc', 'title_asc', 'title_desc')
        - page (int): Page number (default: 1)
        - per_page (int): Items per page (default: 20, max: 100)
        - search (str): Search across title, company, and location
    
    Returns:
        JSON: Paginated list of job objects with metadata
        
    Example:
        GET /jobs?job_type=Full-time&sort=posting_date_desc&page=1&per_page=20
    """
    try:
        # Start with a base query for all jobs
        query = Job.query
        
        # --- SEARCH LOGIC (NEW) ---
        search_term = request.args.get('search')
        if search_term:
            search_filter = f'%{search_term}%'
            query = query.filter(
                db.or_(
                    Job.title.ilike(search_filter),
                    Job.company.ilike(search_filter),
                    Job.location.ilike(search_filter)
                )
            )
        
        # --- FILTERING LOGIC ---
        
        # Filter by job_type if provided
        job_type = request.args.get('job_type')
        if job_type:
            query = query.filter(Job.job_type == job_type)
        
        # Filter by location (case-insensitive partial match)
        location = request.args.get('location')
        if location:
            query = query.filter(Job.location.ilike(f'%{location}%'))
        
        # Filter by tag (checks if tag exists in the comma-separated tags string)
        tag = request.args.get('tag')
        if tag:
            query = query.filter(Job.tags.ilike(f'%{tag}%'))
        
        # --- SORTING LOGIC ---
        
        # Get sort parameter (default to newest first)
        sort_param = request.args.get('sort', 'posting_date_desc')
        
        # Apply sorting based on the parameter
        if sort_param == 'posting_date_desc':
            query = query.order_by(Job.posting_date.desc())
        elif sort_param == 'posting_date_asc':
            query = query.order_by(Job.posting_date.asc())
        elif sort_param == 'title_asc':
            query = query.order_by(Job.title.asc())
        elif sort_param == 'title_desc':
            query = query.order_by(Job.title.desc())
        else:
            # Default sorting if invalid sort parameter
            query = query.order_by(Job.posting_date.desc())
        
        # --- PAGINATION LOGIC (NEW) ---
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Validate pagination parameters
        if page < 1:
            page = 1
        if per_page < 1 or per_page > 100:
            per_page = 20  # Default to 20, max 100
        
        # Use Flask-SQLAlchemy's paginate method
        pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False  # Don't throw error if page is out of range
        )
        
        # Convert each job object to a dictionary
        jobs_list = [job.to_dict() for job in pagination.items]
        
        # Return paginated response with metadata
        return jsonify({
            'success': True,
            'jobs': jobs_list,
            'pagination': {
                'current_page': pagination.page,
                'per_page': pagination.per_page,
                'total_items': pagination.total,
                'total_pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev,
                'next_page': pagination.next_num if pagination.has_next else None,
                'prev_page': pagination.prev_num if pagination.has_prev else None
            }
        }), 200
        
    except Exception as e:
        # Handle any unexpected errors
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve jobs',
            'message': str(e)
        }), 500



# GET endpoint to retrieve a specific job by its ID
@job_blueprint.route("/jobs/<int:job_id>", methods=["GET"])
def get_job(job_id):
    """
    Retrieve a single job listing by its unique ID.
    
    Args:
        job_id (int): The unique identifier of the job
    
    Returns:
        JSON: Single job object with HTTP 200 status if found
        JSON: Error message with HTTP 404 status if not found
        
    Example:
        GET /jobs/5
    """
    try:
        # Query the database for a job with the given ID
        # get_or_404() automatically returns 404 if not found
        job = Job.query.get_or_404(job_id)
        
        # Convert the job object to dictionary and return as JSON
        return jsonify({
            'success': True,
            'job': job.to_dict()
        }), 200
        
    except Exception as e:
        # Handle case where job is not found
        if '404' in str(e):
            return jsonify({
                'success': False,
                'error': 'Job not found',
                'message': f'No job exists with ID {job_id}'
            }), 404
        
        # Handle any other unexpected errors
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve job',
            'message': str(e)
        }), 500



# POST endpoint to create a new job listing
@job_blueprint.route("/jobs", methods=["POST"])
def create_job():
    """
    Create a new job listing.
    
    Request Body (JSON):
        - title (str, required): Job title
        - company (str, required): Company name
        - location (str, required): Job location
        - posting_date (str, optional): Date in ISO format
        - job_type (str, optional): Type of job (default: 'Full-time')
        - tags (str/list, optional): Comma-separated string or list of tags
    
    Returns:
        JSON: Created job object with HTTP 201 status
        JSON: Error message with HTTP 400 status if validation fails
        
    Example:
        POST /jobs
        Body: {"title": "Actuary", "company": "ABC Corp", "location": "New York"}
    """
    try:
        # Get JSON data from request body
        data = request.get_json()
        
        # --- INPUT VALIDATION ---
        
        # Check if request body contains JSON data
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided',
                'message': 'Request body must contain JSON data'
            }), 400
        
        # Validate required fields
        required_fields = ['title', 'company', 'location']
        for field in required_fields:
            if not data.get(field) or not data.get(field).strip():
                return jsonify({
                    'success': False,
                    'error': 'Validation error',
                    'message': f'{field.capitalize()} is required and cannot be empty'
                }), 400
        
        # --- PREPARE DATA ---
        
        # Handle tags: convert list to comma-separated string if needed
        tags = data.get('tags', '')
        if isinstance(tags, list):
            tags = ','.join(tags)
        
        # Handle posting_date: convert string to datetime if provided
        posting_date = None
        if data.get('posting_date'):
            from datetime import datetime
            try:
                posting_date = datetime.fromisoformat(data['posting_date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Invalid date format',
                    'message': 'posting_date must be in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)'
                }), 400
        
        # --- CREATE JOB ---
        
        # Create new Job instance
        new_job = Job(
            title=data['title'].strip(),
            company=data['company'].strip(),
            location=data['location'].strip(),
            posting_date=posting_date,
            job_type=data.get('job_type', 'Full-time'),
            tags=tags
        )
        
        # Add to database session and commit
        db.session.add(new_job)
        db.session.commit()
        
        # Return created job with 201 Created status
        return jsonify({
            'success': True,
            'message': 'Job created successfully',
            'job': new_job.to_dict()
        }), 201
        
    except Exception as e:
        # Rollback transaction in case of error
        db.session.rollback()
        
        return jsonify({
            'success': False,
            'error': 'Failed to create job',
            'message': str(e)
        }), 500
    




# PUT/PATCH endpoint to update an existing job listing
@job_blueprint.route("/jobs/<int:job_id>", methods=["PUT", "PATCH"])
def update_job(job_id):
    """
    Update an existing job listing by ID.
    
    Args:
        job_id (int): The unique identifier of the job to update
    
    Request Body (JSON):
        Any job fields to update (title, company, location, etc.)
        All fields are optional for PATCH, but at least one should be provided
    
    Returns:
        JSON: Updated job object with HTTP 200 status
        JSON: Error message with HTTP 404 if job not found
        JSON: Error message with HTTP 400 if validation fails
        
    Example:
        PUT /jobs/5
        Body: {"title": "Senior Actuary", "job_type": "Full-time"}
    """
    try:
        # Get JSON data from request body
        data = request.get_json()
        
        # --- INPUT VALIDATION ---
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided',
                'message': 'Request body must contain JSON data'
            }), 400
        
        # --- FIND JOB ---
        
        # Query for the job by ID
        job = Job.query.get(job_id)
        
        if not job:
            return jsonify({
                'success': False,
                'error': 'Job not found',
                'message': f'No job exists with ID {job_id}'
            }), 404
        
        # --- UPDATE FIELDS ---
        
        # Update title if provided and not empty
        if 'title' in data:
            if not data['title'] or not data['title'].strip():
                return jsonify({
                    'success': False,
                    'error': 'Validation error',
                    'message': 'Title cannot be empty'
                }), 400
            job.title = data['title'].strip()
        
        # Update company if provided and not empty
        if 'company' in data:
            if not data['company'] or not data['company'].strip():
                return jsonify({
                    'success': False,
                    'error': 'Validation error',
                    'message': 'Company cannot be empty'
                }), 400
            job.company = data['company'].strip()
        
        # Update location if provided and not empty
        if 'location' in data:
            if not data['location'] or not data['location'].strip():
                return jsonify({
                    'success': False,
                    'error': 'Validation error',
                    'message': 'Location cannot be empty'
                }), 400
            job.location = data['location'].strip()
        
        # Update job_type if provided
        if 'job_type' in data:
            job.job_type = data['job_type']
        
        # Update tags if provided (handle list or string)
        if 'tags' in data:
            tags = data['tags']
            if isinstance(tags, list):
                job.tags = ','.join(tags)
            else:
                job.tags = tags
        
        # Update posting_date if provided
        if 'posting_date' in data:
            from datetime import datetime
            try:
                job.posting_date = datetime.fromisoformat(data['posting_date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Invalid date format',
                    'message': 'posting_date must be in ISO format'
                }), 400
        
        # Commit changes to database
        db.session.commit()
        
        # Return updated job
        return jsonify({
            'success': True,
            'message': 'Job updated successfully',
            'job': job.to_dict()
        }), 200
        
    except Exception as e:
        # Rollback transaction in case of error
        db.session.rollback()
        
        return jsonify({
            'success': False,
            'error': 'Failed to update job',
            'message': str(e)
        }), 500
    


# DELETE endpoint to remove a job listing
@job_blueprint.route("/jobs/<int:job_id>", methods=["DELETE"])
def delete_job(job_id):
    """
    Delete a job listing by ID.
    
    Args:
        job_id (int): The unique identifier of the job to delete
    
    Returns:
        JSON: Success message with HTTP 200 status
        JSON: Error message with HTTP 404 if job not found
        
    Example:
        DELETE /jobs/5
    """
    try:
        # --- FIND JOB ---
        
        # Query for the job by ID
        job = Job.query.get(job_id)
        
        if not job:
            return jsonify({
                'success': False,
                'error': 'Job not found',
                'message': f'No job exists with ID {job_id}'
            }), 404
        
        # --- DELETE JOB ---
        
        # Store job info for response before deletion
        job_info = {
            'id': job.id,
            'title': job.title,
            'company': job.company
        }
        
        # Delete from database
        db.session.delete(job)
        db.session.commit()
        
        # Return success message with deleted job info
        return jsonify({
            'success': True,
            'message': 'Job deleted successfully',
            'deleted_job': job_info
        }), 200
        
    except Exception as e:
        # Rollback transaction in case of error
        db.session.rollback()
        
        return jsonify({
            'success': False,
            'error': 'Failed to delete job',
            'message': str(e)
        }), 500