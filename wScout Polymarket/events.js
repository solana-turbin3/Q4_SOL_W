"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var fs = require("fs");
// Define the API URL for fetching markets
var apiUrl = 'https://gamma-api.polymarket.com/markets';
function getActiveMarkets() {
    return __awaiter(this, void 0, void 0, function () {
        var startDate_1, endDate_1, response, markets, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    startDate_1 = '2024-11-08T00:00:00Z';
                    endDate_1 = '2024-11-11T23:59:59Z';
                    console.log("Fetching active markets from ".concat(startDate_1, " to ").concat(endDate_1));
                    return [4 /*yield*/, axios_1.default.get(apiUrl, {
                            params: {
                                active: true, // Filter to get only active markets
                                archived: false, // Exclude archived markets
                                closed: false, // Exclude closed markets
                                limit: 100 // Limit results to the most recent 100 markets
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status === 200) {
                        markets = response.data.markets;
                        // Check if the markets array exists and is not empty
                        if (markets && Array.isArray(markets) && markets.length > 0) {
                            console.log("Active Markets found:");
                            markets.forEach(function (market) {
                                // You can add additional conditions to filter based on the date if needed
                                var marketStartDate = new Date(market.start_date_iso);
                                var marketEndDate = new Date(market.end_date_iso);
                                // Check if the market starts and ends within our specified range
                                if (marketStartDate >= new Date(startDate_1) && marketEndDate <= new Date(endDate_1)) {
                                    console.log("Market ID: ".concat(market.id));
                                    console.log("Question: ".concat(market.question));
                                    console.log("Description: ".concat(market.description));
                                    console.log("Start Date: ".concat(market.start_date_iso));
                                    console.log("End Date: ".concat(market.end_date_iso));
                                    console.log("-".repeat(40));
                                }
                            });
                            // Save the markets to a JSON file
                            fs.writeFileSync('active_markets.json', JSON.stringify(markets, null, 2));
                            console.log("Active markets saved to active_markets.json");
                        }
                        else {
                            console.error("No active markets found for the specified criteria.");
                        }
                    }
                    else {
                        console.error("Failed to retrieve markets. Status code: ".concat(response.status));
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching markets:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Execute the function
getActiveMarkets();
