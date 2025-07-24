#!/bin/bash
# Script para probar la redirección post-login en WordPress (BuddyBoss)
# Autor: Red Judicial
# Uso: bash test_login_redireccion.sh usuario clave

WP_URL="https://www.redjudicial.cl"
LOGIN_URL="$WP_URL/acceso/"
DASHBOARD_URL="$WP_URL/dashboard"

USER="$1"
PASS="$2"

if [ -z "$USER" ] || [ -z "$PASS" ]; then
  echo "Uso: bash test_login_redireccion.sh usuario clave"
  exit 1
fi

# 1. Obtener cookies iniciales del formulario de login
COOKIEJAR="/tmp/wp_login_cookies.txt"
curl -s -c $COOKIEJAR "$LOGIN_URL" > /dev/null

# 2. Enviar login y seguir redirecciones
RESPONSE=$(curl -s -L -b $COOKIEJAR -c $COOKIEJAR \
  -d "log=$USER&pwd=$PASS&redirect_to=$WP_URL&testcookie=1&wp-submit=Acceder" \
  "$LOGIN_URL" -w '\nFINAL_URL:%{url_effective}\n')

# 3. Mostrar la URL final tras el login
echo "$RESPONSE" | grep 'FINAL_URL:'

# 4. Limpiar cookies
rm -f $COOKIEJAR 