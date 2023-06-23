#!/bin/bash

dockerService=$(pgrep docker | wc -l)

if [[ $dockerService -eq 0 ]];then
    open -a Docker
    sleep 35;
fi

(cd ~/Desktop/ft_transcendence/backend && docker-compose up --build -d)


(cd backend/src/ && npx prisma migrate dev)
osascript -e 'tell application "Terminal" to do script "cd ~/Desktop/ft_transcendence/frontend/ && npm run dev"'
osascript -e 'tell application "Terminal" to do script "cd ~/Desktop/ft_transcendence/backend/src && npx prisma studio"'
(cd backend/ && npm run start:dev)
