"""Fetch all records from Airtable 01_INTEL table and save as JSON."""
import os
import json
import ssl
import urllib.request
import urllib.parse

# Homebrew Python needs certifi certs
import certifi
SSL_CTX = ssl.create_default_context(cafile=certifi.where())

def load_env(path=".env"):
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

load_env()

PAT = os.environ["AIRTABLE_PAT"]
BASE_ID = os.environ["AIRTABLE_BASE_ID"]
TABLE_NAME = "01_INTEL"

def fetch_all_records():
    records = []
    offset = None
    while True:
        url = f"https://api.airtable.com/v0/{BASE_ID}/{urllib.parse.quote(TABLE_NAME)}"
        if offset:
            url += f"?offset={offset}"
        req = urllib.request.Request(url, headers={
            "Authorization": f"Bearer {PAT}",
            "Content-Type": "application/json",
        })
        with urllib.request.urlopen(req, context=SSL_CTX) as resp:
            data = json.loads(resp.read().decode())
        records.extend(data.get("records", []))
        offset = data.get("offset")
        if not offset:
            break
    return records

if __name__ == "__main__":
    records = fetch_all_records()
    with open("intel_records.json", "w") as f:
        json.dump(records, f, indent=2)
    print(f"Fetched {len(records)} records.")
    # Print field names from first record
    if records:
        print(f"Fields: {list(records[0]['fields'].keys())}")
