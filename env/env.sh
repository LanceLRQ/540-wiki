#!/bin/bash

case "$1" in
  "start"|"up")
    docker-compose -f docker-compose.yml -p 540_wiki up -d;;
  "stop"|"down")
    docker-compose -f docker-compose.yml -p 540_wiki down;;
  "restart")
    docker-compose -f docker-compose.yml -p 540_wiki down
    docker-compose -f docker-compose.yml -p 540_wiki up -d
   ;;
  "ps")
    docker-compose -f docker-compose.yml -p 540_wiki ps;; 
  "logs")
    docker-compose -f docker-compose.yml -p 540_wiki logs ${@:2};;
  "exec")
    docker-compose -f docker-compose.yml -p 540_wiki exec ${2} ${@:3};;
  "bash")
    docker-compose -f docker-compose.yml -p 540_wiki exec ${2} bash;;
  "default")
    echo "不支持的命令";;
esac 
