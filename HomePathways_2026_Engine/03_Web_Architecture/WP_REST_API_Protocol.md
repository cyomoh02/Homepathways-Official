# WordPress REST API Protocol

## Mission Statement

Define the technical protocol for automated content publishing from the Ghostwriter Agent to WordPress using the REST API with Application Password authentication, enabling seamless draft creation while maintaining editorial control.

---

## Architecture Overview

### Workflow

```
Ghostwriter Agent (Creates Content)
         ↓
REST API Request (Authenticated)
         ↓
WordPress Installation (/blog/)
         ↓
Draft Post Created (Status: Draft)
         ↓
Human Review & Approval
         ↓
Published Post (Status: Publish)
```

**Key Principle**: Automation creates drafts, humans publish. This maintains quality control while eliminating manual content entry.

---

## WordPress REST API Setup

### Prerequisites

1. **WordPress Version**: 5.6+ (Application Passwords introduced in WP 5.6)
2. **PHP Version**: 7.4+ recommended
3. **HTTPS**: Required for Application Password security
4. **Permalink Structure**: Must be set to "Post name" or custom structure (not "Plain")

### Installation Location

- **URL**: `https://homepathways.ca/blog/`
- **REST API Endpoint**: `https://homepathways.ca/blog/wp-json/wp/v2/`

---

## Application Password Configuration

### Step 1: Create Application Password

**In WordPress Admin**:

1. Navigate to: **Users → Profile**
2. Scroll to: **Application Passwords** section
3. Enter Application Name: `Ghostwriter Agent - HomePathways Engine`
4. Click: **Add New Application Password**
5. **CRITICAL**: Copy the generated password immediately (shown only once)

**Generated Password Format**: `xxxx xxxx xxxx xxxx xxxx xxxx` (24 characters with spaces)

**Storage**: Store securely in environment variables or secure credential manager

### Step 2: User Permissions

**Required User Role**: Editor or Administrator

**Capabilities Needed**:

- `edit_posts`
- `publish_posts`
- `upload_files`
- `edit_published_posts`

**Recommended**: Create dedicated user account for API automation

- **Username**: `ghostwriter-api`
- **Role**: Editor
- **Email**: `api@homepathways.ca` (or internal email)
- **Display Name**: `HomePathways Engine`

---

## REST API Endpoints

### Base URL

```
https://homepathways.ca/blog/wp-json/wp/v2/
```

### Key Endpoints for Content Publishing

#### 1. Create Post (Draft)

**Endpoint**: `POST /wp-json/wp/v2/posts`

**Purpose**: Create new blog post as draft

**Authentication**: Basic Auth (Username + Application Password)

**Request Headers**:

```
Content-Type: application/json
Authorization: Basic [base64_encoded_credentials]
```

**Request Body** (JSON):

```json
{
  "title": "227 Days: What Executors Need to Know About BC Probate in 2026",
  "content": "<p>Full HTML content of the blog post...</p>",
  "excerpt": "The BC Supreme Court probate process currently averages 227 days. Here's what executors need to know to navigate the backlog.",
  "status": "draft",
  "categories": [12],
  "tags": [45, 67, 89],
  "featured_media": 0,
  "meta": {
    "persona_target": "Probate Executor",
    "content_protocol": "1-3-Story-1"
  }
}
```

**Response** (Success - 201 Created):

```json
{
  "id": 1234,
  "date": "2026-02-26T13:30:00",
  "status": "draft",
  "link": "https://homepathways.ca/blog/?p=1234&preview=true",
  "title": {
    "rendered": "227 Days: What Executors Need to Know About BC Probate in 2026"
  }
}
```

---

#### 2. Upload Featured Image

**Endpoint**: `POST /wp-json/wp/v2/media`

**Purpose**: Upload featured image for blog post

**Authentication**: Basic Auth

**Request Headers**:

