#!/bin/bash

SERVER_URL=${SERVER_URL:-"http://central-server:5000/api/metrics"}
SERVER_NAME=${SERVER_NAME:-$(hostname)}
HOST=${HOST:-$(hostname -I | awk '{print $1}')}

while true; do
    CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}' | cut -d. -f1)
    RAM=$(free | grep Mem | awk '{print ($3/$2) * 100}' | cut -d. -f1)
    STORAGE=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')

    curl -X POST "$SERVER_URL" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"$SERVER_NAME\", \"host\":\"$HOST\", \"cpu\":$CPU, \"ram\":$RAM, \"storage\":$STORAGE}"

    sleep 60
done