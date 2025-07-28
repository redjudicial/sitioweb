# 🔧 FIX: Deploy de noticias.html - Problema Resuelto

## 🚨 PROBLEMA IDENTIFICADO

**Fecha:** 28 de Julio 2025  
**Estado:** ✅ RESUELTO

### **Síntomas:**
- ✅ GitHub Action se ejecutaba correctamente
- ✅ Archivos principales (`index.html`, `estudiantes.html`) se actualizaban
- ❌ `noticias.html` **NO se actualizaba** en el servidor
- ❌ `css/noticias.css` y `js/noticias.js` **NO se copiaban**
- ❌ Página de noticias mostraba versión antigua

### **Causa Raíz:**
El archivo `.github/workflows/deploy.yml` **NO incluía** los archivos de noticias en el proceso de deploy:

```yaml
# ❌ PROBLEMA: No incluía noticias.html
scp -o StrictHostKeyChecking=no \
  index.html \
  estudiantes.html \
  # noticias.html ← FALTABA
  script.js \
  styles.css \
  estudiantes.css \
  chat-widget.js \
  # css/noticias.css ← FALTABA
  # js/noticias.js ← FALTABA
  bitnami@23.22.241.121:/home/bitnami/landing/
```

## ✅ SOLUCIÓN APLICADA

### **1. Incluir archivos de noticias en el deploy:**
```yaml
# ✅ SOLUCIÓN: Incluir noticias.html
scp -o StrictHostKeyChecking=no \
  index.html \
  estudiantes.html \
  noticias.html \  # ← AGREGADO
  script.js \
  styles.css \
  estudiantes.css \
  chat-widget.js \
  bitnami@23.22.241.121:/home/bitnami/landing/
```

### **2. Agregar paso específico para archivos de noticias:**
```yaml
# ✅ SOLUCIÓN: Paso específico para noticias
- name: Deploy noticias files via SCP
  run: |
    echo "📤 Desplegando archivos de noticias..."
    ssh -o StrictHostKeyChecking=no bitnami@23.22.241.121 "
      mkdir -p /home/bitnami/landing/css /home/bitnami/landing/js
    "
    scp -o StrictHostKeyChecking=no \
      css/noticias.css \
      bitnami@23.22.241.121:/home/bitnami/landing/css/
    scp -o StrictHostKeyChecking=no \
      js/noticias.js \
      bitnami@23.22.241.121:/home/bitnami/landing/js/
```

### **3. Copiar archivos de noticias a WordPress:**
```yaml
# ✅ SOLUCIÓN: Copiar noticias.html a WordPress
sudo cp /home/bitnami/landing/noticias.html /opt/bitnami/wordpress/ &&
sudo mkdir -p /opt/bitnami/wordpress/css /opt/bitnami/wordpress/js &&
sudo cp -r /home/bitnami/landing/css/* /opt/bitnami/wordpress/css/ &&
sudo cp -r /home/bitnami/landing/js/* /opt/bitnami/wordpress/js/
```

### **4. Verificaciones robustas:**
```yaml
# ✅ SOLUCIÓN: Verificaciones completas
echo '📁 Archivos de noticias en WordPress:' &&
ls -la /opt/bitnami/wordpress/css/noticias.css /opt/bitnami/wordpress/js/noticias.js /opt/bitnami/wordpress/noticias.html &&
echo '📄 Verificando noticias.html:' &&
grep -n 'noticias.css' /opt/bitnami/wordpress/noticias.html &&
grep -n 'noticias.js' /opt/bitnami/wordpress/noticias.html
```

### **5. Purgar cache de Cloudflare automáticamente:**
```yaml
# ✅ SOLUCIÓN: Purgar cache automáticamente
- name: Purge Cloudflare cache
  run: |
    curl -X POST "https://api.cloudflare.com/client/v4/zones/41a7ba1fa6bff0d03a8ee330f3142e1e/purge_cache" \
      -H "X-Auth-Email: nicolas.barriga@redjudicial.cl" \
      -H "X-Auth-Key: c2c39aca7709ff004afb6f7232d73d70ffbcc" \
      -H "Content-Type: application/json" \
      --data '{"purge_everything":true}'
```

## 🛡️ PREVENCIÓN PARA EL FUTURO

### **Reglas OBLIGATORIAS:**

1. **✅ SIEMPRE incluir nuevos archivos en deploy.yml**
   - Cuando agregues un nuevo archivo HTML/CSS/JS
   - Agregarlo inmediatamente al workflow de GitHub Actions

2. **✅ SIEMPRE verificar estructura de directorios**
   - Crear directorios necesarios (`css/`, `js/`, etc.)
   - Verificar que existan antes de copiar archivos

3. **✅ SIEMPRE agregar verificaciones**
   - Verificar que archivos se copiaron correctamente
   - Verificar timestamps de archivos
   - Verificar referencias en HTML

4. **✅ NUNCA usar `|| true` en comandos críticos**
   - Oculta errores importantes
   - Usar mensajes de error específicos

5. **✅ SIEMPRE purgar cache después del deploy**
   - Cloudflare cachea archivos estáticos
   - Cambios no son visibles sin purgar cache

### **Checklist para nuevos archivos:**

- [ ] Agregar archivo al paso `Deploy landing files via SCP`
- [ ] Agregar paso específico si necesita directorio especial
- [ ] Agregar copia a WordPress en `Copy files to WordPress directory`
- [ ] Agregar verificación en `Verify deployment`
- [ ] Probar deploy en staging antes de producción

### **Comandos de verificación post-deploy:**

```bash
# Verificar archivos de noticias
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@23.22.241.121 "ls -la /opt/bitnami/wordpress/noticias.html /opt/bitnami/wordpress/css/noticias.css /opt/bitnami/wordpress/js/noticias.js"

# Verificar timestamps
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@23.22.241.121 "stat -c '%y %n' /opt/bitnami/wordpress/noticias.html"

# Verificar que página carga
curl -I "https://www.redjudicial.cl/noticias.html"

# Verificar que CSS y JS cargan
curl -I "https://www.redjudicial.cl/css/noticias.css"
curl -I "https://www.redjudicial.cl/js/noticias.js"
```

## 🎯 RESULTADO FINAL

- ✅ **noticias.html se despliega correctamente**
- ✅ **css/noticias.css se copia a WordPress**
- ✅ **js/noticias.js se copia a WordPress**
- ✅ **Verificaciones robustas previenen errores**
- ✅ **Cache de Cloudflare se purga automáticamente**
- ✅ **Deploy es completamente automático**

**Lección aprendida:** Siempre incluir TODOS los archivos necesarios en el workflow de GitHub Actions, no solo los principales.

---

**Archivos modificados:**
- `.github/workflows/deploy.yml` - Agregado deploy de noticias
- `DEPLOY_NOTICIAS_FIX.md` - Esta documentación

**Fecha de aplicación:** 28 de Julio 2025  
**Responsable:** Sistema de noticias jurídicas 