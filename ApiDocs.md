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






