#!/bin/sh
set -e

# Aguarda Postgres ficar disponível (host=db, porta=5432)
echo "⏳ Waiting for Postgres..."
while ! nc -z postgres 5432; do
  sleep 1
done

echo "✅ Postgres is up — applying migrations"
python manage.py migrate --noinput

echo "📦 Collecting static files"
# cria a pasta se não existir
mkdir -p staticfiles
python manage.py collectstatic --noinput

echo "🚀 Starting Gunicorn"
exec gunicorn project.wsgi:application \
     --bind 0.0.0.0:8000 \
     --workers 3