const { ClobClient } = require('@polymarket/clob-client');
const { ethers } = require('ethers');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
const privateKey = process.env.PRIVATE_KEY || '';
const wallet = new ethers.Wallet(privateKey, provider);
const client = new ClobClient('https://clob.polymarket.com', 137, wallet);

async function getOpenAndActiveMarkets() {
    try {
        const marketsData = await client.getMarkets();
        console.log("Fetched markets data structure:", marketsData);

        const markets = marketsData.data || [];

        // Filter markets where "active" is true and "closed" is false
        const openAndActiveMarkets = markets.filter(market => market.active === true && market.closed === false);

        // Print the filtered markets to console
        console.log("Open and Active Markets (active: true, closed: false):", openAndActiveMarkets);

        // Save the filtered markets to a JSON file
        fs.writeFileSync('open_active_markets.json', JSON.stringify(openAndActiveMarkets, null, 2));
        console.log("Filtered markets saved to open_active_markets.json");
    } catch (error) {
        console.error('Error fetching markets:', error);
    }
}

getOpenAndActiveMarkets();
