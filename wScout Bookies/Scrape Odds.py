import argparse
import requests


# Obtain the api key from CLI
parser = argparse.ArgumentParser(description='Sample V4')
parser.add_argument('--api-key', type=str, default='')
args = parser.parse_args()
API_KEY = args.api_key or 'YOUR_API_KEY'

# Sport key
# Specify a sport in the request to get odds for a specific sport
# Use 'upcoming' to see the next 8 games across all sports
SPORT = 'upcoming'

# Bookmaker regions
# uk | us | us2 | eu | au. Multiple can be specified if comma delimited.
REGIONS = 'us'

# Odds markets
# h2h | spreads | totals. Multiple can be specified if comma delimited
MARKETS = 'h2h,spreads'

# Odds format
# decimal | american
ODDS_FORMAT = 'decimal'

# Date format
# iso | unix
DATE_FORMAT = 'iso'

sports_response = requests.get('https://api.the-odds-api.com/v4/sports', params={
    'api_key': API_KEY
})


if sports_response.status_code != 200:
    print(f'Failed to get sports: status_code {sports_response.status_code}, response body {sports_response.text}')

else:
    print('List of in season sports:', sports_response.json())

odds_response = requests.get(f'https://api.the-odds-api.com/v4/sports/{SPORT}/odds', params={
    'api_key': API_KEY,
    'regions': REGIONS,
    'markets': MARKETS,
    'oddsFormat': ODDS_FORMAT,
    'dateFormat': DATE_FORMAT,
})

if odds_response.status_code != 200:
    print(f'Failed to get odds: status_code {odds_response.status_code}, response body {odds_response.text}')

else:
    odds_json = odds_response.json()
    print('Number of events:', len(odds_json))
    print(odds_json)
