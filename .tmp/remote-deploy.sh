#!/bin/bash
set -e
DEV=/home/u235042127/domains/odeh-design.com/public_html/dev
cd "$DEV"

cp .env /tmp/odeh-dev-env-preserve
ENV_BEFORE=$(grep -E '^(APP_URL|APP_ENV|APP_DEBUG)=' .env)

echo "=== Extracting (preserving .env) ==="
tar -xzf deploy-update.tar.gz
cp /tmp/odeh-dev-env-preserve .env
rm -f deploy-update.tar.gz /tmp/odeh-dev-env-preserve

ENV_AFTER=$(grep -E '^(APP_URL|APP_ENV|APP_DEBUG)=' .env)
echo "ENV_BEFORE:"
echo "$ENV_BEFORE"
echo "ENV_AFTER:"
echo "$ENV_AFTER"

if [ "$ENV_BEFORE" != "$ENV_AFTER" ]; then
  echo "ERROR: .env changed unexpectedly"
  exit 1
fi
echo "ENV_PRESERVED=yes"

echo "=== Frontend bundle ==="
grep -o 'index-[^.]*\.js' index.html || true
if [ ! -f assets/index-sjxgtrwA.js ]; then
  echo "BUNDLE_MISSING"
  exit 1
fi
echo "BUNDLE_PRESENT=yes"

echo "=== Backend marker ==="
md5sum app/Support/PublicMediaUrl.php

echo "=== Storage link ==="
if [ ! -L public/storage ]; then
  rm -f public/storage
  ln -sfn ../storage/app/public public/storage
fi
ls -la public/storage
if [ ! -L public/storage ]; then
  echo "STORAGE_LINK_FAIL"
  exit 1
fi
echo "STORAGE_LINK=ok"

echo "=== Composer check ==="
echo "COMPOSER_INSTALL=skipped (no dependency changes)"

echo "=== Migration status ==="
php artisan migrate:status 2>&1 | tail -40
PENDING=$(php artisan migrate:status 2>&1 | grep -c Pending || true)
echo "PENDING_COUNT=$PENDING"
if [ "$PENDING" -gt 0 ]; then
  echo "Running pending migrations..."
  php artisan migrate --force
  echo "MIGRATE=ran"
else
  echo "MIGRATE=skipped (none pending)"
fi

echo "=== Cache rebuild ==="
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo "CACHE=ok"

echo "=== Final APP_URL ==="
grep '^APP_URL=' .env

echo "DEPLOY_REMOTE_OK"
