#!/bin/bash

echo "🌩️ PURGAR CACHE DE CLOUDFLARE - Red Judicial"
echo "=============================================="

# Cargar variables de entorno
if [ -f "APIS_Y_CREDENCIALES.env" ]; then
    source APIS_Y_CREDENCIALES.env
    echo "✅ Variables de entorno cargadas"
else
    echo "❌ Error: No se encontró APIS_Y_CREDENCIALES.env"
    exit 1
fi

# Verificar que las variables estén configuradas
if [ -z "$CLOUDFLARE_API_KEY" ] || [ -z "$CLOUDFLARE_EMAIL" ] || [ -z "$CLOUDFLARE_ZONE_ID" ]; then
    echo "❌ Error: Variables de Cloudflare no configuradas"
    echo "Verifica CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL y CLOUDFLARE_ZONE_ID"
    exit 1
fi

# Purgar cache de URLs principales
echo "🧹 Purgando cache de URLs principales..."
RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
    -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
    -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
    -H "Content-Type: application/json" \
    --data '{
        "files": [
            "https://www.redjudicial.cl/",
            "https://www.redjudicial.cl/index.html",
            "https://redjudicial.cl/",
            "https://redjudicial.cl/index.html",
            "https://www.redjudicial.cl/estudiantes.html",
            "https://redjudicial.cl/estudiantes.html"
        ]
    }')

# Verificar respuesta
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Cache purgado exitosamente"
    echo "🔍 Verificando status..."
    
    # Verificar que el cache esté limpio
    sleep 2
    STATUS_WWW=$(curl -s -I "https://www.redjudicial.cl/" | grep -o 'cf-cache-status: [A-Z]*')
    STATUS_MAIN=$(curl -s -I "https://redjudicial.cl/" | grep -o 'cf-cache-status: [A-Z]*')
    
    echo "📊 Status actual:"
    echo "  www.redjudicial.cl: $STATUS_WWW"
    echo "  redjudicial.cl: $STATUS_MAIN"
    
    if [[ "$STATUS_WWW" == *"DYNAMIC"* ]] || [[ "$STATUS_WWW" == *"MISS"* ]]; then
        echo "✅ www.redjudicial.cl: Cache limpio"
    else
        echo "⚠️ www.redjudicial.cl: Puede tener cache activo"
    fi
    
    if [[ "$STATUS_MAIN" == *"DYNAMIC"* ]] || [[ "$STATUS_MAIN" == *"MISS"* ]]; then
        echo "✅ redjudicial.cl: Cache limpio"
    else
        echo "⚠️ redjudicial.cl: Puede tener cache activo"
    fi
    
    echo ""
    echo "🌐 URLs para verificar:"
    echo "  https://www.redjudicial.cl/?v=$(date +%s)"
    echo "  https://redjudicial.cl/?v=$(date +%s)"
else
    echo "❌ Error al purgar cache:"
    echo "$RESPONSE"
    exit 1
fi

echo ""
echo "✅ Proceso completado"
echo "💡 Tip: Si aún ves contenido antiguo, fuerza la recarga (Cmd+Shift+R)" 