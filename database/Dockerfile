FROM postgres:15.1-alpine

WORKDIR /app
COPY ./seed.sql /docker-entrypoint-initdb.d/seed.sql
