#!/bin/bash

echo "🧹 LIMPIEZA FORZADA DE TODOS LOS CACHES - Red Judicial"
echo "======================================================"

ssh -o StrictHostKeyChecking=no bitnami@23.22.241.121 "
echo '🔴 Limpiando Redis completamente...' &&
redis-cli FLUSHALL &&
echo '⚡ Limpiando WP-Optimize...' &&
cd /opt/bitnami/wordpress &&
wp wpo cache flush --allow-root &&
echo '📁 Limpiando cache WordPress...' &&
sudo rm -rf /opt/bitnami/wordpress/wp-content/cache/* &&
sudo rm -rf /opt/bitnami/wordpress/wp-content/uploads/cache/* &&
sudo rm -rf /opt/bitnami/wordpress/wp-content/wpo-cache/* &&
sudo rm -rf /opt/bitnami/wordpress/wp-content/cache/wpo-cache/* &&
echo '🌐 Limpiando cache de navegador (headers)...' &&
sudo rm -rf /opt/bitnami/wordpress/.htaccess &&
echo 'RewriteEngine On' | sudo tee /opt/bitnami/wordpress/.htaccess &&
echo 'Header set Cache-Control \"no-cache, no-store, must-revalidate\"' | sudo tee -a /opt/bitnami/wordpress/.htaccess &&
echo 'Header set Pragma \"no-cache\"' | sudo tee -a /opt/bitnami/wordpress/.htaccess &&
echo 'Header set Expires 0' | sudo tee -a /opt/bitnami/wordpress/.htaccess &&
echo '🔄 Reiniciando todos los servicios...' &&
sudo /opt/bitnami/ctlscript.sh restart apache &&
sudo /opt/bitnami/ctlscript.sh restart nginx &&
sudo systemctl restart redis &&
echo '✅ Verificación final del footer:' &&
grep -A 5 -B 5 'Red Judicial © 2025' /opt/bitnami/wordpress/index.html &&
echo '🌐 URL para verificar: https://www.redjudicial.cl?v=$(date +%s)' &&
echo '✅ TODOS LOS CACHES LIMPIADOS FORZADAMENTE'
" 