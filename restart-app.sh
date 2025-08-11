#!/bin/bash
cd /home/ubuntu/management-app
docker-compose down
docker-compose up -d --build
docker system prune -f
