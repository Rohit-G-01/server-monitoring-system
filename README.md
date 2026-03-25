# Server Monitoring System

A lightweight, Docker‑based monitoring solution that tracks CPU (5‑minute average), RAM, and disk usage across multiple servers. The central server provides a clean web dashboard that updates automatically.

## Features
- **Central dashboard** – View all monitored servers in one place.
- **Real‑time metrics** – CPU (with 5‑minute average), RAM, disk usage.
- **Agent‑based** – Bash script runs in a container on each monitored server.
- **Easy deployment** – Everything runs in Docker; no external dependencies.

## Prerequisites
- Docker and Docker Compose installed on the central server.
- Docker installed on each client server you want to monitor.
- Network connectivity (port 5000 must be reachable from clients).

## Quick Start

### 1. Central Server Setup
1. Clone or download this repository.
2. Navigate to the project folder.
3. Start the central server:
   ```bash
   docker-compose up -d central-server


## . Deploy Agents on Client Servers

```
cd agent
docker build -t monitor-agent .
docker run -d \
  --name monitor-agent \
  --pid=host \
  --network host \
  -e SERVER_URL="http://<central-server-ip>:5000/api/metrics" \
  -e SERVER_NAME="my-server-1" \
  -e HOST="<client-ip>" \
  -v /proc:/proc:ro \
  -v /sys:/sys:ro \
  --restart unless-stopped \
  monitor-agent
  
  ```
  ```
  Explanation of options:

--pid=host – Allows the agent to see host processes and collect CPU stats correctly.

--network host – Uses the host network; the agent can reach the central server directly.

-e SERVER_URL – The endpoint where the agent sends metrics.

-e SERVER_NAME – A friendly name for this server (appears in the dashboard).

-e HOST – The IP or hostname of this server (shown in the dashboard).

-v /proc:/proc:ro and -v /sys:/sys:ro – Mount host system directories read‑only to read metrics.

--restart unless-stopped – Auto‑restart the agent if it stops.
```

## verify that the central server is reachable from this client server:
```
curl -X POST http://<central-server-ip>:5000/api/metrics \
  -H "Content-Type: application/json" \
  -d '{"name":"test","host":"test","cpu":10,"ram":20,"storage":30}'
  
  ```



