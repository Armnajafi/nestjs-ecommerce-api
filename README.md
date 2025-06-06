# E-Commerce Microservices Platform

This is an experimental **E-Commerce Platform** built with a modern microservices architecture using:

* [NestJS](https://nestjs.com/) (TypeScript framework)
* [RabbitMQ](https://www.rabbitmq.com/) (message broker)
* [Prisma](https://www.prisma.io/) (ORM)
* OAuth2.0 (for authentication/authorization)
* Docker & Docker Compose
* Swagger (OpenAPI documentation)
* GitHub Actions (CI/CD)
* Jest (testing framework)
* Winston (logging)
* Grafana (monitoring)

## Goal

The goal of this project is to build a **scalable**, **modular**, and **production-ready** e-commerce system using best practices.

Each major domain of the system will be implemented as a **separate microservice**, communicating via **RabbitMQ**.

## Current State

✅ Monorepo project structure
✅ Basic Gateway → Auth Service RPC communication
✅ Dockerized RabbitMQ broker
✅ Initial GitHub repository setup

## Planned Services

* Gateway API
* Auth Service
* Products Service
* Orders Service (future)
* Payments Service (future)
* Notifications Service (future)

## Usage (Local Development)

### 1️⃣ Clone the repository

```
git clone https://github.com/Armnajafi/nestjs-ecommerce-api.git
cd nestjs-ecommerce-api
```

### 2️⃣ Start RabbitMQ

```
docker-compose up -d
```

### 3️⃣ Run services

```
# In separate terminals:
npm run start --prefix apps/gateway
npm run start --prefix apps/auth
npm run start --prefix apps/products
```

## Architecture Overview

```
[ Client ] → [ Gateway API ] → [ RabbitMQ ] → [ Microservices ]
                             ↳ Auth Service
                             ↳ Products Service
                             ↳ Orders Service
                             ↳ Payments Service
                             ↳ Notifications Service
```

## License

This project is licensed under the MIT License.
