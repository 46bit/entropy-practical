#!/usr/bin/env bash

# http://unix.stackexchange.com/a/55922
trap 'killall' INT

killall() {
    trap '' INT TERM     # ignore INT and TERM while shutting down
    echo "**** Shutting down... ****"     # added double quotes
    kill -TERM 0         # fixed order, send TERM not INT
    wait
    echo DONE
}

cd docs/_build/html && python3 -m http.server --cgi 3000 &
cd exercise1 && python3 -m http.server --cgi 3001 &
cd exercise2 && python3 -m http.server --cgi 3002 &
sleep 1
cd exercise2 && python3 ./numbers-server &

cat
