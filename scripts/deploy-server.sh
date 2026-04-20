#!/usr/bin/env bash

set -euo pipefail

APP_DIR="/opt/adaemlak-app"
STATIC_DIR="/var/www/adaemlak"
DB_DIR="/var/lib/adaemlak-api"
BUNDLE="/root/adaemlak_backend_bundle.tar.gz"
ENV_FILE="/etc/adaemlak-api.env"
SERVICE_FILE="/etc/systemd/system/adaemlak-api.service"
NGINX_DEFAULT="/etc/nginx/sites-enabled/default"

mkdir -p "${APP_DIR}" "${STATIC_DIR}" "${DB_DIR}"

find "${APP_DIR}" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
tar xzf "${BUNDLE}" -C "${APP_DIR}"

rsync -a --delete "${APP_DIR}/dist/" "${STATIC_DIR}/"

cd "${APP_DIR}"
npm install --omit=dev

if [ ! -f "${ENV_FILE}" ]; then
  cat > "${ENV_FILE}" <<'EOF'
PORT=3205
ADAEMLAK_DB_DIR=/var/lib/adaemlak-api
ADAEMLAK_ADMIN_USERNAME=adaemlakyk
ADAEMLAK_ADMIN_PASSWORD=60729663.Yk
ADAEMLAK_TOKEN_SECRET=3f7cf8f16c6fba19b3dd93f2e7d3c494c52abceea3d6f7948f8d4f6e4f0d6f8e
EOF
fi

cat > "${SERVICE_FILE}" <<'EOF'
[Unit]
Description=Ada Emlak API Service
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/adaemlak-app
EnvironmentFile=/etc/adaemlak-api.env
ExecStart=/usr/bin/node /opt/adaemlak-app/server/index.mjs
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

python3 - <<'PY'
from pathlib import Path

path = Path("/etc/nginx/sites-enabled/default")
content = path.read_text()
needle = """    location /adaemlak/ {\n        alias /var/www/adaemlak/;\n        try_files $uri $uri/ /adaemlak/index.html;\n    }\n"""
block = """    location /adaemlak/api/ {\n        proxy_pass http://127.0.0.1:3205/api/;\n        proxy_http_version 1.1;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n    }\n\n"""

if "location /adaemlak/api/" not in content and needle in content:
    content = content.replace(needle, block + needle)
    path.write_text(content)
PY

chown -R root:root "${APP_DIR}"
chmod -R a+rX "${APP_DIR}"
chown -R www-data:www-data "${DB_DIR}" "${STATIC_DIR}"

systemctl daemon-reload
systemctl enable --now adaemlak-api
nginx -t
systemctl reload nginx
