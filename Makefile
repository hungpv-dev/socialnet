up:
	docker-compose up -d

build:
	docker-compose up --build
	docker compose exec server composer install

php:
	docker-compose exec server bash

laravel-echo-server:
	docker logs -f laravel_echo_server
