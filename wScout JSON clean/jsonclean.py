import json

def parse_json_to_format(json_data):
    formatted_data = []
    for market in json_data:
        for market_data in market.get('markets', []):
            formatted_market = {
                "market": market.get("title", ""),
                "asset_id": market_data.get("id", ""),
                "hash": market_data.get("conditionId", ""),
                "timestamp": market_data.get("startDate", ""),
                "bids": [
                    {"Name": "Yes", "Odds": market_data.get("outcomes", ["Yes", "No"])[0]},
                    {"Name": "No", "Odds": market_data.get("outcomes", ["Yes", "No"])[1]}
                ],
                "asks": [
                    {"Name": "No", "Odds": market_data.get("outcomes", ["Yes", "No"])[1]},
                    {"Name": "Yes", "Odds": market_data.get("outcomes", ["Yes", "No"])[0]}
                ],
            }
            formatted_data.append(formatted_market)
    return formatted_data

if __name__ == "__main__":
    input_file = "all_markets.json"  # Replace with the actual file path
    output_file = "formatted_markets.json"

    # Load the JSON data from the input file
    with open(input_file, "r") as file:
        json_data = json.load(file)
    
    # Process the JSON data
    formatted_result = parse_json_to_format(json_data)
    
    # Save the formatted result to the output file
    with open(output_file, "w") as file:
        json.dump(formatted_result, file, indent=4)

    print(f"Formatted data has been saved to {output_file}.")
