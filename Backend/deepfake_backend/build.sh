#!/usr/bin/env bash
# Backend build script for Render deployment
set -o errexit   # exit on any error

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
