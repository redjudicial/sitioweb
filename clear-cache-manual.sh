#!/bin/bash

echo "🧹 LIMPIEZA MANUAL DE CACHES - Red Judicial"
echo "=============================================="

# Limpiar cache de WordPress
echo "📁 Limpiando cache WordPress..."
sudo rm -rf /opt/bitnami/wordpress/wp-content/cache/*
sudo rm -rf /opt/bitnami/wordpress/wp-content/uploads/cache/*
sudo rm -rf /opt/bitnami/wordpress/wp-content/wpo-cache/*
sudo rm -rf /opt/bitnami/wordpress/wp-content/cache/wpo-cache/*

# Limpiar cache de Redis
echo "🔴 Limpiando cache Redis..."
redis-cli FLUSHALL 2>/dev/null || echo "⚠️ Redis no disponible"

# Limpiar cache de WP-Optimize
echo "⚡ Limpiando cache WP-Optimize..."
cd /opt/bitnami/wordpress
wp wpo cache flush --allow-root 2>/dev/null || echo "⚠️ WP-Optimize no disponible"

# Limpiar cache de Cloudflare (si tienes API key)
echo "☁️ Limpiando cache Cloudflare..."
# curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
#      -H "Authorization: Bearer YOUR_API_TOKEN" \
#      -H "Content-Type: application/json" \
#      --data '{"purge_everything":true}' 2>/dev/null || echo "⚠️ Cloudflare API no configurada"

# Reiniciar servicios
echo "🔄 Reiniciando servicios..."
sudo /opt/bitnami/ctlscript.sh restart apache
sudo /opt/bitnami/ctlscript.sh restart nginx
sudo systemctl restart redis 2>/dev/null || echo "⚠️ Redis service no disponible"

# Verificar archivos
echo "📄 Verificando archivos actualizados..."
echo "Footer (últimas 5 líneas):"
tail -5 /opt/bitnami/wordpress/index.html

echo "Chat widget (buscando info de planes):"
grep -n "studentPlansInfo" /opt/bitnami/wordpress/chat-widget.js || echo "⚠️ Info de planes no encontrada"

echo "✅ Limpieza completada!"
echo "🌐 Verifica en: https://www.redjudicial.cl?v=$(date +%s)" 