#!/usr/bin/bash

# Check if init is supplied
INIT=false

# parse command line arguments, check for init arg is supplied
while true; do
  case "$1" in 
    init) INIT=true; shift ;;
    *) break;;
  esac 
done


docker-compose up -d
docker-compose exec backend pip install -r dev-requirements.txt 
docker-compose exec backend python manage.py migrate                     
if [[ "$INIT" == true ]]; then
    # Only do this incase the uses supplies init, i.e. they want
    # to initialize a user and organisation
    docker-compose exec backend python manage.py createorganisation
    docker-compose exec backend python manage.py createsuperuser
fi
docker-compose exec -d backend python manage.py runserver
