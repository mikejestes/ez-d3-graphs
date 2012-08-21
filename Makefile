all: data
clean:
	rm data/*.json

data: data/duration.json data/orders.json data/transactions.json

data/duration.json:
	node data/generate_duration.js > data/duration.json

data/transactions.json:
	node data/generate_transactions.js > data/transactions.json

data/orders.json:
	node data/generate_orders.js > data/orders.json