```
Content-Type: image/jpeg (or image/png, image/webp)
Content-Disposition: attachment; filename="probate-executor-guide-2026.jpg"
Authorization: Basic [base64_encoded_credentials]
```

**Request Body**: Binary image data

**Response** (Success - 201 Created):

```json
{
  "id": 5678,
  "source_url": "https://homepathways.ca/blog/wp-content/uploads/2026/02/probate-executor-guide-2026.jpg",
  "media_type": "image",
  "mime_type": "image/jpeg"
}
```

**Then Update Post with Featured Image**:

```json
PUT /wp-json/wp/v2/posts/1234
{
  "featured_media": 5678
}
```

---

#### 3. Get Categories

**Endpoint**: `GET /wp-json/wp/v2/categories`

**Purpose**: Retrieve category IDs for post assignment

**Authentication**: Not required for GET (but include for consistency)

**Response**:

```json
[
  {
    "id": 12,
    "name": "Probate",
    "slug": "probate"
  },
  {
    "id": 13,
    "name": "Aging in Place",
    "slug": "aging-in-place"
  },
  {
    "id": 14,
    "name": "Rightsizing",
    "slug": "rightsizing"
  }
]
```

---

#### 4. Get/Create Tags

**Endpoint**: `GET /wp-json/wp/v2/tags`

**Purpose**: Retrieve existing tags or create new ones

**Create New Tag**:

```json
POST /wp-json/wp/v2/tags
{
  "name": "227-day probate backlog",
  "slug": "227-day-probate-backlog"
}
```

---

## Authentication Implementation

### Method: HTTP Basic Authentication

**Format**: `Authorization: Basic [base64_encoded_credentials]`

**Credentials Format**: `username:application_password`

### Example (Python)

```python
import requests
import base64

# Configuration
WP_URL = "https://homepathways.ca/blog"
WP_USERNAME = "ghostwriter-api"
WP_APP_PASSWORD = "xxxx xxxx xxxx xxxx xxxx xxxx"  # From WordPress

# Remove spaces from application password
WP_APP_PASSWORD_CLEAN = WP_APP_PASSWORD.replace(" ", "")

# Create credentials string
credentials = f"{WP_USERNAME}:{WP_APP_PASSWORD_CLEAN}"

# Encode to base64
credentials_base64 = base64.b64encode(credentials.encode()).decode()

# Headers
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Basic {credentials_base64}"
}

# Create post
post_data = {
    "title": "Your Post Title",
    "content": "<p>Your post content in HTML</p>",
    "status": "draft",
    "categories": [12]
}

response = requests.post(
    f"{WP_URL}/wp-json/wp/v2/posts",
    headers=headers,
    json=post_data
)

if response.status_code == 201:
    post_id = response.json()["id"]
    print(f"Draft created successfully! Post ID: {post_id}")
else:
    print(f"Error: {response.status_code} - {response.text}")
```

---

### Example (Node.js)

```javascript
const axios = require("axios");

// Configuration
const WP_URL = "https://homepathways.ca/blog";
const WP_USERNAME = "ghostwriter-api";
const WP_APP_PASSWORD = "xxxx xxxx xxxx xxxx xxxx xxxx";

// Remove spaces from application password
const WP_APP_PASSWORD_CLEAN = WP_APP_PASSWORD.replace(/\s/g, "");

// Create credentials
const credentials = Buffer.from(
  `${WP_USERNAME}:${WP_APP_PASSWORD_CLEAN}`,
).toString("base64");

// Headers
const headers = {
  "Content-Type": "application/json",
  Authorization: `Basic ${credentials}`,
};

// Create post
const postData = {
  title: "Your Post Title",
  content: "<p>Your post content in HTML</p>",
  status: "draft",
  categories: [12],
};

axios
  .post(`${WP_URL}/wp-json/wp/v2/posts`, postData, { headers })
  .then((response) => {
    console.log(`Draft created successfully! Post ID: ${response.data.id}`);
  })
  .catch((error) => {
    console.error(
      `Error: ${error.response.status} - ${error.response.data.message}`,
    );
  });
```

