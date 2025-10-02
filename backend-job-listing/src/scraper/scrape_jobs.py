# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.webdriver.chrome.service import Service
# from webdriver_manager.chrome import ChromeDriverManager
# import time
# from datetime import datetime, timedelta
# import re

# # Import your database and model
# import sys
# sys.path.append('..')  # Add parent directory to path
# from src.models.jobs import Job
# from src.db import db
# from src.app import create_app


# def init_driver():
#     """Initialize Chrome WebDriver with options."""
#     options = webdriver.ChromeOptions()
#     # Run in headless mode (no browser window)
#     options.add_argument('--headless')
#     options.add_argument('--disable-gpu')
#     options.add_argument('--no-sandbox')
#     options.add_argument('--disable-dev-shm-usage')
#     options.add_argument('--window-size=1920,1080')
#     options.add_argument('--disable-blink-features=AutomationControlled')
#     options.add_experimental_option("excludeSwitches", ["enable-automation"])
#     options.add_experimental_option('useAutomationExtension', False)
    
#     # Initialize driver
#     service = Service(ChromeDriverManager().install())
#     driver = webdriver.Chrome(service=service, options=options)
#     return driver


# def parse_date(date_text):
#     """Parse relative date strings like '16h ago', '1d ago' into datetime."""
#     try:
#         now = datetime.now()
#         date_text = date_text.lower().strip()
        
#         if 'h ago' in date_text or 'hour' in date_text:
#             # Hours ago
#             hours = int(re.search(r'(\d+)', date_text).group(1))
#             return now - timedelta(hours=hours)
#         elif 'd ago' in date_text or 'day' in date_text:
#             # Days ago
#             days = int(re.search(r'(\d+)', date_text).group(1))
#             return now - timedelta(days=days)
#         elif 'w ago' in date_text or 'week' in date_text:
#             # Weeks ago
#             weeks = int(re.search(r'(\d+)', date_text).group(1))
#             return now - timedelta(weeks=weeks)
#         else:
#             return now
#     except:
#         return datetime.now()


# def scrape_actuarylist():
#     """
#     Scrape job listings from actuarylist.com
#     """
#     print("Starting scraper...")
    
#     # Initialize driver
#     driver = init_driver()
    
#     try:
#         # Navigate to the website
#         url = "https://www.actuarylist.com"
#         print(f"Navigating to {url}...")
#         driver.get(url)
        
#         # Wait longer for the page to fully load (Next.js app)
#         print("Waiting for page to load...")
#         time.sleep(5)
        
#         # Try to find job cards - actuarylist.com uses a card-based layout
#         # Common selectors for job listings
#         possible_selectors = [
#             "a[href^='/jobs/']",  # Links to job pages
#             "div.job-card",
#             "div[class*='job']",
#             "article",
#             "li[class*='job']"
#         ]
        
#         job_elements = None
#         used_selector = None
        
#         for selector in possible_selectors:
#             try:
#                 elements = driver.find_elements(By.CSS_SELECTOR, selector)
#                 if len(elements) > 5:  # If we find more than 5, likely the right selector
#                     job_elements = elements
#                     used_selector = selector
#                     print(f"Found {len(elements)} elements using selector: {selector}")
#                     break
#             except:
#                 continue
        
#         if not job_elements:
#             print("Could not find job listings. Trying alternative approach...")
#             # Get all links that might be job postings
#             all_links = driver.find_elements(By.TAG_NAME, "a")
#             job_elements = [link for link in all_links if '/jobs/' in link.get_attribute('href') or '']
#             print(f"Found {len(job_elements)} potential job links")
        
#         if not job_elements or len(job_elements) == 0:
#             print("No job elements found!")
#             print("Page source preview:")
#             print(driver.page_source[:500])
#             return []
        
#         jobs_data = []
        
#         # Loop through each job element
#         for idx, job_element in enumerate(job_elements[:50], 1):  # Limit to first 50
#             try:
#                 # Get all text from the element
#                 element_text = job_element.text
                
#                 if not element_text or len(element_text.strip()) < 10:
#                     continue
                
#                 # Split text into lines
#                 lines = [line.strip() for line in element_text.split('\n') if line.strip()]
                
#                 if len(lines) < 2:
#                     continue
                
#                 # First line is usually company
#                 company = lines[0]
                
#                 # Second line is usually title
#                 title = lines[1] if len(lines) > 1 else "Not specified"
                
