#!/bin/bash
# deploy-hostscript.sh

set -e

echo ">>> hostscript running as $(whoami)@$(hostname)"

cd /home/arkits/software/telegaram/

echo "==> Build haldi - Frontend"
cd haldi
npm install
npm run build
cd ..

echo "==> Build mirchi - Backend"
cd mirchi
npm install

echo "==> Add haldi to mirchi - copy frontend to server"
npm run addHaldi

echo "==> DB migration"
npx prisma migrate deploy

echo "==> Start the server"
# pm2 start src/index.js --name mirchi
pm2 restart mirchi
