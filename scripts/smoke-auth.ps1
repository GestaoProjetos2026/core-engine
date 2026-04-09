# Smoke test: Sprint 3 tasks 1 & 2 (register, login, refresh, rotation).
# Prerequisites: Postgres running, migrations applied, API: npm run dev
#   docker compose up -d postgres
#   npx prisma migrate deploy
#   npm run dev

$ErrorActionPreference = "Stop"
$base = if ($env:API_BASE) { $env:API_BASE } else { "http://localhost:3000/v1" }
$suffix = [Guid]::NewGuid().ToString("N").Substring(0, 8)
$email = "smoke_$suffix@test.local"
$password = "ValidPass1!x"
$name = "Smoke User"

Write-Host "API: $base" -ForegroundColor Cyan

Write-Host "`n1) POST /auth/register" -ForegroundColor Yellow
$regBody = @{ email = $email; name = $name; password = $password } | ConvertTo-Json
try {
  $reg = Invoke-RestMethod -Uri "$base/auth/register" -Method Post -Body $regBody -ContentType "application/json; charset=utf-8"
} catch {
  Write-Host "Register failed: $_" -ForegroundColor Red
  exit 1
}
if (-not $reg.success -or $reg.data.email -ne $email) {
  Write-Host "Unexpected register response: $($reg | ConvertTo-Json -Depth 5)" -ForegroundColor Red
  exit 1
}
Write-Host "OK user id=$($reg.data.id)" -ForegroundColor Green

Write-Host "`n2) POST /auth/login" -ForegroundColor Yellow
$loginBody = @{ email = $email; password = $password } | ConvertTo-Json
$login = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body $loginBody -ContentType "application/json; charset=utf-8"
if (-not $login.success -or -not $login.data.accessToken -or -not $login.data.refreshToken) {
  Write-Host "Unexpected login response" -ForegroundColor Red
  exit 1
}
$refresh1 = $login.data.refreshToken
Write-Host "OK access + refresh received" -ForegroundColor Green

Write-Host "`n3) POST /auth/refresh (first rotation)" -ForegroundColor Yellow
$refBody = @{ refreshToken = $refresh1 } | ConvertTo-Json
$ref = Invoke-RestMethod -Uri "$base/auth/refresh" -Method Post -Body $refBody -ContentType "application/json; charset=utf-8"
if (-not $ref.success -or -not $ref.data.refreshToken) {
  Write-Host "Unexpected refresh response" -ForegroundColor Red
  exit 1
}
$refresh2 = $ref.data.refreshToken
if ($refresh2 -eq $refresh1) {
  Write-Host "Refresh token should rotate to a new value" -ForegroundColor Red
  exit 1
}
Write-Host "OK new refresh issued" -ForegroundColor Green

Write-Host "`n4) POST /auth/refresh with OLD refresh -> expect AUTH_REFRESH_REUSED" -ForegroundColor Yellow
$reuseBody = @{ refreshToken = $refresh1 } | ConvertTo-Json
try {
  Invoke-RestMethod -Uri "$base/auth/refresh" -Method Post -Body $reuseBody -ContentType "application/json; charset=utf-8" | Out-Null
  Write-Host "Expected 401 on reused refresh" -ForegroundColor Red
  exit 1
} catch {
  $raw = $_.ErrorDetails.Message
  if (-not $raw) { $raw = $_.Exception.Message }
  $code = $null
  try { $code = ($raw | ConvertFrom-Json).error.code } catch { }
  if ($code -eq "AUTH_REFRESH_REUSED" -or $raw -match "AUTH_REFRESH_REUSED") {
    Write-Host "OK AUTH_REFRESH_REUSED" -ForegroundColor Green
  } else {
    Write-Host "Unexpected error. Raw: $raw" -ForegroundColor Red
    exit 1
  }
}

Write-Host "`n5) POST /auth/refresh with NEW refresh -> OK" -ForegroundColor Yellow
$ref2Body = @{ refreshToken = $refresh2 } | ConvertTo-Json
$ref2 = Invoke-RestMethod -Uri "$base/auth/refresh" -Method Post -Body $ref2Body -ContentType "application/json; charset=utf-8"
if (-not $ref2.success) {
  Write-Host "Second refresh failed" -ForegroundColor Red
  exit 1
}
Write-Host "OK" -ForegroundColor Green

Write-Host "`nAll smoke checks passed." -ForegroundColor Cyan
