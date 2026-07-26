# Ticketing Microservices Platform

A containerized ticketing application built with a microservices architecture. The project provides authenticated user accounts, ticket management, and order creation through a Next.js web client and independently deployable Node.js services.

## Architecture

```text
Browser (ticketing.com)
        |
        v
Kubernetes NGINX Ingress
  |          |          |          |
  v          v          v          v
Client     Auth       Tickets     Orders
(Next.js) (Express)  (Express)  (Express)
             |          |           |
           MongoDB    MongoDB     MongoDB
                         |
                         v
                   NATS Streaming
```

## Features

- User sign-up, sign-in, sign-out, and current-user endpoints
- JWT-based authentication stored in cookie sessions
- Create, list, view, and update tickets
- Create, view, list, and cancel orders
- Ticket-created and ticket-updated events published through NATS Streaming
- Separate MongoDB deployment for each backend service
- Kubernetes manifests and Skaffold workflow for local development

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js, React, Axios, Bootstrap |
| Backend | Node.js, Express, TypeScript |
| Data | MongoDB, Mongoose |
| Messaging | NATS Streaming |
| Platform | Docker, Kubernetes, NGINX Ingress, Skaffold |
| Testing | Jest, Supertest, mongodb-memory-server |

## Project structure

```text
.
├── auth/       # Authentication service
├── tickets/    # Ticket management service
├── orders/     # Order management service
├── client/     # Next.js web application
├── common/     # Shared TypeScript package source
├── infra/K8s/  # Kubernetes deployments, services, and ingress
└── skaffold.yml
```

## Prerequisites

Install and configure the following before running the application:

- Node.js 18+ and npm
- Docker
- Kubernetes cluster (for example, Minikube or Docker Desktop Kubernetes)
- `kubectl`
- Skaffold
- An NGINX Ingress controller

The Kubernetes manifests reference Docker images under the `asadjan` Docker Hub namespace. Make sure Docker can push to that namespace, or update the image names in `skaffold.yml` and `infra/K8s/` to your own registry.

## Run locally with Kubernetes

1. Start your Kubernetes cluster and enable/install an NGINX Ingress controller. For Minikube:

   ```bash
   minikube start
   minikube addons enable ingress
   ```

2. Create the JWT secret required by the backend services. Use a strong value and never commit it to Git:

   ```bash
   kubectl create secret generic jwt-secret \
     --from-literal=JWT_KEY='replace-with-a-long-random-secret'
   ```

3. Point the local hostname at your cluster ingress IP. With Minikube, first run `minikube ip`, then add its result to your hosts file:

   ```text
   <MINIKUBE_IP> ticketing.com
   ```

4. From the project root, start the development workflow:

   ```bash
   skaffold dev
   ```

5. Open [http://ticketing.com](http://ticketing.com) in your browser.

Skaffold applies all manifests in `infra/K8s/` and rebuilds the Auth, Tickets, and Orders services when their configured source files change. The Client artifact is currently commented out in `skaffold.yml`; uncomment it if you want Skaffold to rebuild the client automatically.

To stop the development workflow, press `Ctrl+C`. To remove the deployed resources:

```bash
skaffold delete
```

## API overview

| Service | Endpoint | Purpose |
| --- | --- | --- |
| Auth | `POST /api/users/signup` | Register a user |
| Auth | `POST /api/users/signin` | Start an authenticated session |
| Auth | `POST /api/users/signout` | End the current session |
| Auth | `GET /api/users/currentuser` | Get the signed-in user |
| Tickets | `GET /api/tickets` | List tickets |
| Tickets | `POST /api/tickets` | Create a ticket (authenticated) |
| Tickets | `GET /api/tickets/:id` | Get a ticket |
| Tickets | `PUT /api/tickets/:id` | Update an owned ticket |
| Orders | `GET /api/orders` | List the signed-in user's orders |
| Orders | `POST /api/orders` | Create an order for an available ticket |
| Orders | `GET /api/orders/:orderId` | Get an order |
| Orders | `DELETE /api/orders/:orderId` | Cancel an order |

## Tests

Each backend service has its own Jest test suite. Install dependencies and run tests from the service directory:

```bash
cd auth && npm install && npm test
cd ../tickets && npm install && npm test
cd ../orders && npm install && npm test
```

The test command runs Jest in watch mode. Press `q` to exit.

## Git hygiene

Do not commit generated dependencies, Next.js build output, or secrets. Keep the following in `.gitignore`:

```gitignore
node_modules/
.next/
dist/
build/
coverage/
.env
.env.*
!.env.example
```

If `node_modules` or `.next` were committed in an earlier commit, adding them to `.gitignore` alone is not enough—you must remove them from the Git history before pushing. See the GitHub cleanup steps discussed with this project.

## License

This project does not currently declare a license. Add a `LICENSE` file before distributing or reusing it outside the intended context.
