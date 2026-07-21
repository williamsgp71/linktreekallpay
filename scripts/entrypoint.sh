#!/bin/sh
set -e

DB_FILE="/app/prisma/dev.db"

if [ ! -f "$DB_FILE" ]; then
  echo "Database does not exist. Initializing schema and seeding..."
  npx prisma db push
  npx prisma db seed
else
  echo "Database already exists. Applying schema updates..."
  npx prisma db push
fi

echo "Starting Next.js standalone server..."
exec node server.js