#                 # Look for location (usually contains city/state or country emoji)
#                 location = "Remote"
#                 for line in lines:
#                     if any(keyword in line.lower() for keyword in ['usa', 'uk', '🇺🇸', '🇬🇧', 'remote']) or \
#                        any(char.isupper() and char.isalpha() for char in line):
#                         location = line
#                         break
                
#                 # Look for date posted (contains 'ago')
#                 posting_date = datetime.now()
#                 for line in lines:
#                     if 'ago' in line.lower():
#                         posting_date = parse_date(line)
#                         break
                
#                 # Determine job type
#                 job_type = "Full-time"
#                 combined_text = ' '.join(lines).lower()
#                 if "intern" in combined_text:
#                     job_type = "Internship"
#                 elif "part-time" in combined_text or "part time" in combined_text:
#                     job_type = "Part-time"
#                 elif "contract" in combined_text:
#                     job_type = "Contract"
                
#                 # Extract tags/keywords
#                 tags = []
#                 if "graduate" in combined_text or "entry level" in combined_text:
#                     tags.append("entry-level")
#                 if "senior" in combined_text:
#                     tags.append("senior")
#                 if "remote" in combined_text:
#                     tags.append("remote")
#                 if "pricing" in combined_text:
#                     tags.append("pricing")
#                 if "analyst" in combined_text:
#                     tags.append("analyst")
                
#                 tags_string = ','.join(tags) if tags else ""
                
#                 job_data = {
#                     'title': title[:200],  # Limit length
#                     'company': company[:200],
#                     'location': location[:200],
#                     'posting_date': posting_date,
#                     'job_type': job_type,
#                     'tags': tags_string
#                 }
                
#                 jobs_data.append(job_data)
#                 print(f"{idx}. Scraped: {title} at {company}")
                
#             except Exception as e:
#                 print(f"Error scraping job {idx}: {e}")
#                 continue
        
#         return jobs_data
        
#     except Exception as e:
#         print(f"Error during scraping: {e}")
#         import traceback
#         traceback.print_exc()
#         return []
        
#     finally:
#         # Close the browser
#         driver.quit()
#         print("Browser closed")


# def save_to_database(jobs_data):
#     """Save scraped jobs to database."""
#     app = create_app()
#     with app.app_context():
#         saved_count = 0
#         duplicate_count = 0
        
#         for job_data in jobs_data:
#             # Check for duplicates
#             existing_job = Job.query.filter_by(
#                 title=job_data['title'],
#                 company=job_data['company']
#             ).first()
            
#             if existing_job:
#                 print(f"Duplicate found: {job_data['title']} at {job_data['company']}")
#                 duplicate_count += 1
#                 continue
            
#             # Create new job
#             new_job = Job(**job_data)
#             db.session.add(new_job)
#             saved_count += 1
        
#         # Commit all changes
#         try:
#             db.session.commit()
#             print(f"\nSaved {saved_count} new jobs to database")
#             print(f"Skipped {duplicate_count} duplicates")
#         except Exception as e:
#             db.session.rollback()
#             print(f"Error saving to database: {e}")


# if __name__ == "__main__":
#     print("=" * 50)
#     print("Actuary List Job Scraper")
#     print("=" * 50)
    
#     # Scrape jobs
#     jobs = scrape_actuarylist()
    
#     if jobs:
#         print(f"\nSuccessfully scraped {len(jobs)} jobs")
        
#         # Save to database
#         print("\nSaving to database...")
#         save_to_database(jobs)
#         print("\nScraping completed!")
#     else:
#         print("\nNo jobs scraped - please check selectors and page structure")



from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
from datetime import datetime, timedelta
import re

# Import your database and model
import sys
sys.path.append('..')  # Add parent directory to path
from src.models.jobs import Job
from src.db import db
from src.app import create_app


# Configuration
MAX_PAGES = 10  # Maximum number of pages to scrape
SCRAPE_ALL = True  # Set to False to only scrape new jobs since last run
SCROLL_PAUSE_TIME = 2  # Time to wait while scrolling


def init_driver():
    """Initialize Chrome WebDriver with options."""
    options = webdriver.ChromeOptions()
    # Run in headless mode (no browser window)
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    
    # Initialize driver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    return driver


