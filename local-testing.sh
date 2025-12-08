#!/bin/bash
set -ue

echo "Starting local web server to serve docs..."
echo "Serving docs at http://localhost:8080/index.html"
echo "(Changes to the source will be available to the server immediately.)"
echo "Press Ctrl+C to stop."
set -x

# if running Windows Git Bash, convert path to Windows format
if [[ "$(uname -s)" == MINGW* ]]; then
  path=$(pwd -W)
else
  path="${PWD}"
fi

docker run --rm -p 8080:80 -v "${path}/docs:/usr/share/nginx/html:ro" nginx:alpine
set +x
echo "Local web server stopped."
