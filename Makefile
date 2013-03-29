all: ez-d3-graphs.js

ez-d3-graphs.js: $(shell node_modules/.bin/smash --list src/ez-d3-graphs.js)
	@rm -f $@
	node_modules/.bin/smash src/ez-d3-graphs.js > $@
	@chmod a-w $@

# node_modules/.bin/smash src/ez-d3-graphs.js | node_modules/.bin/uglifyjs - -b  --comments indent-level=2 -o $@
