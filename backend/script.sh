#!/bin/sh

cd /home/code/src

npx prisma generate
npx prisma migrate dev

exec npm run start