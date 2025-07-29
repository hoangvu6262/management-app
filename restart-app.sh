#!/bin/bash
cd /home/ubuntu/ManagementApp
docker-compose down
docker-compose up -d --build
docker system prune -f
