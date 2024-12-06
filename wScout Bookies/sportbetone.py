import requests
import json

# URL and headers for the request
url = 'https://api.sportbet.one/v1/events?sport=1&type=1'
headers = {
#### CONFIDENTIAL DATA ####
}

# Making the GET request
response = requests.get(url, headers=headers)

# Check response status
if response.status_code != 200:
    print(f"Failed to retrieve data: {response.status_code}")
    print(response.text)
    exit()

# Try to parse the response as JSON
try:
    data = response.json()
except json.JSONDecodeError as e:
    print("Error decoding JSON response:", e)
    print("Response text:", response.text)
    exit()

# Filtering the data
speficied_league = '' #specify the league/sport you want to filter 
filtered_data = []

events = data.get('events', [])

for event_key, event in events.items():
    if event.get('l') == speficied_league:
        match_info = {
            'home_team': event.get('h'),
            'away_team': event.get('a'),
            'odds': {
                'home': event.get('o', {}).get('1', {}).get('h'),
                'away': event.get('o', {}).get('1', {}).get('a'),
                'draw': event.get('o', {}).get('1', {}).get('d')
            }
        }
        filtered_data.append(match_info)

# Printing the filtered data
print(json.dumps(filtered_data, indent=4))

# Saving the filtered data to a JSON file
output_file = '/mnt/data/sb_one_odds.json'
with open(output_file, 'w') as file:
    json.dump(filtered_data, file, indent=4)

print(f"Filtered data saved to {output_file}")
