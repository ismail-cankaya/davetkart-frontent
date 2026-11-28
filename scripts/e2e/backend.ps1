<#
  E2E backend (Faz 19.22, TST-04, K225) — started by playwright.config.ts (webServer).
  Drops and recreates davetkart_e2e, migrates, seeds a 100% gift code, serves on -Port.
  Details: docs/rehber/scripts/e2e/backend.md
#>
param(
  [int]$Port = 8020,
  [string]$Database = 'davetkart_e2e',
  [string]$BackendPath = (Join-Path $PSScriptRoot '..\..\..\davetkart-backend-php-laravel'),
  [string]$PreviewOrigin = 'http://127.0.0.1:4180',
  [string]$GiftCode = 'E2EHEDIYE100'
)

$ErrorActionPreference = 'Stop'

# Fail closed: this script drops a database. Only davetkart_e2e[_suffix] is accepted.
if ($Database -notmatch '^davetkart_e2e(_[a-z0-9_]+)?$') {
  throw "Refusing to reset '$Database': only davetkart_e2e or davetkart_e2e_<suffix> is allowed."
}

$BackendPath = (Resolve-Path $BackendPath).Path
if (Test-Path (Join-Path $BackendPath 'bootstrap\cache\config.php')) {
  throw "Config is cached in $BackendPath; environment overrides would be ignored. Run: php artisan config:clear"
}

$dotenv = Get-Content (Join-Path $BackendPath '.env')
function Read-DotEnv([string]$Name, [string]$Default) {
  $line = $dotenv | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
  if ($line) { return ($line -replace "^$Name=", '').Trim().Trim('"') }
  return $Default
}

$pgHost = Read-DotEnv 'DB_HOST' '127.0.0.1'
$pgPort = Read-DotEnv 'DB_PORT' '5432'
$pgUser = Read-DotEnv 'DB_USERNAME' 'postgres'
$env:PGPASSWORD = Read-DotEnv 'DB_PASSWORD' ''

$psql = (Get-Command psql -ErrorAction SilentlyContinue).Source
if (-not $psql) {
  $psql = Get-ChildItem 'C:\Program Files\PostgreSQL\*\bin\psql.exe' -ErrorAction SilentlyContinue |
    Sort-Object FullName -Descending | Select-Object -First 1 -ExpandProperty FullName
}
if (-not $psql) { throw 'psql not found (PATH or C:\Program Files\PostgreSQL\<n>\bin).' }

Write-Host "[e2e] recreating database $Database"
& $psql -h $pgHost -p $pgPort -U $pgUser -d postgres -v ON_ERROR_STOP=1 -q `
  -c "DROP DATABASE IF EXISTS $Database WITH (FORCE);" -c "CREATE DATABASE $Database;"
if ($LASTEXITCODE -ne 0) { throw "psql failed ($LASTEXITCODE)" }

# Process variables win over .env: phpdotenv never overwrites an existing variable.
$env:DB_DATABASE = $Database
$env:APP_URL = $PreviewOrigin
$env:FRONTEND_URL = $PreviewOrigin
$env:PAYMENT_PROVIDER = 'fake'
$env:PAYMENT_METHODS = 'card,gift_code'
$env:QUEUE_CONNECTION = 'sync'
$env:MAIL_MAILER = 'log'
# SEC-09 hook (e2e/support/flows.ts) reads storage/logs/laravel.log: pin the channel (.env may say daily).
$env:LOG_CHANNEL = 'single'
# The log mailer writes at debug level: .env may say LOG_LEVEL=error and drop the mail.
$env:LOG_LEVEL = 'debug'
$env:CACHE_STORE = 'database'
$env:AI_PROVIDER = 'null'

Push-Location $BackendPath
try {
  Write-Host '[e2e] migrating'
  php artisan migrate --force --no-interaction
  if ($LASTEXITCODE -ne 0) { throw 'migrate failed' }

  Write-Host "[e2e] gift code $GiftCode (100%, all plans)"
  php artisan gift-codes:create $GiftCode --benefit=percent --percent=100 --max-uses=1000 --label=e2e --no-interaction
  if ($LASTEXITCODE -ne 0) { throw 'gift code failed' }

  Write-Host "[e2e] serving on http://127.0.0.1:$Port"
  php artisan serve --host=127.0.0.1 --port=$Port --no-reload
} finally {
  Pop-Location
}
