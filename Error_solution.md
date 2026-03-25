## Error :- 1
```
error:- docker: Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: unable to apply apparmor profile: apparmor failed to apply profile: open /proc/self/attr/apparmor/exec: read-only file system: unknown.


Solution :- 
1. docker stop monitor-agent
2. docker rm    monitor-agent

3. Run this 

docker run -d \
  --name monitor-agent \
  --pid=host \
  --network host \
  --security-opt apparmor=unconfined \
  -e SERVER_URL="http://31.220.88.203:5000/api/metrics" \
  -e SERVER_NAME="Mainnet-L1X-Explorer-API-V1 and v2" \
  -e HOST="Contabo-159.195.71.81" \
  -v /sys:/sys:ro \
  --restart unless-stopped \
  monitor-agent

```