#!/usr/bin/env python3
"""
Google Calendar Integration for Claire AI
Allows Claire to check availability and book Strategy Sessions
"""

import os
from datetime import datetime, timedelta
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Configuration
GOOGLE_CREDENTIALS_PATH = os.getenv('GOOGLE_CREDENTIALS_PATH', 'credentials.json')
CALENDAR_ID = os.getenv('GOOGLE_CALENDAR_ID', 'primary')
TIMEZONE = 'America/Vancouver'

# Event types and durations
EVENT_TYPES = {
    'strategy_session': {
        'duration': 30,  # minutes
        'title': 'Strategy Session',
        'description': 'Free 30-minute strategy call to discuss your real estate goals'
    },
    'consultation': {
        'duration': 60,
        'title': 'Full Consultation',
        'description': 'Comprehensive consultation for complex transitions'
    }
}

def get_calendar_service():
    """Initialize Google Calendar API service"""
    SCOPES = ['https://www.googleapis.com/auth/calendar']
    creds = Credentials.from_service_account_file(
        GOOGLE_CREDENTIALS_PATH, scopes=SCOPES)
    service = build('calendar', 'v3', credentials=creds)
    return service

def get_available_slots(date_str=None, days_ahead=7, event_type='strategy_session'):
    """
    Get available time slots for booking
    
    Args:
        date_str (str): Starting date in YYYY-MM-DD format (default: today)
        days_ahead (int): Number of days to check ahead
        event_type (str): Type of event to book
        
    Returns:
        list: Available time slots
    """
    try:
        service = get_calendar_service()
        
        # Parse date or use today
        if date_str:
            start_date = datetime.strptime(date_str, '%Y-%m-%d')
        else:
            start_date = datetime.now()
        
        # Define search window
        time_min = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
        time_max = time_min + timedelta(days=days_ahead)
        
        # Get busy times from calendar
        body = {
            "timeMin": time_min.isoformat() + 'Z',
            "timeMax": time_max.isoformat() + 'Z',
            "timeZone": TIMEZONE,
            "items": [{"id": CALENDAR_ID}]
        }
        
        freebusy_result = service.freebusy().query(body=body).execute()
        busy_times = freebusy_result['calendars'][CALENDAR_ID]['busy']
        
        # Define business hours (9 AM - 5 PM, Monday-Friday)
        available_slots = []
        current_date = time_min
        
        while current_date < time_max:
            # Skip weekends
            if current_date.weekday() >= 5:
                current_date += timedelta(days=1)
                continue
            
            # Check each hour during business hours
            for hour in range(9, 17):  # 9 AM to 5 PM
                slot_start = current_date.replace(hour=hour, minute=0, second=0, microsecond=0)
                slot_end = slot_start + timedelta(minutes=EVENT_TYPES[event_type]['duration'])
                
                # Check if slot is available
                is_available = True
                for busy in busy_times:
                    busy_start = datetime.fromisoformat(busy['start'].replace('Z', '+00:00'))
                    busy_end = datetime.fromisoformat(busy['end'].replace('Z', '+00:00'))
                    
                    # Check for overlap
                    if (slot_start < busy_end and slot_end > busy_start):
                        is_available = False
                        break
                
                if is_available:
                    available_slots.append({
                        'start': slot_start.isoformat(),
                        'end': slot_end.isoformat(),
                        'display': slot_start.strftime('%A, %B %d at %I:%M %p PT')
                    })
            
            current_date += timedelta(days=1)
        
        return available_slots[:10]  # Return first 10 available slots
        
    except HttpError as error:
        print(f"❌ Calendar API error: {error}")
        return []

def book_appointment(client_name, client_email, client_phone, slot_start, event_type='strategy_session', notes=''):
    """
    Book an appointment in Google Calendar
    
    Args:
        client_name (str): Client's full name
        client_email (str): Client's email
        client_phone (str): Client's phone number
        slot_start (str): Start time in ISO format
        event_type (str): Type of event
        notes (str): Additional notes
        
    Returns:
        dict: Created event details or None if failed
    """
    try:
        service = get_calendar_service()
        
        # Parse start time
        start_time = datetime.fromisoformat(slot_start)
        end_time = start_time + timedelta(minutes=EVENT_TYPES[event_type]['duration'])
        
        # Create event
        event = {
            'summary': f"{EVENT_TYPES[event_type]['title']} - {client_name}",
            'description': f"{EVENT_TYPES[event_type]['description']}\n\n"
                          f"Client: {client_name}\n"
                          f"Email: {client_email}\n"
                          f"Phone: {client_phone}\n"
                          f"Notes: {notes}",
            'start': {
                'dateTime': start_time.isoformat(),
                'timeZone': TIMEZONE,
            },
            'end': {
                'dateTime': end_time.isoformat(),
                'timeZone': TIMEZONE,
            },
            'attendees': [
                {'email': client_email, 'displayName': client_name}
            ],
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},  # 1 day before
                    {'method': 'popup', 'minutes': 60},  # 1 hour before
                ],
            },
            'conferenceData': {
                'createRequest': {
                    'requestId': f"homepathways-{int(datetime.now().timestamp())}",
                    'conferenceSolutionKey': {'type': 'hangoutsMeet'}
                }
            }
        }
        
        # Insert event
        created_event = service.events().insert(
            calendarId=CALENDAR_ID,
            body=event,
            conferenceDataVersion=1,
            sendUpdates='all'
        ).execute()
        
        print(f"✅ Appointment booked: {created_event.get('htmlLink')}")
        
        return {
            'event_id': created_event['id'],
            'event_link': created_event.get('htmlLink'),
            'meet_link': created_event.get('hangoutLink'),
            'start_time': start_time.strftime('%A, %B %d at %I:%M %p PT'),
            'client_name': client_name,
            'client_email': client_email
        }
        
    except HttpError as error:
        print(f"❌ Error booking appointment: {error}")
        return None

