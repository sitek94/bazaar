#!/bin/sh
set -eo pipefail

# Read secrets
REDIS_USER=$(cat /run/secrets/redis_user)
REDIS_PASSWORD=$(cat /run/secrets/redis_password)

# Ensure the ACL file directory exists
mkdir -p /etc/redis

# Generate ACL file
cat << EOF > /etc/redis/acl.conf
user default off
user ${REDIS_USER} on >${REDIS_PASSWORD} ~* +@all
EOF

# Set permissions (non-root user)
chown redis:redis /etc/redis/acl.conf
chmod 0400 /etc/redis/acl.conf

# Start Redis with ACL
exec redis-server --aclfile /etc/redis/acl.conf
