# Job Listing Web Application

A full-stack job board application that displays actuarial job postings scraped from Actuary List, with full CRUD operations, filtering, and sorting capabilities.

🎥 **Video Demo**  
[Link to Video Demo](#)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Project Structure](#project-structure)  
5. [Prerequisites](#prerequisites)  
6. [Installation & Setup](#installation--setup)  
7. [Running the Application](#running-the-application)  
8. [API Documentation](#api-documentation)  
9. [Assumptions & Design Decisions](#assumptions--design-decisions)  
10. [Challenges & Solutions](#challenges--solutions)  
11. [Author](#author)  

---

## 🎯 Project Overview

This application provides a complete job listing platform with:

- **Backend:** Flask REST API with PostgreSQL/MySQL database  
- **Frontend:** React frontend with filtering and sorting capabilities  
- **Scraper:** Selenium web scraper to populate the database with real job data from Actuary List  

---

## ✨ Features

### Backend
- Full CRUD operations (Create, Read, Update, Delete)  
- RESTful API endpoints  
- SQLAlchemy ORM with relational database  
- Advanced filtering by job type, location, and tags  
- Sorting by posting date and title  
- Search functionality across title, company, and location  
- Input validation and error handling  
- Pagination support  

### Frontend
- Responsive job listing interface  
- Add new job form with validation  
- Edit existing job listings  
- Delete jobs with confirmation  
- Real-time filtering and sorting  
- Search functionality  
- Mobile-friendly responsive design  
- Success/error feedback messages  

### Web Scraper
- Automated Selenium scraper for Actuary List  
- Extracts job title, company, location, posting date, job type, and tags  
- Duplicate prevention logic  
- Error handling for missing data  

---

## 🛠 Tech Stack

### Backend
- Python 3.x  
- Flask  
- SQLAlchemy  
- PostgreSQL/MySQL  
- Flask-CORS  

### Frontend
- React 18  
- Axios  
- React Query (TanStack Query)  
- Tailwind CSS  
- Framer Motion  
- React Hot Toast  

### Scraping
- Selenium  
- ChromeDriver/GeckoDriver  

---

## 📁 Project Structure

job-listing-app/
├── backend/
│ ├── app.py # Flask application entry point
│ ├── models.py # SQLAlchemy models
│ ├── routes.py # API routes
│ ├── config.py # Configuration settings
│ ├── scraper.py # Selenium scraping script
│ └── requirements.txt # Python dependencies
├── frontend/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── App.js
│ │ └── index.js
│ ├── package.json
│ └── public/
├── README.md
└── .env.example



---

## 📦 Prerequisites

Before running this application, ensure you have the following installed:

1. Python 3.8+  
2. Node.js 16+ and npm/yarn  
3. PostgreSQL or MySQL  
4. ChromeDriver or GeckoDriver (for Selenium)  

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd job-listing-app

cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

python
>>> from app import db
>>> db.create_all()
>>> exit()

cd ../frontend

# Install dependencies
npm install
# or
yarn install

# Create .env file
REACT_APP_API_URL=http://127.0.0.1:5000/api

5. Selenium Setup

Download the appropriate WebDriver for your browser:

Chrome: ChromeDriver

Firefox: GeckoDriver

Add the WebDriver to your system PATH or place it in the backend directory

🚀 Running the Application
cd backend
python app.py

Start Frontend Development Server

cd frontend
npm start
# or
yarn start

Run the Web Scraper (Optional)

cd backend
python scraper.py

🤔 Assumptions & Design Decisions

Job Type Default: Defaults to "Full-time" unless indicated otherwise

Tags Storage: Stored as comma-separated strings (could be normalized for scalability)

Posting Date: Relative dates like "2 days ago" are converted to ISO format when possible

No Authentication: Out of scope for this project

Scraping Limit: Only first 50-100 jobs scraped for demo purposes

Client-Side Validation: Both client and server-side validation implemented

🚧 Challenges & Solutions
Challenge 1: Dynamic Content Loading

Problem: Actuary List uses infinite scroll/dynamic loading.
Solution: Used Selenium explicit waits, scrolling, and retry logic.

Challenge 2: CORS Issues

Problem: React frontend couldn't communicate with Flask backend.
Solution: Configured Flask-CORS for cross-origin requests.

Challenge 3: State Management

Problem: Keeping UI synced with backend after CRUD operations.
Solution: Implemented React Query for automatic cache invalidation and refetching.

Challenge 4: Duplicate Prevention

Problem: Multiple scraper runs created duplicates.
Solution: Added duplicate checking logic using title + company.

👨‍💻 Author

Jawad Ali
Email: jsidd350@gmail.com

