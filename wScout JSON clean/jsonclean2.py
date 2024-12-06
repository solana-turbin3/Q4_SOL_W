import json

def parse_to_second_format(json_data):
    formatted_data = []
    for market in json_data:
        for market_data in market.get('markets', []):
            formatted_market = {
                "Source ID": market.get("id", ""),
                "Event ID": market_data.get("conditionId", ""),
                "Event Time": market_data.get("startDate", ""),
                "Sport / Market Type": market.get("category", ""),
                "Side A": {
                    "Name": "Yes",
                    "Odds": market_data.get("outcomes", ["Yes", "No"])[0]
                },
                "Side B": {
                    "Name": "No",
                    "Odds": market_data.get("outcomes", ["Yes", "No"])[1]
                }
            }
            formatted_data.append(formatted_market)
    return formatted_data

if __name__ == "__main__":
    input_file = "all_markets.json"  # Replace with your file name
    output_file = "formatted_markets_second_format.json"

    # Load the JSON data from the input file
    with open(input_file, "r") as file:
        json_data = json.load(file)

    # Process the JSON data into the second format
    formatted_result = parse_to_second_format(json_data)

    # Save the formatted result to the output file
    with open(output_file, "w") as file:
        json.dump(formatted_result, file, indent=4)

    print(f"Formatted data has been saved to {output_file}.")
