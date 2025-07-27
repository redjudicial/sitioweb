#!/bin/bash

echo "🔍 VERIFICACIÓN DE DEPLOY - Red Judicial"
echo "=========================================="

# Conectar al servidor y verificar archivos
ssh -o StrictHostKeyChecking=no bitnami@23.22.241.121 "
echo '📁 Archivos en /home/bitnami/landing/:' &&
ls -la /home/bitnami/landing/*.html &&
echo '📁 Archivos en /opt/bitnami/wordpress/:' &&
ls -la /opt/bitnami/wordpress/*.html &&
echo '📄 Footer de index.html en landing:' &&
tail -5 /home/bitnami/landing/index.html &&
echo '📄 Footer de index.html en WordPress:' &&
tail -5 /opt/bitnami/wordpress/index.html &&
echo '🔍 Buscando isotipo en index.html:' &&
grep -n 'isotipo-small.png' /opt/bitnami/wordpress/index.html || echo '✅ No se encontró isotipo' &&
echo '🔍 Verificando cache busting en index.html:' &&
grep -n 'v=20250727' /opt/bitnami/wordpress/index.html || echo '⚠️ Cache busting no encontrado' &&
echo '📊 Tamaños de archivos:' &&
echo 'Landing index.html:' && wc -l /home/bitnami/landing/index.html &&
echo 'WordPress index.html:' && wc -l /opt/bitnami/wordpress/index.html &&
echo '🕐 Timestamps:' &&
echo 'Landing:' && stat /home/bitnami/landing/index.html | grep Modify &&
echo 'WordPress:' && stat /opt/bitnami/wordpress/index.html | grep Modify
" 