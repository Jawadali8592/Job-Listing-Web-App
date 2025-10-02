# Job Listing API Documentation

## Base URL

---

## Table of Contents
- [Overview](#overview)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Home](#home)
  - [Get All Jobs](#get-all-jobs)
  - [Get Single Job](#get-single-job)
  - [Create Job](#create-job)
  - [Update Job](#update-job)
  - [Delete Job](#delete-job)


---

## Overview
This RESTful API provides complete CRUD operations for managing job listings.  
Features include:
- Pagination
- Search functionality
- Multiple filtering options
- Sorting capabilities
- Input validation
- Comprehensive error handling

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation description",
  "data": {...} 
}
```

# Error Response

{
  "success": false,
  "error": "Error type",
  "message": "Detailed error description"
}

| Status Code | Description                                     |
| ----------- | ----------------------------------------------- |
| 200         | OK - Request succeeded                          |
| 201         | Created - Resource created successfully         |
| 400         | Bad Request - Invalid input or validation error |
| 404         | Not Found - Resource doesn't exist              |
| 500         | Internal Server Error - Unexpected server error |


# Endpoints

# Get All Jobs

GET /jobs

Database connection successful! There are 90 jobs in the 'jobs' table.

| Parameter  | Type    | Required | Default           | Description                                                                |
| ---------- | ------- | -------- | ----------------- | -------------------------------------------------------------------------- |
| `page`     | integer | No       | 1                 | Page number                                                                |
| `per_page` | integer | No       | 20                | Items per page (max: 100)                                                  |
| `search`   | string  | No       | -                 | Search across title, company, and location                                 |
| `job_type` | string  | No       | -                 | Filter by job type (Full-time, Part-time, Contract, Freelance, Internship) |
| `location` | string  | No       | -                 | Filter by location (partial match)                                         |
| `tag`      | string  | No       | -                 | Filter by specific tag                                                     |
| `sort`     | string  | No       | posting_date_desc | Sort order                                                                 |


# Sort Options

posting_date_desc - Newest first (default)

posting_date_asc - Oldest first

title_asc - Title A-Z

title_desc - Title Z-A

# GET /jobs/:id

| Parameter | Type    | Required | Description |
| --------- | ------- | -------- | ----------- |
| `id`      | integer | Yes      | Job ID      |

curl -X GET "http://127.0.0.1:5000/api/jobs/5"

# Create Job

POST /jobs
Content-Type: application/json

Example request

curl -X POST "http://127.0.0.1:5000/api/jobs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Actuary",
    "company": "Insurance Corp",
    "location": "New York, USA",
    "posting_date": "2025-01-15",
    "job_type": "Full-time",
    "tags": ["Life", "Pricing", "FSA"]
  }'


# Update Job

Update an existing job listing (partial or full update).

PATCH /jobs/:id
PUT /jobs/:id

Example Request

Content-Type: application/json

curl -X PATCH "http://127.0.0.1:5000/api/jobs/5" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lead Actuary",
    "job_type": "Full-time",
    "location": "Remote"
  }'

# Delete Job

Delete a job listing by ID.

DELETE /jobs/:id

Example request

curl -X DELETE "http://127.0.0.1:5000/api/jobs/5"


# Filtering
GET /jobs?job_type=Full-time
GET /jobs?location=New York
GET /jobs?tag=Python
GET /jobs?job_type=Full-time&location=Remote&tag=React

# Searching
GET /jobs?search=actuary
GET /jobs?search=senior&job_type=Full-time

# Sorting
GET /jobs?sort=posting_date_desc
GET /jobs?sort=title_asc

# Pagination
GET /jobs?page=2&per_page=50
GET /jobs?job_type=Full-time&page=1&per_page=20&sort=posting_date_desc
