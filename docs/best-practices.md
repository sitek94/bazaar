# Best Practices

This document describes best practices applied in the project. Following these practices helps make applications more secure, efficient, and easier to manage. It aims to serve as a practical example for those learning about Docker and Docker Compose.

## Docker Compose Best Practices

-   **Managed application settings and secrets safely**
    -   Used `.env` files to provide environment variables for application configuration.
    -   This keeps general settings out of version control and separate from the Docker images.
    -   Used Docker `secrets` for highly sensitive data, such as the passwords for the Postgres database and Redis.
    -   Docker secrets are a more secure way to handle sensitive values, making them available to containers only at runtime and not storing them in the image or version control.
-   **Used named volumes for persistent data**
    -   Set up named volumes (e.g., `postgres_data`, `redis_data`) for services like the database and cache that need to keep their data safe.
    -   This keeps important data safe if a container is stopped or removed.
    -   Chose named volumes as they are easier to manage and refer to later compared to anonymous volumes.
-   **Set up restart policies for services**
    -   Configured services with `restart: unless-stopped`.
    -   This ensures that services automatically start up again if they crash or if the server reboots, unless they were intentionally stopped. This helps keep the application running smoothly.
-   **Used custom networks for service communication**
    -   Created custom bridge networks (`bazaar_internal_network`, `bazaar_external_network`) to organize service communication.
    -   This improves security by isolating services and allows them to communicate using their service names. It also provides clearer network organization.
-   **Defined healthchecks for key services**
    -   A healthcheck is a command Docker runs from time to time to check if a service is responsive and working as expected.
    -   This helps Docker understand if these services are running correctly. For example, a healthcheck might verify if a web server is responding to requests.
    -   If a service fails its healthcheck, Docker can then try to restart it or mark it as unhealthy.
-   **Controlled service startup order with `depends_on`**
    -   Ensured services start in the correct order (e.g., `backend` waits for `postgres` and `redis`).
    -   This helps prevent application errors that can happen if a service tries to connect to another service that hasn't started yet.
-   **Added resource limits to all services**
    -   `mem_limit` - Docker ensures that the processes running inside that specific container will not be allowed to consume more RAM than the limit.
    -   `cpus` - This limit controls how much of the host machine's CPU processing power a container can use.
    -   `pids_limit` - Restricts the maximum number of concurrent processes (identified by PIDs) a container can run, preventing uncontrolled process creation.
        -   *PID (Process IDentifier)* - a unique number for each running program instance

## Dockerfile Best Practices

-   **Used trusted sources for base images**
    -   All base images are sourced from official repositories on Docker Hub, such as `node`, `postgres`, and other images from verified publishers.
-   **Used minimal base images**
    -   Images like `alpine` are used to reduce the overall image size.
    -   Smaller images mean faster downloads, less disk space used, and a smaller attack surface.
-   **Pinned image versions**
    -   Avoided the use of `latest` or other floating tags to ensure build stability.
    -   Used specific image versions, e.g. `postgres:15-alpine`.
    -   Considered using SHA256 digests for immutable builds, but decided it was overkill for this project's scale.
-   **Used non-root user to run applications**
    -   Created a dedicated user and group within the Dockerfiles to run the main application process.
    -   This improves security by limiting the permissions of the application, reducing potential damage if an attacker gains access.
-   **Used `.dockerignore`**
    -   This file tells Docker to ignore certain files and folders when building an image.
    -   It speeds up the build process by reducing the amount of data sent to the Docker daemon.
    -   It also helps prevent sensitive files from being included in the image and keeps the build context (the files sent to Docker) clean and small.
-   **Used multi-stage builds**
    -   Made smaller final images for `frontend` and `backend` by separating the tools needed to build the application from the essential parts it needs to run.
    -   This makes the final images smaller and helps reduce security risks.
-   **Preferred `COPY` over `ADD` in Dockerfiles**
    -   Used the `COPY` command to get files into the image because it's more straightforward.
    -   `COPY` is generally recommended over `ADD` unless `ADD`'s specific features (like auto-extracting tarballs or using URLs) are needed, which they weren't here. This makes the Dockerfile easier to understand.
-   **Avoided storing secrets directly in Dockerfiles**
    -   Did not use `ARG` or `ENV` instructions in Dockerfiles to pass sensitive information like passwords or API keys.
    -   This prevents secrets from being baked into the image layers, which can be inspected, making them more secure.