def cancel_appointment(event_id, reason=''):
    """
    Cancel an appointment
    
    Args:
        event_id (str): Google Calendar event ID
        reason (str): Cancellation reason
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        service = get_calendar_service()
        
        # Delete event
        service.events().delete(
            calendarId=CALENDAR_ID,
            eventId=event_id,
            sendUpdates='all'
        ).execute()
        
        print(f"✅ Appointment cancelled: {event_id}")
        return True
        
    except HttpError as error:
        print(f"❌ Error cancelling appointment: {error}")
        return False

def reschedule_appointment(event_id, new_slot_start):
    """
    Reschedule an existing appointment
    
    Args:
        event_id (str): Google Calendar event ID
        new_slot_start (str): New start time in ISO format
        
    Returns:
        dict: Updated event details or None if failed
    """
    try:
        service = get_calendar_service()
        
        # Get existing event
        event = service.events().get(calendarId=CALENDAR_ID, eventId=event_id).execute()
        
        # Parse new start time
        start_time = datetime.fromisoformat(new_slot_start)
        
        # Calculate duration from original event
        original_start = datetime.fromisoformat(event['start']['dateTime'])
        original_end = datetime.fromisoformat(event['end']['dateTime'])
        duration = original_end - original_start
        
        end_time = start_time + duration
        
        # Update event times
        event['start']['dateTime'] = start_time.isoformat()
        event['end']['dateTime'] = end_time.isoformat()
        
        # Update event
        updated_event = service.events().update(
            calendarId=CALENDAR_ID,
            eventId=event_id,
            body=event,
            sendUpdates='all'
        ).execute()
        
        print(f"✅ Appointment rescheduled: {updated_event.get('htmlLink')}")
        
        return {
            'event_id': updated_event['id'],
            'event_link': updated_event.get('htmlLink'),
            'start_time': start_time.strftime('%A, %B %d at %I:%M %p PT')
        }
        
    except HttpError as error:
        print(f"❌ Error rescheduling appointment: {error}")
        return None

# Claire AI Integration Functions
def claire_get_availability(days_ahead=7):
    """
    Claire-friendly function to get available slots
    Returns formatted string for voice response
    """
    slots = get_available_slots(days_ahead=days_ahead)
    
    if not slots:
        return "I don't see any available slots in the next week. Would you like me to check further out?"
    
    # Format first 3 slots for voice
    response = "I have the following times available:\n"
    for i, slot in enumerate(slots[:3], 1):
        response += f"{i}. {slot['display']}\n"
    
    response += "\nWhich time works best for you?"
    return response

def claire_book_session(client_name, client_email, client_phone, slot_index, notes=''):
    """
    Claire-friendly function to book a session
    
    Args:
        client_name (str): Client's name
        client_email (str): Client's email
        client_phone (str): Client's phone
        slot_index (int): Index of chosen slot (1-based)
        notes (str): Additional notes
        
    Returns:
        str: Confirmation message
    """
    slots = get_available_slots()
    
    if slot_index < 1 or slot_index > len(slots):
        return "I'm sorry, that slot number isn't valid. Could you choose from the available options?"
    
    chosen_slot = slots[slot_index - 1]
    result = book_appointment(
        client_name=client_name,
        client_email=client_email,
        client_phone=client_phone,
        slot_start=chosen_slot['start'],
        notes=notes
    )
    
    if result:
        return (f"Perfect! I've booked your Strategy Session for {result['start_time']}. "
                f"You'll receive a calendar invite at {client_email} with a Google Meet link. "
                f"Sean is looking forward to speaking with you!")
    else:
        return "I'm sorry, there was an issue booking that time. Could we try a different slot?"

if __name__ == '__main__':
    # Test functions
    print("🗓️  Testing Calendar Integration...")
    
    # Test 1: Get available slots
    print("\n📅 Available Slots:")
    slots = get_available_slots(days_ahead=7)
    for slot in slots[:5]:
        print(f"  - {slot['display']}")
    
    # Test 2: Claire's availability check
    print("\n🤖 Claire's Response:")
    print(claire_get_availability())