---

## Category & Tag Mapping

### Category Structure (Aligned with 12 Personas)

| Category ID | Category Name     | Slug              | Persona Alignment                       |
| ----------- | ----------------- | ----------------- | --------------------------------------- |
| 12          | Probate           | probate           | Probate Executor, Legacy Planner        |
| 13          | Aging in Place    | aging-in-place    | Equity-Rich Senior, Reluctant Downsizer |
| 14          | Rightsizing       | rightsizing       | Reluctant Downsizer, Empty Nesters      |
| 15          | First-Time Buyers | first-time-buyers | First-Time Buyer (Stretched)            |
| 16          | Family Housing    | family-housing    | Sandwich Generation, Upmovers           |
| 17          | Relocation        | relocation        | Corporate Relocators (In/Out)           |
| 18          | Market Insights   | market-insights   | All Personas                            |
| 19          | Policy Updates    | policy-updates    | All Personas                            |
| 20          | Investment        | investment        | Presale Investor, Accidental Landlord   |

### Tag Strategy

**Tag Types**:

1. **Data Tags**: Specific statistics
   - `227-day-probate-backlog`
   - `6-45-percent-tax-deferral`
   - `2-percent-suite-loan`

2. **Topic Tags**: Specific subjects
   - `estate-planning`
   - `multi-generational-housing`
   - `property-tax-strategies`

3. **Location Tags**: Geographic relevance
   - `fraser-valley`
   - `metro-vancouver`
   - `bc-real-estate`

4. **Persona Tags**: Target audience
   - `executors`
   - `seniors`
   - `first-time-buyers`

**Tagging Protocol**: 3-7 tags per post (mix of types)

---

## Content Formatting for WordPress

### HTML Structure

WordPress expects HTML content in the `content` field. The Ghostwriter Agent should format content as:

```html
<p class="article-intro">Opening paragraph with hook...</p>

<h2>Section Heading</h2>
<p>Section content...</p>

<h3>Subsection</h3>
<p>Subsection content...</p>

<blockquote>
  <p>"Important quote or statistic"</p>
</blockquote>

<ul>
  <li>Bullet point 1</li>
  <li>Bullet point 2</li>
</ul>

<div class="key-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li>Takeaway 1</li>
    <li>Takeaway 2</li>
  </ul>
</div>

<p class="cta-paragraph">
  <a href="https://homepathways.ca/assessment.html" class="cta-button"
    >Take the Pathway Assessment →</a
  >
</p>
```

### Excerpt Generation

**Purpose**: Meta description and preview text

**Length**: 150-160 characters

**Format**: Plain text (no HTML)

**Example**:

```
"The BC Supreme Court probate process currently averages 227 days. Here's what executors need to know to navigate the backlog and protect estate value."
```

---

## Error Handling

### Common Errors & Solutions

#### 401 Unauthorized

**Error**:

```json
{
  "code": "rest_forbidden",
  "message": "Sorry, you are not allowed to create posts as this user.",
  "data": { "status": 401 }
}
```

**Solutions**:

- Verify Application Password is correct (no typos, spaces removed)
- Check username is correct
- Ensure user has Editor or Administrator role
- Confirm HTTPS is being used

---

#### 400 Bad Request

**Error**:

```json
{
  "code": "rest_invalid_param",
  "message": "Invalid parameter(s): content",
  "data": { "status": 400 }
}
```

**Solutions**:

- Validate JSON structure
- Ensure required fields are present (title, content)
- Check HTML is properly escaped
- Verify category/tag IDs exist

---

#### 403 Forbidden

**Error**:

```json
{
  "code": "rest_cannot_create",
  "message": "Sorry, you are not allowed to create posts as this user.",
  "data": { "status": 403 }
}
```

**Solutions**:

- Check user capabilities (needs `edit_posts`)
- Verify Application Password hasn't been revoked
- Ensure REST API is enabled (check .htaccess, security plugins)

