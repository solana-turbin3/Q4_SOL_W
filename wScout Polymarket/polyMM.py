import logging
import threading
import requests
import helpers

class TradeOrder:
    def __init__(self, quantity: int, rate: float, buy_side: bool) -> None:
        self.quantity = quantity
        self.rate = rate
        self.buy_side = buy_side
        self.order_id = None

class MarketInterface:
    def __init__(self, contract_address: str, token_id: str, update_interval: int, max_threads: int = 5) -> None:
        assert isinstance(contract_address, str), "Contract address must be a string"
        assert isinstance(token_id, str), "Token ID must be a string"
        assert isinstance(update_interval, int), "Update interval must be an integer"

        self.update_interval = update_interval
        self.token_id = token_id
        self.contract_address = contract_address

        self._thread_pool = ThreadPoolExecutor(max_threads=max_threads)
        self._sync_lock = threading.Lock()

        self.active_orders = {}

    def remove_orders(self, order_ids: list):
        """Cancel the specified orders in the active order book."""
        assert isinstance(order_ids, list), "Order IDs should be a list"

        for order_id in order_ids:
            self._revoke_order(order_id, self.market_id)

    def submit_orders(self, orders_to_place: list):
        """Submit a list of new orders to the market."""
        assert isinstance(orders_to_place, list), "Orders should be a list"

        for order in orders_to_place:
            new_id = self._submit_order(order.rate, order.quantity, order.buy_side, self.market_id)
            order.order_id = new_id
            self.active_orders[new_id] = order

    def fetch_open_orders(self) -> list:
        """Retrieve the list of currently open orders."""
        current_orders = self.exchange.get_pending_orders()
        result_orders = []
        for order_id in current_orders:
            result_orders.append(self.active_orders.get(order_id))
        return result_orders

    def fetch_price(self) -> float:
        """Fetch the midpoint price from the market."""
        response = requests.get(helpers.TRACKER_URL + '/midpoint', params={"market": self.contract_address, "tokenID": self.token_id})
        return response.json().get('mid', 0)

    def validate_market(self):
        """Verify if the given market is valid."""
        response = requests.get(helpers.TRACKER_URL + '/markets')
        available_markets = response.json()

        if self.contract_address not in available_markets:
            return False

        return True

    def _submit_order(self, rate, quantity, is_buy, asset_id) -> int:
        """Send an order to the relay contract and return the order ID."""
        maker_qty = quantity
        if is_buy:
            taker_qty = quantity / rate
            payload = {
                "maker": "",
                "makerAssetType": "erc20",
                "makerAmount": maker_qty,
                "takerAssetType": "erc1155", 
                "takerAmount": taker_qty,
                "takerAssetID": asset_id,
            }
        else:
            taker_qty = quantity * rate
            payload = {
                "maker": "",
                "makerAssetType": "erc1155",
                "makerAmount": maker_qty,
                "takerAssetType": "erc20", 
                "takerAmount": taker_qty,
                "takerAssetID": -1,
            }
        response = requests.post(helpers.ONCHAIN_ORDER_POST_URL, data=payload)

        if response.status_code != 200:
            logging.getLogger().warning("Failed to place order.")
            return -1

        return response.json().get('orderId', -1)
