#!/usr/bin/env bash
# Runs onworks' real launch chain once (user.php -> create-os.php -> guacamole tokens/tree/websocket) and records it.
OS="$1"; B=https://www.onworks.net; ORIGIN=https://rtischeduler.github.io
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
mkdir -p ref/_probe/api; cd ref/_probe/api
U=$(date +%s); c() { curl -sk -A "$UA" -H "Origin: $ORIGIN" "$@"; }
c -m 30 -D 1-user.headers -o 1-user.txt "$B/community/user.php?username=$U"
SVC=$(tr -d '\r\n ' < 1-user.txt); echo "svc=$SVC"
c -m 120 -D 2-create.headers -o 2-create.txt "$B/runos/create-os.php?v=1&service=$SVC&username=$U&app=null&os=$OS"
GUEST=$(tr -d '\r\n ' < 2-create.txt); echo "guest=$GUEST"
N=${SVC#onworks}; G=${GUEST#guest}; BASE="$B/osessionx$N"; echo "$BASE" > 0-base.txt
c -m 30 -D 3-token.headers -o 3-token.json -d "username=$GUEST&password=server01$G" "$BASE/api/tokens"
TOKEN=$(python3 -c "import json;print(json.load(open('3-token.json'))['authToken'])" 2>/dev/null)
DS=$(python3 -c "import json;print(json.load(open('3-token.json'))['dataSource'])" 2>/dev/null)
c -m 30 -D 4-tree.headers -o 4-tree.json "$BASE/api/session/data/$DS/connectionGroups/ROOT/tree?token=$TOKEN"
c -m 20 -X OPTIONS -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: content-type" -D 5-preflight.headers -o /dev/null "$BASE/api/tokens"
c -m 20 -D 6-security.headers -o 6-security.txt "$B/runos/security.php?username=$U&service=$SVC"
ID=$(python3 - <<'PY' 2>/dev/null
import json
def f(n):
    for c in n.get("childConnections",[]): return c["identifier"]
    for g in n.get("childConnectionGroups",[]):
        r=f(g)
        if r: return r
print(f(json.load(open('4-tree.json'))))
PY
)
echo "id=$ID"
Q="token=$TOKEN&GUAC_DATA_SOURCE=$DS&GUAC_ID=$ID&GUAC_TYPE=c&GUAC_WIDTH=1024&GUAC_HEIGHT=768&GUAC_DPI=96"
for mode in origin none; do
  if [ $mode = origin ]; then O=(-H "Origin: $ORIGIN"); else O=(); fi
  curl -sk --http1.1 -m 6 -A "$UA" "${O[@]}" -H "Upgrade: websocket" -H "Connection: Upgrade" -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Protocol: guacamole" -D 7-ws-$mode.headers -o /dev/null "$BASE/websocket-tunnel?$Q" || true
done
sed -i "s/$TOKEN/<token>/g; s/server01$G/<pw>/g" *.json *.headers *.txt 2>/dev/null; true
