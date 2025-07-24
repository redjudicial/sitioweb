#!/bin/bash
# Script para inspeccionar lógica de redirección post-login en WordPress
# Autor: Red Judicial
# Uso: bash inspeccion_redireccion_wp.sh

# Configuración SSH
SSH_USER="bitnami"
SSH_HOST="23.22.241.121"
SSH_KEY="$HOME/.ssh/id_ed25519_deploy_nopass"
WP_PATH="/opt/bitnami/wordpress"

# 1. Buscar hooks de login_redirect en functions.php y plugins
CMD1="grep -rni 'login_redirect' $WP_PATH/wp-content/themes/ $WP_PATH/wp-content/plugins/ $WP_PATH/wp-content/mu-plugins/ 2>/dev/null"

# 2. Buscar funciones wp_safe_redirect, wp_redirect y header('Location')
CMD2="grep -rniE 'wp_safe_redirect|wp_redirect|header\\s*\\(\\s*\\'Location' $WP_PATH/wp-content/themes/ $WP_PATH/wp-content/plugins/ $WP_PATH/wp-content/mu-plugins/ 2>/dev/null"

# 3. Mostrar functions.php completo si hay algo sospechoso
CMD3="cat $WP_PATH/wp-content/themes/*/functions.php"

# Ejecutar comandos por SSH
ssh -i $SSH_KEY $SSH_USER@$SSH_HOST "echo '--- Hooks login_redirect ---'; $CMD1; echo '
--- Redirecciones directas ---'; $CMD2; echo '
--- functions.php ---'; $CMD3" 