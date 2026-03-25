# 🚀 Monitoring Setup Guide

## 📌 HOW TO RUN

## 🔹 Step 1: Clone the Repository
```bash
clone repo

```

## 🔹 Step 2: Install Requirements
```
🖥️ On Central Server:
Install:
Docker (latest)
Docker Compose (latest)
Node.js v18


---
🖥️ On Agent Server:
Install:
Docker (latest)
Docker Compose (latest)

```
---
## 🔹 Step 3: Start Central Server

```bash
go to server folder and run

docker-compose up -d central-server
```
---

## 🔹 Step 4: Setup and Run Agent Server

```
📦 Build Docker Image:

cd /path/to/agent/
docker build -t monitor-agent .

---
This will create an image named monitor-agent using the provided Dockerfile.

---
▶️ Run the Agent Container:
docker run -d \
  --name monitor-agent \
  --pid=host \
  --network host \
  -e SERVER_URL="http://<central-server-ip>:5000/api/metrics" \
  -e SERVER_NAME="<unique-name-for-this-server>" \
  -e HOST="<client-server-ip-or-hostname>" \
  -v /proc:/proc:ro \
  -v /sys:/sys:ro \
  --restart unless-stopped \
  monitor-agent
  ```

---

## 🔹 Step 4.1: Explanation of Options
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
