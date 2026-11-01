#!/bin/sh
set -e

# Ensure storage and cache directories exist and are writable
mkdir -p /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/framework/cache/data \
         /var/www/storage/logs \
         /var/www/bootstrap/cache

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Sync built public assets to shared volume if needed
if [ -d "/var/www/public-build" ]; then
    cp -rf /var/www/public-build/* /var/www/public/
fi

# Wait for MySQL to accept connections before running artisan commands
if [ -n "$DB_HOST" ]; then
    echo "Waiting for database ($DB_HOST:${DB_PORT:-3306}) to be ready..."
    for i in $(seq 1 30); do
        if php -r "try { new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . (getenv('DB_PORT') ?: 3306), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); exit(0); } catch (Exception \$e) { exit(1); }" 2>/dev/null; then
            echo "Database is ready!"
            break
        fi
        sleep 2
    done
fi

# Create storage symlink if not present
php artisan storage:link --force 2>/dev/null || true

# Cache configuration, routes, and views in production
if [ "$APP_ENV" = "production" ]; then
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

exec "$@"

