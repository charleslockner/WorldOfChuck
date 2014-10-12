#!/bin/bash
# Restart server.js
./node_modules/forever/bin/forever \
restart \
-al forever.log \
-ao log/out.log \
-ae log/err.log \
server.js
