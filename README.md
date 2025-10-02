Job Listing Web Application

A full-stack job board application that displays actuarial job postings scraped from Actuary List, with full CRUD operations, filtering, and sorting capabilities.

🎥 Video Demo

Link to Video Demo

📋 Table of Contents

Project Overview

1.	Features
2.	Tech Stack
3.	Project Structure
4.	Prerequisites
5.	Installation & Setup
6.	Running the Application
7.	API Documentation
8.	Assumptions & Design Decisions
9.	Challenges & Solutions

🎯 Project Overview

This application provides a complete job listing platform with:

A Flask REST API backend with PostgreSQL/MySQL database

A React frontend with filtering and sorting capabilities

A Selenium web scraper to populate the database with real job data from Actuary List

✨ Features

Backend

1.	Full CRUD operations (Create, Read, Update, Delete)
2.	RESTful API endpoints
3.	SQLAlchemy ORM with relational database
4.	Advanced filtering by job type, location, and tags
5.	Sorting by posting date and title
6.	Search functionality across title, company, and location
7.	Input validation and error handling
8.	Pagination support
9.	Frontend
10.	Responsive job listing interface
11.	Add new job form with validation
12.	Edit existing job listings
13.	Delete jobs with confirmation
14.	Real-time filtering and sorting
15.	Search functionality
16.	Mobile-friendly responsive design
17.	Success/error feedback messages
18.	Web Scraper
19.	Automated Selenium scraper for Actuary List
20.	Extracts job title, company, location, posting date, job type, and tags
21.	Duplicate prevention logic
22.	Error handling for missing data

🛠 Tech Stack

Backend:

1.	Python 3.x
2.	Flask
3.	SQLAlchemy
4.	PostgreSQL/MySQL
5.	Flask-CORS
6.	Frontend:

React 18

1.	Axios
2.	React Query (TanStack Query)
3.	Tailwind CSS
4.	Framer Motion
5.	React Hot Toast
6.	Scraping:

Selenium

⦁	ChromeDriver/GeckoDriver


📁 Project Structure

job-listing-app/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── models.py              # SQLAlchemy models
│   ├── routes.py              # API routes
│   ├── config.py              # Configuration settings
│   ├── scraper.py             # Selenium scraping script
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── public/
├── README.md
└── .env.example

📦 Prerequisites
Before running this application, ensure you have the following installed:

1.	Python 3.8+
2.	Node.js 16+ and npm/yarn
3.	PostgreSQL or MySQL
4.	ChromeDriver or GeckoDriver (for Selenium)

⚙️ Installation & Setup

⦁	1. Clone the Repository
⦁	git clone <your-repo-url>
⦁	cd job-listing-app
⦁	2. Backend Setup
⦁	cd backend
⦁	
⦁	# Create virtual environment
⦁	python -m venv venv
⦁	
⦁	# Activate virtual environment
⦁	# On Windows:
⦁	venv\Scripts\activate
⦁	# On macOS/Linux:
⦁	source venv/bin/activate

# Install dependencies

⦁	pip install -r requirements.txt
⦁	3. Database Configuration
⦁	Create a .env file in the backend directory:
⦁	
⦁	DATABASE_URL=postgresql://username:password@localhost:5432/joblistings
⦁	# OR for MySQL:
⦁	# DATABASE_URL=mysql://username:password@localhost:3306/joblistings
⦁	
⦁	FLASK_ENV=development
⦁	SECRET_KEY=your-secret-key-here
⦁	Initialize the database:
⦁	
⦁	python
⦁	>>> from app import db
⦁	>>> db.create\_all()
⦁	>>> exit()

4. Frontend Setup

cd ../frontend

⦁	# Install dependencies
⦁	npm install
⦁	# or
⦁	yarn install
⦁	Create a .env file in the frontend directory:
⦁	
⦁	REACT_APP_API_URL=http://127.0.0.1:5000/api
⦁	5. Selenium Setup
⦁	Download the appropriate WebDriver for your browser:
⦁	
⦁	Chrome: ChromeDriver
⦁	Firefox: GeckoDriver
⦁	Add the WebDriver to your system PATH or place it in the backend directory.

🚀 Running the Application

⦁	1. Start the Backend Server
⦁	cd backend
⦁	python app.py
⦁	The Flask API will run on http://127.0.0.1:5000
⦁	
⦁	2. Start the Frontend Development Server
⦁	cd frontend
⦁	npm start
⦁	# or
⦁	yarn start
⦁	The React app will run on http://localhost:3000
⦁	
⦁	3. Run the Web Scraper (Optional)
⦁	To populate the database with job listings from Actuary List:
⦁	
⦁	cd backend
⦁	python scraper.py
⦁	
Note: The scraper fetches approximately 50-100 jobs (first 2-3 pages) for demonstration purposes.

🤔 Assumptions & Design Decisions

Job Type Default: 

If job type is not explicitly stated during scraping, it defaults to "Full-time" unless indicators suggest otherwise (e.g., "Intern" → "Internship").

Tags Storage: 

Tags are stored as comma-separated strings in a single column for simplicity. This could be normalized into a separate table for better scalability.

Posting Date:

 Relative dates like "2 days ago" from the scraper are stored as-is or converted to approximate ISO format.

No Authentication: User authentication is out of scope for this project as per requirements.

Scraping Limit:

 The scraper is limited to the first 50-100 jobs (2-3 pages) to balance demonstration value with execution time.

Client-Side Validation:

 Form validation happens on both client and server sides for better UX and security.

🚧 Challenges & Solutions

Challenge 1:

 Dynamic Content Loading
Problem: Actuary List uses infinite scroll/dynamic loading for job listings.

Solution: Implemented Selenium's explicit waits and scroll functionality to ensure all jobs load before scraping. Added retry logic for failed element selections.

Challenge 2: 

CORS Issues
Problem: React frontend couldn't communicate with Flask backend due to CORS restrictions.

Solution: Installed and configured Flask-CORS to allow cross-origin requests from the React development server.

Challenge 3: 

State Management
Problem: Keeping UI in sync with backend after CRUD operations.

Solution: Implemented React Query for automatic cache invalidation and refetching, ensuring the UI always reflects the latest data.

Challenge 4:

 Duplicate Prevention
Problem: Running the scraper multiple times created duplicate entries.

Solution: Added duplicate checking logic that compares title + company combination before inserting new jobs.

👨‍💻 Author

Jawad Ali,

jsidd350@gmail.com
