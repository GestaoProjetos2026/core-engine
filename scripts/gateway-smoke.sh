#!/usr/bin/env sh
# RF28 — smoke test do gateway (Core + pelo menos um módulo externo)
set -eu

BASE_URL="${GATEWAY_URL:-http://localhost}"

echo "Gateway smoke @ ${BASE_URL}"

core_code=$(curl -s -o /tmp/gw-core.json -w "%{http_code}" "${BASE_URL}/v1/health")
echo "Core /v1/health -> HTTP ${core_code}"
test "${core_code}" = "200" || exit 1

crm_code=$(curl -s -o /tmp/gw-crm.json -w "%{http_code}" "${BASE_URL}/v1/crm/health")
echo "CRM /v1/crm/health -> HTTP ${crm_code}"
test "${crm_code}" = "200" || exit 1

login_block=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/v1/crm/auth/login")
echo "Blocked /v1/crm/auth/login -> HTTP ${login_block}"
test "${login_block}" = "403" || exit 1

echo "OK — gateway routes Core and external module; module login blocked."