---

#### 500 Internal Server Error

**Error**: Generic server error

**Solutions**:

- Check WordPress error logs
- Verify database connection
- Check for plugin conflicts
- Ensure adequate server resources

---

## Security Best Practices

### 1. Credential Management

**DO**:

- Store Application Password in environment variables
- Use secure credential management system (AWS Secrets Manager, Azure Key Vault)
- Rotate Application Passwords quarterly
- Use dedicated API user account

**DON'T**:

- Hardcode passwords in scripts
- Commit credentials to version control
- Share Application Passwords across multiple systems
- Use admin account for API access

---

### 2. API Access Control

**Implement**:

- IP whitelisting (if possible)
- Rate limiting (WordPress plugins available)
- Request logging and monitoring
- Failed authentication alerts

**WordPress Plugins for Security**:

- Wordfence Security
- iThemes Security
- All In One WP Security & Firewall

---

### 3. HTTPS Enforcement

**Required**: All API requests must use HTTPS

**Verify**:

```bash
curl -I https://homepathways.ca/blog/wp-json/wp/v2/posts
```

Should return: `HTTP/2 200` (not HTTP/1.1 301 redirect)

---

## Testing & Validation

### Test Endpoint Availability

```bash
curl https://homepathways.ca/blog/wp-json/wp/v2/posts
```

**Expected**: JSON response with recent posts (or empty array)

### Test Authentication

```bash
curl -X POST https://homepathways.ca/blog/wp-json/wp/v2/posts \
  -H "Content-Type: application/json" \
  -u "ghostwriter-api:xxxx xxxx xxxx xxxx xxxx xxxx" \
  -d '{
    "title": "API Test Post",
    "content": "<p>Testing REST API connection</p>",
    "status": "draft"
  }'
```

**Expected**: 201 Created with post ID

### Test Draft Creation

**Checklist**:

- [ ] Post created with status "draft"
- [ ] Title renders correctly
- [ ] Content HTML displays properly
- [ ] Categories assigned correctly
- [ ] Tags assigned correctly
- [ ] Featured image attached (if provided)
- [ ] Excerpt displays in preview
- [ ] Author set to API user

---

## Automation Workflow

### Ghostwriter Agent → WordPress Pipeline

**Step 1: Content Creation**

- Ghostwriter Agent generates blog post following 1-3-Story-1 protocol
- Content formatted as HTML
- Metadata prepared (title, excerpt, categories, tags)

**Step 2: Category/Tag Resolution**

- Query WordPress for category IDs
- Query WordPress for existing tags
- Create new tags if needed
- Map persona to appropriate category

**Step 3: Image Handling** (Optional)

- Generate or select featured image
- Upload via `/wp-json/wp/v2/media`
- Retrieve media ID

**Step 4: Draft Creation**

- POST to `/wp-json/wp/v2/posts` with status "draft"
- Include all metadata
- Attach featured image ID

**Step 5: Notification**

- Log successful creation
- Notify human editor (email, Slack, dashboard)
- Provide preview link for review

**Step 6: Human Review**

- Editor reviews draft in WordPress admin
- Makes any necessary edits
- Adds custom fields (Yoast SEO, etc.)
- Publishes when ready

---

## Scheduler Integration

### Automated Posting Schedule

**Frequency**: 2-3 posts per week

**Optimal Days**: Tuesday, Thursday, Saturday (based on engagement data)

**Optimal Time**: 9:00 AM PT (when target audience most active)

### Scheduler Logic

```python
# Pseudocode for scheduler
def schedule_blog_posts():
    # Get content queue from Ghostwriter Agent
    content_queue = get_pending_content()

    # Define posting schedule
    posting_days = ['Tuesday', 'Thursday', 'Saturday']
    posting_time = '09:00:00'

    for content in content_queue:
        # Find next available posting slot
        next_slot = get_next_posting_slot(posting_days, posting_time)

        # Create draft in WordPress
        post_id = create_wordpress_draft(content)

        # Log for human review
        log_draft_for_review(post_id, next_slot)

        # Optional: Auto-schedule publish time in WordPress
        # (requires additional plugin or custom code)
```

