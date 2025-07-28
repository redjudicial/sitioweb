#!/bin/bash

# 🔍 Script de Verificación de Deploy de Noticias
# Verifica que noticias.html y sus archivos se hayan desplegado correctamente

echo "🔍 VERIFICANDO DEPLOY DE NOTICIAS..."
echo "=================================="

# Verificar archivos en servidor
echo "📁 Verificando archivos en servidor..."
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@23.22.241.121 "
    echo '📄 Archivos principales:' &&
    ls -la /opt/bitnami/wordpress/noticias.html /opt/bitnami/wordpress/css/noticias.css /opt/bitnami/wordpress/js/noticias.js 2>/dev/null || echo '❌ Archivos de noticias NO encontrados' &&
    echo '📊 Timestamps:' &&
    stat -c '%y %n' /opt/bitnami/wordpress/noticias.html /opt/bitnami/wordpress/css/noticias.css /opt/bitnami/wordpress/js/noticias.js 2>/dev/null || echo '❌ No se pudieron verificar timestamps'
"

# Verificar que las URLs responden
echo ""
echo "🌐 Verificando URLs..."
echo "📄 noticias.html:"
curl -I "https://www.redjudicial.cl/noticias.html" 2>/dev/null | head -3

echo "📄 css/noticias.css:"
curl -I "https://www.redjudicial.cl/css/noticias.css" 2>/dev/null | head -3

echo "📄 js/noticias.js:"
curl -I "https://www.redjudicial.cl/js/noticias.js" 2>/dev/null | head -3

# Verificar contenido de noticias.html
echo ""
echo "📄 Verificando contenido de noticias.html..."
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@23.22.241.121 "
    echo '🔍 Verificando referencias CSS y JS:' &&
    grep -n 'noticias.css' /opt/bitnami/wordpress/noticias.html || echo '❌ CSS de noticias no referenciado' &&
    grep -n 'noticias.js' /opt/bitnami/wordpress/noticias.html || echo '❌ JS de noticias no referenciado' &&
    echo '🔍 Verificando estructura básica:' &&
    grep -n '<title>' /opt/bitnami/wordpress/noticias.html || echo '❌ Título no encontrado' &&
    grep -n 'noticias-container' /opt/bitnami/wordpress/noticias.html || echo '❌ Contenedor de noticias no encontrado'
"

# Verificar API de Supabase
echo ""
echo "🗄️ Verificando API de Supabase..."
curl -s "https://qfomiierchksyfhxoukj.supabase.co/rest/v1/noticias_juridicas?select=count" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmb21paWVyY2hrc3lmaHhvdWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjgxNTYsImV4cCI6MjA2NjYwNDE1Nn0.HqlptdYXjd2s9q8xHEmgQPyf6a95fosb0YT5b4asMA8" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmb21paWVyY2hrc3lmaHhvdWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjgxNTYsImV4cCI6MjA2NjYwNDE1Nn0.HqlptdYXjd2s9q8xHEmgQPyf6a95fosb0YT5b4asMA8" | head -5

echo ""
echo "✅ Verificación completada"
echo "🌐 URL para verificar: https://www.redjudicial.cl/noticias.html" 