#!/usr/bin/env python3
"""
Social Media Webhook Handler
Receives and processes DMs from Instagram/Meta platforms
Integrates with Google Sheets CRM for lead tracking
"""

import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# Flask app for webhook receiver
app = Flask(__name__)

# Configuration
VERIFY_TOKEN = os.getenv('META_VERIFY_TOKEN', 'homepathways_social_2026')
PAGE_ACCESS_TOKEN = os.getenv('META_PAGE_ACCESS_TOKEN', '')
GOOGLE_SHEETS_ID = os.getenv('GOOGLE_SHEETS_ID', '')
GOOGLE_CREDENTIALS_PATH = os.getenv('GOOGLE_CREDENTIALS_PATH', 'credentials.json')

# Initialize Google Sheets API
def get_sheets_service():
    """Initialize Google Sheets API service"""
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    creds = Credentials.from_service_account_file(
        GOOGLE_CREDENTIALS_PATH, scopes=SCOPES)
    service = build('sheets', 'v4', credentials=creds)
    return service

def log_to_crm(lead_data):
    """
    Log social media lead to Google Sheets CRM
    
    Args:
        lead_data (dict): Lead information including source, message, timestamp
    """
    try:
        service = get_sheets_service()
        sheet = service.spreadsheets()
        
        # Prepare row data
        row = [
            lead_data.get('timestamp', datetime.now().isoformat()),
            lead_data.get('source', 'Instagram'),
            lead_data.get('sender_id', ''),
            lead_data.get('sender_name', 'Unknown'),
            lead_data.get('message', ''),
            lead_data.get('phone', ''),
            lead_data.get('email', ''),
            'New',  # Status
            '',  # Notes
            lead_data.get('conversation_id', '')
        ]
        
        # Append to sheet
        result = sheet.values().append(
            spreadsheetId=GOOGLE_SHEETS_ID,
            range='Leads!A:J',
            valueInputOption='RAW',
            body={'values': [row]}
        ).execute()
        
        print(f"✅ Lead logged to CRM: {result.get('updates').get('updatedCells')} cells updated")
        return True
        
    except Exception as e:
        print(f"❌ Error logging to CRM: {e}")
        return False

@app.route('/webhook', methods=['GET'])
def verify_webhook():
    """
    Webhook verification endpoint for Meta
    Meta will send a GET request to verify the webhook
    """
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')
    
    if mode == 'subscribe' and token == VERIFY_TOKEN:
        print('✅ Webhook verified successfully')
        return challenge, 200
    else:
        print('❌ Webhook verification failed')
        return 'Forbidden', 403

@app.route('/webhook', methods=['POST'])
def handle_webhook():
    """
    Main webhook handler for Instagram DMs
    Processes incoming messages and logs to CRM
    """
    try:
        data = request.get_json()
        print(f"📨 Received webhook: {json.dumps(data, indent=2)}")
        
        # Process each entry
        if data.get('object') == 'instagram':
            for entry in data.get('entry', []):
                for messaging_event in entry.get('messaging', []):
                    
                    # Extract sender info
                    sender_id = messaging_event.get('sender', {}).get('id')
                    recipient_id = messaging_event.get('recipient', {}).get('id')
                    timestamp = messaging_event.get('timestamp')
                    
                    # Process message
                    if messaging_event.get('message'):
                        message_text = messaging_event['message'].get('text', '')
                        
                        # Prepare lead data
                        lead_data = {
                            'timestamp': datetime.fromtimestamp(timestamp / 1000).isoformat(),
                            'source': 'Instagram',
                            'sender_id': sender_id,
                            'sender_name': 'Instagram User',  # Will be enriched later
                            'message': message_text,
                            'phone': '',
                            'email': '',
                            'conversation_id': f"ig_{sender_id}_{timestamp}"
                        }
                        
                        # Log to CRM
                        log_to_crm(lead_data)
                        
                        # Send auto-response (optional)
                        send_auto_response(sender_id, message_text)
                        
        return jsonify({'status': 'success'}), 200
        
    except Exception as e:
        print(f"❌ Error processing webhook: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

def send_auto_response(recipient_id, original_message):
    """
    Send automated response to Instagram DM
    
    Args:
        recipient_id (str): Instagram user ID
        original_message (str): Original message from user
    """
    # Auto-response logic
    response_message = (
        "Thanks for reaching out! 🏡\n\n"
        "I'm Claire, Sean's AI assistant. I've received your message and will make sure "
        "Sean gets back to you within 24 hours.\n\n"
        "In the meantime, you can:\n"
        "📞 Book a call: homepathways.ca/booking\n"
        "📧 Email: sean@homepathways.ca\n"
        "📱 Call/Text: 778-949-9889"
    )
    
    # TODO: Implement actual Instagram API call to send message
    # This requires Meta Graph API integration
    print(f"📤 Auto-response sent to {recipient_id}: {response_message}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Social Handler',
        'timestamp': datetime.now().isoformat()
    }), 200

if __name__ == '__main__':
    print("🚀 Social Handler starting...")
    print(f"📍 Webhook URL: http://localhost:5000/webhook")
    print(f"🔐 Verify Token: {VERIFY_TOKEN}")
    app.run(host='0.0.0.0', port=5000, debug=True)
