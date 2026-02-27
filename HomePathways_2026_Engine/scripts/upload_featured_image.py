#!/usr/bin/env python3
"""
WordPress Featured Image Upload Script
Uploads image to WordPress Media Library and sets as Featured Image
"""

import requests
import base64
import os

# WordPress Configuration
WP_URL = "https://blog.homepathways.ca"
WP_USERNAME = "sean@homepathways.ca"
WP_APP_PASSWORD = "1dRh oKQ0 FJli WQxy RRCF d9mq"

# Remove spaces from application password
WP_APP_PASSWORD_CLEAN = WP_APP_PASSWORD.replace(" ", "")

# Create credentials
credentials = f"{WP_USERNAME}:{WP_APP_PASSWORD_CLEAN}"
credentials_base64 = base64.b64encode(credentials.encode()).decode()

# Image configuration
IMAGE_PATH = "/Users/trinity-7/Documents/GitHub/Homepathways-Official/HomePathways_2026_Engine/04_Campaigns/Assets/Sandwich_Gap_Hero.jpg"
ALT_TEXT = "BC Homeowner bridging the $69,600 gap using the 6.45% tax deferral and secondary suite incentives in Surrey, BC."
POST_ID = 6

print("=" * 60)
print("WordPress Featured Image Upload")
print("=" * 60)

# Step 1: Upload image to Media Library
print("\n[Step 1/3] Uploading image to WordPress Media Library...")

# Check if file exists
if not os.path.exists(IMAGE_PATH):
    print(f"❌ ERROR: Image file not found at {IMAGE_PATH}")
    exit(1)

# Read image file
with open(IMAGE_PATH, 'rb') as image_file:
    image_data = image_file.read()

# Get filename
filename = os.path.basename(IMAGE_PATH)

# Headers for media upload
media_headers = {
    "Content-Type": "image/jpeg",
    "Content-Disposition": f'attachment; filename="{filename}"',
    "Authorization": f"Basic {credentials_base64}"
}

try:
    # Upload image
    media_response = requests.post(
        f"{WP_URL}/wp-json/wp/v2/media",
        headers=media_headers,
        data=image_data,
        timeout=60
    )
    
    if media_response.status_code == 201:
        media_data = media_response.json()
        media_id = media_data["id"]
        media_url = media_data["source_url"]
        print(f"✅ Image uploaded successfully!")
        print(f"   Media ID: {media_id}")
        print(f"   URL: {media_url}")
    else:
        print(f"❌ ERROR uploading image: {media_response.status_code}")
        print(f"   Response: {media_response.text}")
        exit(1)
        
except requests.exceptions.RequestException as e:
    print(f"❌ CONNECTION ERROR: {e}")
    exit(1)

# Step 2: Update image with Alt Text
print("\n[Step 2/3] Setting Alt Text...")

alt_text_headers = {
    "Content-Type": "application/json",
    "Authorization": f"Basic {credentials_base64}"
}

alt_text_data = {
    "alt_text": ALT_TEXT
}

try:
    alt_response = requests.post(
        f"{WP_URL}/wp-json/wp/v2/media/{media_id}",
        headers=alt_text_headers,
        json=alt_text_data,
        timeout=30
    )
    
    if alt_response.status_code == 200:
        print(f"✅ Alt text set successfully!")
        print(f"   Alt Text: {ALT_TEXT}")
    else:
        print(f"⚠️  WARNING: Could not set alt text: {alt_response.status_code}")
        print(f"   Response: {alt_response.text}")
        
except requests.exceptions.RequestException as e:
    print(f"⚠️  WARNING: Could not set alt text: {e}")

# Step 3: Set as Featured Image for Post
print(f"\n[Step 3/3] Setting as Featured Image for Post ID {POST_ID}...")

post_headers = {
    "Content-Type": "application/json",
    "Authorization": f"Basic {credentials_base64}"
}

post_data = {
    "featured_media": media_id
}

try:
    post_response = requests.post(
        f"{WP_URL}/wp-json/wp/v2/posts/{POST_ID}",
        headers=post_headers,
        json=post_data,
        timeout=30
    )
    
    if post_response.status_code == 200:
        post_data_response = post_response.json()
        post_link = post_data_response["link"]
        print(f"✅ Featured image set successfully!")
        print(f"   Post ID: {POST_ID}")
        print(f"   Featured Media ID: {media_id}")
    else:
        print(f"❌ ERROR setting featured image: {post_response.status_code}")
        print(f"   Response: {post_response.text}")
        exit(1)
        
except requests.exceptions.RequestException as e:
    print(f"❌ CONNECTION ERROR: {e}")
    exit(1)

# Final Summary
print("\n" + "=" * 60)
print("✅ SUCCESS! Featured Image Upload Complete")
print("=" * 60)
print(f"\nPost Details:")
print(f"  Post ID: {POST_ID}")
print(f"  Featured Image ID: {media_id}")
print(f"  Image URL: {media_url}")
print(f"  Alt Text: {ALT_TEXT}")
print(f"\n🔗 Preview Link:")
print(f"  {post_link}")
print(f"\nNext Steps:")
print(f"  1. Review the post with featured image in WordPress")
print(f"  2. Add tags (6-45-percent-tax-deferral, 2-percent-suite-loan, etc.)")
print(f"  3. Configure Yoast SEO / Rank Math")
print(f"  4. Publish when ready")
print("=" * 60)
