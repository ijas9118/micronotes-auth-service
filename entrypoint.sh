#!/bin/sh
echo "Waiting for postgres..."
until nc -z postgres-db 5432; do
  sleep 1
done
pnpm db:generate
pnpm db:migrate
pnpm run dev