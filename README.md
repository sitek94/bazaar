# Bazaar

This project helps me learn how to orchestrate multiple services using Docker Compose. I want to create a solid example that follows good practices for container setup, networking, and basic security.

## Prerequisites

- Docker (v20+ recommended)
- Docker Compose (v2+ recommended)

## Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/sitek94/bazaar.git
cd bazaar
```

2. **Set up environment variables and secrets:**

```bash
cp .env.example .env

echo "postgres_password" > secrets/postgres_password.txt
echo "pgadmin_password" > secrets/pgadmin_password.txt
echo "redis_password" > secrets/redis_password.txt
echo "redis_user" > secrets/redis_user.txt

# Set permissions for secrets
chmod 600 secrets/*.txt
```

3. **Start the services in detached mode:**

```bash
docker compose up -d
```

4. **Verify the services are running:**

```bash
docker compose ps
```

5. **View logs:**

```bash
docker compose logs -f
```

6. **Stop the services:**

To stop all running services:

```bash
docker compose stop
```

## Commands

| Command | Description |
| --- | --- |
| `docker compose up -d --build` | Start all services in detached mode and rebuild images |
| `docker compose up -d --force-recreate --build` | Forcibly recreate containers and rebuild from scratch |
| `docker compose stop` | Stop services without removing containers |
| `docker compose down -v` | Stop and remove all containers, networks, and volumes (deletes data) |
| `docker compose restart <service>` | Restart a specific service |
| `docker compose logs -f <service>` | Tail logs for a specific service |
| `docker compose prune` | Remove unused images and volumes |
| `docker compose exec <service> sh` | Open a shell inside a running container |
| `docker compose exec postgres psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}` | Connect to the PostgreSQL database |

## Services

| Service | Description | Access |
| --- | --- | --- |
| `reverse_proxy` | Nginx reverse proxy for all HTTP traffic | [http://localhost](http://localhost) |
| `frontend` | Vite+React application (via Nginx proxy) | [http://localhost](http://localhost) |
| `backend` | Hono backend API | [http://api.localhost](http://api.localhost) |
| `postgres` | PostgreSQL database | 5432 (no web UI) |
| `pgadmin` | PgAdmin interface for managing PostgreSQL | [http://pgadmin.localhost](http://pgadmin.localhost) |
| `redis` | Redis cache | 6379 (no web UI) |

### Localhost Subdomains Setup

To access services via custom subdomains (e.g., `api.localhost`, `pgadmin.localhost`), add these lines to your `/etc/hosts` file:

```
127.0.0.1   localhost api.localhost pgadmin.localhost
```