#!/usr/bin/env bash
# Smoke test for the Go Playground proxy.
# Posts a valid hello-world program and prints the response.
set -euo pipefail

URL="${1:-${URL:-http://localhost:8787/api/compile}}"

CODE='package main
import "fmt"
func main() { fmt.Println("hello, playground") }'

BODY="version=2&body=$(printf '%s' "$CODE" | python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read()))')&withVet=true"

echo "POST $URL"
curl -sS -X POST "$URL" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data "$BODY"
echo
