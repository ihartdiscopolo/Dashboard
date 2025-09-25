import requests
import time
import json
import urllib3

# disable SSL warnings (since your curl used -k)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

UNIFI_URL = "https://api.ui.com/v1/hosts"
UNIFI_HEADERS = {
    "X-API-KEY": "C5zisWdwA8MU6SaNnGb4bQdsYmKCIatC",
    "Accept": "application/json"
}

# orgid 
MERAKI_URL = "https://api.meraki.com/api/v1/"  # pick the correct endpoint you need
MERAKI_HEADERS = {
    "X-Cisco-Meraki-API-Key": "383fb74eaf6a0381b756b50f9e628e9d41c4c6f4",
    "Accept": "application/json"
}

while True:
    try:
        # --- Unifi ---
        unifi_resp = requests.get(UNIFI_URL, headers=UNIFI_HEADERS, verify=False)
        if unifi_resp.status_code == 200:
            with open("unify.json", "w") as f:
                json.dump(unifi_resp.json(), f, indent=2)
            print("✅ Updated unify.json")
        else:
            print(f"Unifi error: {unifi_resp.status_code} {unifi_resp.text}")

        # --- Meraki ---
        meraki_resp = requests.get(MERAKI_URL, headers=MERAKI_HEADERS)
        if meraki_resp.status_code == 200:
            with open("meraki.json", "w") as f:
                json.dump(meraki_resp.json(), f, indent=2)
            print("✅ Updated meraki.json")
        else:
            print(f"Meraki error: {meraki_resp.status_code} {meraki_resp.text}")

    except Exception as e:
        print("Error fetching API:", e)

    # wait 60 seconds
    time.sleep(60)