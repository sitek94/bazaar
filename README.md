<h1>
  Bazaar
  <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" style="vertical-align: bottom;" viewBox="0 0 512 512"><path fill="currentColor" d="M203.72 87.938c-2.082.017-4.18.31-6.282.874c-13.45 3.608-21.412 17.53-17.782 31.094c1.384 5.172 4.235 9.52 8 12.75c-31.85 15.446-53.498 45.172-59.28 78.72l-22.532 7.593c-11.235-2.877-21.416-4.2-30.53-4.095c-14.696.167-26.65 4.02-35.908 10.97c-18.518 13.896-23.316 38.02-19.53 60.655c3.784 22.636 15.81 45.127 34.343 59.344c18.532 14.216 44.715 18.96 71.03 4.875c4.43-2.373 8.776-4.81 12.813-6.97c2.993 10.772 14.018 17.16 24.75 14.28c10.253-2.75 16.547-12.963 14.656-23.31c16.984 10.05 34.495 15.674 52.186 17.405c-14.094 20.893-32.316 39.57-53.97 54.78c27.754 27.726 224.764-24.853 229.626-61.592c-26.89-2.484-52.525-9.935-75.562-21.563c67.995-43.983 128.655-133.27 160.656-234.563l-42.47 14.344c-44.11 67.313-122.214 103.81-167.155 28a107.9 107.9 0 0 0-53-9.593c1.656-4.69 1.95-9.913.564-15.093c-3.063-11.443-13.392-18.998-24.625-18.906zM76.062 233.53c5.11-.027 10.865.51 17.312 1.75c18.656 36.728 39.31 63.938 61.188 82.845c-.767.113-1.546.263-2.313.47q-.22.058-.438.124c-2.846.324-5.588 1.044-8.218 1.936c-9.64 3.27-18.73 9.084-27.156 13.594c-20.655 11.056-36.95 7.41-50.844-3.25c-13.895-10.66-24.256-29.5-27.28-47.594c-3.027-18.094.948-34.097 12.31-42.625c5.683-4.263 13.943-7.186 25.438-7.25z"/></svg>
</h1>

This project helps me learn how to orchestrate multiple services using Docker Compose. The goal is to create a solid example that follows good practices for container setup, networking, and basic security.

For a detailed look at the principles and practices applied, please see the [Best Practices documentation](./docs/best-practices.md).

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

**Note:** After running this command for the first time, you need to trust the generated certificate to access the services via HTTPS, see [Local development with HTTPS](#local-development-with-https) section for more details.

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
| `reverse_proxy` | Caddy reverse proxy for all HTTP traffic | [https://localhost](https://localhost) |
| `frontend` | Vite+React application (served by Nginx) | [https://bazaar.localhost](https://bazaar.localhost) |
| `backend` | Hono backend API | [https://api.localhost](https://api.localhost) |
| `postgres` | PostgreSQL database | 5432 (no web UI) |
| `pgadmin` | PgAdmin interface for managing PostgreSQL | [https://pgadmin.localhost](https://pgadmin.localhost) |
| `redis` | Redis cache | 6379 (no web UI) |

### Local development with HTTPS

After running `docker compose up -d` for the first time, in `reverse_proxy` directory you will find a `root.crt` file. You need to trust it to access services via HTTPS.

Run the following command on MacOS to trust the certificate (or see [Caddy docs](https://caddyserver.com/docs/running#local-https-with-docker) for other platforms):

```sh
sudo security add-trusted-cert -d -r trustRoot \
   -k /Library/Keychains/System.keychain ./reverse_proxy/data/caddy/pki/authorities/local/root.crt 
```

Additionally, add these lines to your `/etc/hosts` file to access services via custom subdomains (e.g., `api.localhost`, `pgadmin.localhost`):

```
127.0.0.1   localhost api.localhost bazaar.localhost pgadmin.localhost
```

Now you can access all the services via HTTPS, see [Services](#services) section for more details.