def parse_date(date_text):
    """Parse relative date strings like '16h ago', '1d ago' into datetime."""
    try:
        now = datetime.now()
        date_text = date_text.lower().strip()
        
        if 'h ago' in date_text or 'hour' in date_text:
            # Hours ago
            hours = int(re.search(r'(\d+)', date_text).group(1))
            return now - timedelta(hours=hours)
        elif 'd ago' in date_text or 'day' in date_text:
            # Days ago
            days = int(re.search(r'(\d+)', date_text).group(1))
            return now - timedelta(days=days)
        elif 'w ago' in date_text or 'week' in date_text:
            # Weeks ago
            weeks = int(re.search(r'(\d+)', date_text).group(1))
            return now - timedelta(weeks=weeks)
        elif 'm ago' in date_text or 'month' in date_text:
            # Months ago
            months = int(re.search(r'(\d+)', date_text).group(1))
            return now - timedelta(days=months*30)
        else:
            return now
    except:
        return datetime.now()


def scroll_to_load_more(driver, max_scrolls=10):
    """Scroll down to load more jobs if using infinite scroll."""
    last_height = driver.execute_script("return document.body.scrollHeight")
    scrolls = 0
    
    while scrolls < max_scrolls:
        # Scroll down to bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        
        # Wait to load page
        time.sleep(SCROLL_PAUSE_TIME)
        
        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        
        if new_height == last_height:
            # Try clicking "Load More" button if it exists
            try:
                load_more = driver.find_element(By.XPATH, "//*[contains(text(), 'Load More') or contains(text(), 'Show More')]")
                load_more.click()
                time.sleep(SCROLL_PAUSE_TIME)
                new_height = driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break
            except:
                break
        
        last_height = new_height
        scrolls += 1
        print(f"Scrolled {scrolls} times...")
    
    print(f"Finished scrolling after {scrolls} attempts")


def try_navigate_to_next_page(driver, current_page):
    """Try to navigate to next page if pagination exists."""
    try:
        # Common pagination selectors
        next_selectors = [
            f"a[href*='page={current_page + 1}']",
            "a[aria-label='Next']",
            "a[aria-label='Next page']",
            "button[aria-label='Next']",
            "a:contains('Next')",
            ".pagination a.next",
            "a.next-page"
        ]
        
        for selector in next_selectors:
            try:
                next_button = driver.find_element(By.CSS_SELECTOR, selector)
                next_button.click()
                time.sleep(3)
                print(f"Navigated to page {current_page + 1}")
                return True
            except:
                continue
        
        # Try URL-based pagination
        current_url = driver.current_url
        if '?' in current_url:
            next_url = f"{current_url}&page={current_page + 1}"
        else:
            next_url = f"{current_url}?page={current_page + 1}"
        
        driver.get(next_url)
        time.sleep(3)
        print(f"Tried URL pagination: page {current_page + 1}")
        return True
        
    except Exception as e:
        print(f"Could not navigate to next page: {e}")
        return False


