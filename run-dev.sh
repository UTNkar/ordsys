#!/usr/bin/bash

docker-compose up --d
docker-compose exec backend pip install -r dev-requirements.txt 
docker-compose exec backend python manage.py migrate                     
docker-compose exec backend python manage.py createorganisation 
docker-compose exec backend python manage.py createsuperuser
docker-compose exec -d backend python manage.py runserver