---

## Monitoring & Logging

### Log All API Interactions

**Log Format**:

```json
{
  "timestamp": "2026-02-26T13:30:00-08:00",
  "action": "create_post",
  "endpoint": "/wp-json/wp/v2/posts",
  "status_code": 201,
  "post_id": 1234,
  "post_title": "227 Days: What Executors Need to Know",
  "category": "Probate",
  "tags": ["227-day-probate-backlog", "estate-planning"],
  "user": "ghostwriter-api"
}
```

### Monitor Metrics

- **Success Rate**: % of successful draft creations
- **Error Rate**: % of failed API calls
- **Response Time**: Average API response time
- **Draft-to-Publish Time**: Time from draft creation to human publish
- **Content Volume**: Posts created per week/month

### Alert Conditions

- Authentication failures (3+ in 1 hour)
- API unavailable (500 errors)
- Unusual activity patterns
- Draft backlog exceeds threshold (10+ unpublished drafts)

---

## WordPress Plugin Requirements

### Essential Plugins

1. **Yoast SEO** or **Rank Math**
   - Purpose: Schema markup, meta descriptions, SEO optimization
   - REST API: Extends post endpoint with SEO fields

2. **Application Passwords** (Core in WP 5.6+)
   - Purpose: Secure API authentication
   - No additional plugin needed

3. **Wordfence Security**
   - Purpose: Security, firewall, malware scanning
   - Configuration: Whitelist API user IP if possible

4. **WP Rocket** or **W3 Total Cache**
   - Purpose: Performance optimization
   - Configuration: Exclude REST API from caching

### Optional Plugins

5. **Advanced Custom Fields (ACF)**
   - Purpose: Custom metadata fields
   - REST API: Expose custom fields via API

6. **PublishPress**
   - Purpose: Editorial workflow, content calendar
   - Use: Human review and scheduling

---

## Troubleshooting Guide

### Issue: "REST API disabled"

**Check**:

1. Permalink structure (must not be "Plain")
2. `.htaccess` file (ensure REST API routes not blocked)
3. Security plugins (may block REST API)

**Solution**:

```php
// In wp-config.php (if needed)
define('REST_API_ENABLED', true);
```

---

### Issue: "Application Password not working"

**Check**:

1. WordPress version (5.6+ required)
2. HTTPS enabled
3. Password copied correctly (remove spaces)
4. User has sufficient permissions

**Solution**: Regenerate Application Password

---

### Issue: "Categories not assigning"

**Check**:

1. Category IDs are correct (query `/wp-json/wp/v2/categories`)
2. User has permission to assign categories
3. Categories exist in WordPress

**Solution**: Create categories first, then use correct IDs

---

## API Rate Limiting

### WordPress Default Limits

- No built-in rate limiting
- Server limits may apply (check hosting provider)

### Recommended Limits (via plugin)

- **Authenticated Requests**: 100 per hour per user
- **Unauthenticated Requests**: 20 per hour per IP

### Implementation

Use plugin: **WP REST API Controller** or **REST API Rate Limiting**

---

## Backup & Recovery

### Before Automation

1. **Full WordPress Backup**: Database + files
2. **Test on Staging**: Verify API workflow on staging site first
3. **Rollback Plan**: Document how to revert changes

### During Operation

1. **Daily Backups**: Automated via hosting or plugin (UpdraftPlus, BackupBuddy)
2. **Version Control**: Track content changes
3. **Draft Retention**: Keep drafts for 30 days before deletion

---

**Last Updated**: February 2026  
**Review Cycle**: Quarterly (security audit) / As needed (troubleshooting)  
**Owner**: Web Architecture Division
