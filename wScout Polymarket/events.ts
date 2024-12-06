import axios from 'axios';
import * as fs from 'fs';

// Define the API URL for fetching markets
const apiUrl = 'https://gamma-api.polymarket.com/markets';

async function getActiveMarkets() {
    try {
        // Set the date range for this weekend (November 8 to November 11, 2024)
        const startDate = '2024-11-08T00:00:00Z'; // Start date: November 8, 2024
        const endDate = '2024-11-11T23:59:59Z'; // End date: November 11, 2024

        console.log(`Fetching active markets from ${startDate} to ${endDate}`);

        // Fetch data from the Polymarket markets endpoint with active filter
        const response = await axios.get(apiUrl, {
            params: {
                active: true, // Filter to get only active markets
                archived: false, // Exclude archived markets
                closed: false, // Exclude closed markets
                limit: 100 // Limit results to the most recent 100 markets
            }
        });

        if (response.status === 200) {
            const markets = response.data.markets;

            // Check if the markets array exists and is not empty
            if (markets && Array.isArray(markets) && markets.length > 0) {
                console.log("Active Markets found:");
                markets.forEach((market: any) => {
                    // You can add additional conditions to filter based on the date if needed
                    const marketStartDate = new Date(market.start_date_iso);
                    const marketEndDate = new Date(market.end_date_iso);

                    // Check if the market starts and ends within our specified range
                    if (marketStartDate >= new Date(startDate) && marketEndDate <= new Date(endDate)) {
                        console.log(`Market ID: ${market.id}`);
                        console.log(`Question: ${market.question}`);
                        console.log(`Description: ${market.description}`);
                        console.log(`Start Date: ${market.start_date_iso}`);
                        console.log(`End Date: ${market.end_date_iso}`);
                        console.log("-".repeat(40));
                    }
                });

                // Save the markets to a JSON file
                fs.writeFileSync('active_markets.json', JSON.stringify(markets, null, 2));
                console.log("Active markets saved to active_markets.json");
            } else {
                console.error("No active markets found for the specified criteria.");
            }
        } else {
            console.error(`Failed to retrieve markets. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching markets:', error);
    }
}

// Execute the function
getActiveMarkets();