def scrape_actuarylist(max_pages=MAX_PAGES, scrape_all=SCRAPE_ALL):
    """
    Scrape job listings from actuarylist.com
    
    Args:
        max_pages: Maximum number of pages to scrape
        scrape_all: If False, stops when encountering jobs already in DB
    """
    print("Starting scraper...")
    
    # Initialize driver
    driver = init_driver()
    
    try:
        # Navigate to the website
        url = "https://www.actuarylist.com"
        print(f"Navigating to {url}...")
        driver.get(url)
        
        # Wait longer for the page to fully load (Next.js app)
        print("Waiting for page to load...")
        time.sleep(5)
        
        # Try infinite scroll first (common for modern sites)
        print("Attempting to load more jobs via scrolling...")
        scroll_to_load_more(driver, max_scrolls=15)
        
        all_jobs_data = []
        page = 1
        
        while page <= max_pages:
            print(f"\n--- Scraping Page {page} ---")
            
            # Try to find job cards
            possible_selectors = [
                "a[href^='/jobs/']",
                "div.job-card",
                "div[class*='job']",
                "article",
                "li[class*='job']"
            ]
            
            job_elements = None
            
            for selector in possible_selectors:
                try:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    if len(elements) > 5:
                        job_elements = elements
                        print(f"Found {len(elements)} elements using selector: {selector}")
                        break
                except:
                    continue
            
            if not job_elements:
                print("Trying alternative approach...")
                all_links = driver.find_elements(By.TAG_NAME, "a")
                job_elements = [link for link in all_links if link.get_attribute('href') and '/jobs/' in link.get_attribute('href')]
                print(f"Found {len(job_elements)} potential job links")
            
            if not job_elements or len(job_elements) == 0:
                print("No more job elements found!")
                break
            
            # Track how many we had before this page
            jobs_before = len(all_jobs_data)
            
            # Loop through each job element
            for idx, job_element in enumerate(job_elements, 1):
                try:
                    element_text = job_element.text
                    
                    if not element_text or len(element_text.strip()) < 10:
                        continue
                    
                    lines = [line.strip() for line in element_text.split('\n') if line.strip()]
                    
                    if len(lines) < 2:
                        continue
                    
                    company = lines[0]
                    title = lines[1] if len(lines) > 1 else "Not specified"
                    
                    # Check for duplicates in our scraped data
                    if any(job['title'] == title and job['company'] == company for job in all_jobs_data):
                        continue
                    
                    # If not scraping all, check database for existing job
                    if not scrape_all:
                        app = create_app()
                        with app.app_context():
                            existing = Job.query.filter_by(title=title, company=company).first()
                            if existing:
                                print(f"Found existing job in DB, stopping scrape...")
                                return all_jobs_data
                    
                    location = "Remote"
                    for line in lines:
                        if any(keyword in line.lower() for keyword in ['usa', 'uk', '🇺🇸', '🇬🇧', 'remote']) or \
                           any(char.isupper() and char.isalpha() for char in line):
                            location = line
                            break
                    
                    posting_date = datetime.now()
                    for line in lines:
                        if 'ago' in line.lower():
                            posting_date = parse_date(line)
                            break
                    
                    job_type = "Full-time"
                    combined_text = ' '.join(lines).lower()
                    if "intern" in combined_text:
                        job_type = "Internship"
                    elif "part-time" in combined_text or "part time" in combined_text:
                        job_type = "Part-time"
                    elif "contract" in combined_text:
                        job_type = "Contract"
                    
                    tags = []
                    if "graduate" in combined_text or "entry level" in combined_text:
                        tags.append("entry-level")
                    if "senior" in combined_text:
                        tags.append("senior")
                    if "remote" in combined_text:
                        tags.append("remote")
                    if "pricing" in combined_text:
                        tags.append("pricing")
                    if "analyst" in combined_text:
                        tags.append("analyst")
                    
                    tags_string = ','.join(tags) if tags else ""
                    
                    job_data = {
                        'title': title[:200],
                        'company': company[:200],
                        'location': location[:200],
                        'posting_date': posting_date,
                        'job_type': job_type,
                        'tags': tags_string
                    }
                    
                    all_jobs_data.append(job_data)
                    print(f"{len(all_jobs_data)}. Scraped: {title} at {company}")
                    
                except Exception as e:
                    continue
            
            # Check if we got new jobs on this page
            jobs_on_page = len(all_jobs_data) - jobs_before
            print(f"Scraped {jobs_on_page} new jobs from page {page}")
            
            if jobs_on_page == 0:
                print("No new jobs found on this page, stopping pagination")
                break
            
            # Try to go to next page
            if page < max_pages:
                if not try_navigate_to_next_page(driver, page):
                    print("No more pages available")
                    break
            
            page += 1
        
        return all_jobs_data
        
    except Exception as e:
        print(f"Error during scraping: {e}")
        import traceback
        traceback.print_exc()
        return []
        
    finally:
        driver.quit()
        print("Browser closed")


def save_to_database(jobs_data):
    """Save scraped jobs to database."""
    app = create_app()
    with app.app_context():
        saved_count = 0
        duplicate_count = 0
        
        for job_data in jobs_data:
            existing_job = Job.query.filter_by(
                title=job_data['title'],
                company=job_data['company']
            ).first()
            
            if existing_job:
                duplicate_count += 1
                continue
            
            new_job = Job(**job_data)
            db.session.add(new_job)
            saved_count += 1
        
        try:
            db.session.commit()
            print(f"\n✓ Saved {saved_count} new jobs to database")
            print(f"✗ Skipped {duplicate_count} duplicates")
        except Exception as e:
            db.session.rollback()
            print(f"Error saving to database: {e}")


if __name__ == "__main__":
    print("=" * 50)
    print("Actuary List Job Scraper")
    print("=" * 50)
    print(f"Max pages: {MAX_PAGES}")
    print(f"Scrape all: {SCRAPE_ALL}")
    print("=" * 50)
    
    # Scrape jobs
    jobs = scrape_actuarylist(max_pages=MAX_PAGES, scrape_all=SCRAPE_ALL)
    
    if jobs:
        print(f"\n{'='*50}")
        print(f"Successfully scraped {len(jobs)} total jobs")
        print(f"{'='*50}")
        
        # Save to database
        print("\nSaving to database...")
        save_to_database(jobs)
        print("\nScraping completed!")
    else:
        print("\nNo jobs scraped - please check selectors and page structure")