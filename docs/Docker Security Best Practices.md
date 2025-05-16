# Docker Security Best Practices

## General Advice

1. Use trusted source for base images, e.g. official images from Docker Hub
2. Use minimal base images, e.g. Alpine
3. Use multi-stage builds
4. Scan images at multiple points: Dockerfile, built time, registry storage, and pre-deployment
5. Use version pinning strategy:
   1. Always use specific image tags rather than "latest"
   2. It's the most specific version, e.g. `nginx:1.23.1` 
   3. Consider using SHA256 digest for immutable builds

## Dockerfile

- Use non-root user by default
- Use COPY instead of ADD
- Use .dockerignore for build context
- Use multi-stage builds
- Use healthcheck

## Unknown Unknowns

- CIS Docker Benchmarks for image validation