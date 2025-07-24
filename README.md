# Red Judicial Landing - Chat Asistente

## 🟢 Widget de Chat con OpenAI (Asistente Red Judicial)

### 1. Backend seguro (Node.js/Express)

- El backend está en `server.js` y usa tu API Key de OpenAI y el ID del asistente.
- **No expone credenciales al frontend.**

#### **Pasos para correr el backend:**

1. Instala dependencias:
   ```bash
   cd landing
   npm install express cors body-parser axios dotenv
   ```
2. Asegúrate de tener el archivo `APIS_Y_CREDENCIALES.env` con tu API Key y configuración.
3. Ejecuta el servidor:
   ```bash
   node server.js
   ```
   Por defecto corre en el puerto 3001. Puedes cambiarlo con la variable de entorno `PORT`.

---

### 2. Widget frontend (chat-widget.js)

- El widget está en `chat-widget.js`.
- Es autocontenible, minimalista y acorde al branding Red Judicial.
- **No tiene sonido.**

#### **Integración:**

1. Copia el archivo `chat-widget.js` en la carpeta `landing/` (ya está incluido).
2. En los archivos `index.html` y `estudiantes.html`, agrega antes de `</body>`:
   ```html
   <script src="chat-widget.js"></script>
   ```
3. El widget solo aparecerá en estas dos páginas.

---

### 3. Prueba local

- Corre el backend (`node server.js`)
- Abre `index.html` o `estudiantes.html` en tu navegador (puedes usar Live Server o similar)
- Haz clic en la burbuja verde "¿Tienes Dudas?" y prueba el chat

---

### 4. Despliegue en producción

- Sube el backend a tu servidor (puede ser Node.js en VPS, Docker, o serverless)
- Asegúrate de que el endpoint `/api/chat` sea accesible desde el frontend
- El widget funcionará automáticamente en las páginas indicadas

---

### 5. Personalización

- El color, texto y branding se pueden ajustar en la parte superior de `chat-widget.js`
- Si cambias la ruta del backend, ajusta la variable `API_URL` en el widget

---

## 🔧 Deploy y Configuración de Servidor

### 📍 Arquitectura de Deploy

**El sitio www.redjudicial.cl utiliza una configuración específica:**

- **GitHub Repository**: `redjudicial/sitioweb` (rama `main`)
- **Servidor**: AWS Lightsail (`23.22.241.121`)
- **Usuario SSH**: `bitnami` con key `~/.ssh/LightsailDefaultKey-us-east-1.pem`
- **CDN**: Cloudflare (cachea contenido estático)

### 🚀 GitHub Actions - Deploy Automático

El archivo `.github/workflows/deploy.yml` maneja el deploy automático:

1. **Deploy a staging**: `/home/bitnami/landing/` (para backend Node.js)
2. **Deploy a producción**: `/opt/bitnami/wordpress/` (directorio que sirve www.redjudicial.cl)

**¿Por qué dos directorios?**
- WordPress sirve el dominio principal desde `/opt/bitnami/wordpress/`
- El backend de Node.js/PM2 corre desde `/home/bitnami/landing/`

### 🎨 Sistema de CSS Separados

**Arquitectura de estilos independientes:**

- **`styles.css`** → Solo para `index.html` (landing principal para abogados)
- **`estudiantes.css`** → Solo para `estudiantes.html` (landing para estudiantes)

**Beneficios:**
- ✅ Evita conflictos entre páginas
- ✅ Optimización específica por audiencia
- ✅ Mantenimiento más fácil
- ✅ Carga más rápida (solo el CSS necesario)

---

## 🔐 CONFIGURACIÓN DE GITHUB ACTIONS - PROBLEMA RESUELTO

### ⚠️ PROBLEMA CRÍTICO: Token de GitHub Incorrecto

**Fecha del problema:** 24 de Julio 2025  
**Estado:** ✅ RESUELTO

#### 🔍 DIAGNÓSTICO DEL PROBLEMA:

El chat widget no aparecía en la posición correcta en `estudiantes.html` debido a un problema de autenticación en GitHub Actions.

**Síntomas:**
- ✅ GitHub Action se ejecutaba correctamente
- ✅ Archivos se subían a GitHub
- ❌ Archivos NO se copiaban al servidor
- ❌ CSS no se actualizaba en producción
- ❌ Chat widget aparecía en posición incorrecta

#### 🛠️ CAUSA RAÍZ:

**Token de GitHub incorrecto** - Se estaba usando el token de la cuenta **docemonos** en lugar del token de la cuenta **redjudicial**.

**Permisos comparados:**

**Token docemonos (INCORRECTO):**
```json
"permissions": {
  "admin": false,
  "maintain": false,
  "push": false,
  "triage": false,
  "pull": true
}
```

**Token redjudicial (CORRECTO):**
```json
"permissions": {
  "admin": true,
  "maintain": true,
  "push": true,
  "triage": true,
  "pull": true
}
```

#### ✅ SOLUCIÓN APLICADA:

1. **Identificar el token correcto:** Token de la cuenta propietaria del repositorio
2. **Actualizar `APIS_Y_CREDENCIALES.env`:**
   ```bash
   GITHUB_TOKEN=TU_TOKEN_DE_REDJUDICIAL_AQUI
   ```
3. **Verificar permisos de administrador**
4. **Forzar nuevo deployment con cache busting**

#### 🚨 PREVENCIÓN PARA EL FUTURO:

**Siempre verificar:**
1. **Token de GitHub:** Debe ser de la cuenta propietaria del repositorio
2. **Permisos:** Debe tener `admin: true` para acceder a secrets
3. **Secrets:** `DEPLOY_KEY` debe estar configurado correctamente
4. **Cache:** Usar parámetros de cache busting (`?v=X.X`) para forzar actualizaciones

#### 📋 COMANDOS DE VERIFICACIÓN:

```bash
# Verificar token de GitHub
curl -H "Authorization: token TU_TOKEN" "https://api.github.com/repos/redjudicial/sitioweb"

# Verificar permisos
curl -H "Authorization: token TU_TOKEN" "https://api.github.com/repos/redjudicial/sitioweb" | grep -o '"permissions":[^}]*'

# Verificar secrets
curl -H "Authorization: token TU_TOKEN" "https://api.github.com/repos/redjudicial/sitioweb/actions/secrets"

# Verificar deployment
curl -s "https://www.redjudicial.cl/estudiantes.css?v=X.X" | grep "VERSION"
```

#### 🎯 RESULTADO FINAL:

- ✅ **Chat widget funciona correctamente**
- ✅ **Aparece en posición correcta (esquina inferior derecha)**
- ✅ **GitHub Action funciona perfectamente**
- ✅ **Deployment automático funcionando**
- ✅ **CSS se actualiza correctamente**

**Lección aprendida:** El problema estaba en la autenticación de GitHub, no en el código.

**Reglas importantes:**
- Cambios en `styles.css` NO afectan `estudiantes.html`
- Cambios en `estudiantes.css` NO afectan `index.html`
- Cada página carga solo su CSS específico

### 🗂️ Estructura en Servidor

```bash
# WordPress (frontend público):
/opt/bitnami/wordpress/
├── index.html          # Landing principal (abogados)
├── estudiantes.html    # Landing para estudiantes
├── styles.css          # CSS para index.html
├── estudiantes.css     # CSS para estudiantes.html
├── script.js           # JavaScript del landing
└── chat-widget.js      # Widget de chat

# Node.js Backend (API):
/home/bitnami/landing/
├── server.js           # Servidor Express
├── package.json        # Dependencias
└── node_modules/       # Módulos de Node.js
```

### ⚠️ Problemas Comunes y Soluciones

#### 1. **Cambios CSS no se ven en www.redjudicial.cl**
**Problema**: Cloudflare cachea el CSS antiguo
**Solución**:
```bash
# Limpiar cache específico
curl -X POST "https://api.cloudflare.com/client/v4/zones/41a7ba1fa6bff0d03a8ee330f3142e1e/purge_cache" \
  -H "X-Auth-Email: nicolas.barriga@redjudicial.cl" \
  -H "X-Auth-Key: c2c39aca7709ff004afb6f7232d73d70ffbcc" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://www.redjudicial.cl/styles.css"]}'
```

#### 2. **Deploy automático no actualiza el frontend**
**Problema**: GitHub Actions desplegaba solo a `/home/bitnami/landing/`
**Solución**: ✅ **Ya corregido** - Ahora copia archivos a ambos directorios

#### 3. **Conflictos CSS entre reglas**
**Problema resuelto**: `.comparison-section` tenía reglas CSS conflictivas
**Solución aplicada**: Sistema de CSS separados
- `styles.css` → Solo para index.html  
- `estudiantes.css` → Solo para estudiantes.html

#### 4. **Cambios CSS no se ven en una página específica**
**Problema**: Modificar CSS incorrecto para la página objetivo
**Solución**: Verificar qué archivo CSS editar:
```bash
# Para index.html (abogados):
nano styles.css

# Para estudiantes.html:
nano estudiantes.css
```

#### 5. **GitHub Actions no actualiza archivos en producción**
**Problema**: Los archivos locales están actualizados pero el servidor muestra versión antigua
**Causa identificada**: 
- Paso problemático en `.github/workflows/deploy.yml` línea 35
- Directorio `/home/bitnami/landing/landing/` no existe
- Comandos con `|| true` ocultan errores de copia
**Síntomas**: 
- Título antiguo en el navegador
- Colores antiguos
- CSS no actualizado
**Solución aplicada**: ✅ **Arreglado en commit 6d41adb**
- Eliminado paso problemático de copia a subdirectorio inexistente
- Mejorado comando de copia con verificación explícita
- Agregado paso de verificación del deploy

**⚠️ PREVENCIÓN PARA QUE NO VUELVA A OCURRIR:**

1. **Nunca usar `|| true` en comandos críticos** - Oculta errores importantes
2. **Verificar que los directorios existen** antes de copiar archivos
3. **Siempre incluir pasos de verificación** en el deploy
4. **Monitorear los logs del GitHub Action** después de cada push
5. **Verificar timestamps de archivos** en servidor después del deploy

**🔍 MONITOREO POST-DEPLOY:**
```bash
# Verificar que archivos se actualizaron
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@23.22.241.121 "ls -la /opt/bitnami/wordpress/*.css /opt/bitnami/wordpress/*.html"

# Verificar que backend está corriendo
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@23.22.241.121 "pm2 status"

# Verificar que cambios se ven en el sitio
curl -s "https://www.redjudicial.cl/estudiantes.html" | grep -o "chat-widget.js[^\"']*"
```
**Solución de emergencia** (si vuelve a fallar):
```bash
# Copiar manualmente el archivo problemático
scp -i ~/.ssh/LightsailDefaultKey-us-east-1.pem estudiantes.html bitnami@23.22.241.121:/opt/bitnami/wordpress/

# Verificar que se copió correctamente
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@23.22.241.121 "head -5 /opt/bitnami/wordpress/estudiantes.html"
```

### 🔧 Comandos Útiles de Administración

```bash
# Conectar por SSH
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@23.22.241.121

# Verificar archivos en WordPress
ls -la /opt/bitnami/wordpress/*.css

# Verificar backend Node.js
pm2 status
pm2 logs redjudicial-backend

# Deploy manual (si GitHub Actions falla)
scp -i ~/.ssh/LightsailDefaultKey-us-east-1.pem *.html *.css *.js bitnami@23.22.241.121:/home/bitnami/landing/
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@23.22.241.121 "sudo cp /home/bitnami/landing/*.html /home/bitnami/landing/*.css /home/bitnami/landing/*.js /opt/bitnami/wordpress/"

# Purgar cache de Cloudflare (todo el sitio)
curl -X POST "https://api.cloudflare.com/client/v4/zones/41a7ba1fa6bff0d03a8ee330f3142e1e/purge_cache" \
  -H "X-Auth-Email: nicolas.barriga@redjudicial.cl" \
  -H "X-Auth-Key: c2c39aca7709ff004afb6f7232d73d70ffbcc" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

### 📋 Checklist de Deploy

Cuando haces cambios al landing:

1. ✅ **Commit y push** a rama `main`
2. ✅ **GitHub Actions** despliega automáticamente
3. ✅ **Verificar** que archivos llegaron a ambos directorios
4. ⚠️ **Si no se ven cambios**: Limpiar cache de Cloudflare
5. ✅ **Confirmar** en www.redjudicial.cl

### 🔍 Checklist de Verificación Post-Deploy (OBLIGATORIO)

**Después de cada `git push`, verificar:**

1. **✅ GitHub Action completó exitosamente**
   - Ir a GitHub → Actions → Verificar que el último deploy fue exitoso
   - Revisar logs si hay errores

2. **✅ Archivos actualizados en servidor**
   ```bash
   ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@23.22.241.121 "ls -la /opt/bitnami/wordpress/*.css /opt/bitnami/wordpress/*.html"
   ```
   - Verificar que timestamps son recientes (mismo día)

3. **✅ Backend funcionando**
   ```bash
   ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@23.22.241.121 "pm2 status"
   ```
   - Debe mostrar `redjudicial-backend` como `online`

4. **✅ Chat funcionando**
   ```bash
   curl -s "https://www.redjudicial.cl/api/chat" -X POST -H "Content-Type: application/json" -d '{"message":"test"}'
   ```
   - Debe devolver respuesta JSON válida

5. **✅ Cambios visibles en el sitio**
   - Abrir https://www.redjudicial.cl/estudiantes.html
   - Verificar que cambios se ven correctamente

**🚨 SI ALGUNO FALLA:**
- Revisar logs del GitHub Action
- Usar solución de emergencia manual
- Reportar problema inmediatamente

### ⚠️ SEÑALES DE ADVERTENCIA (PROBLEMA INMINENTE)

**Si ves estos síntomas, el GitHub Action está fallando:**

1. **🔄 GitHub Action se ejecuta pero archivos no se actualizan**
   - Timestamps de archivos en servidor son antiguos
   - Cambios no aparecen en el sitio

2. **📁 Directorios inexistentes en comandos**
   - Errores sobre `/home/bitnami/landing/landing/`
   - Comandos que fallan silenciosamente

3. **🤐 Comandos con `|| true` en logs**
   - Errores ocultos en el deploy
   - Deploy "exitoso" pero archivos no actualizados

4. **🔄 Backend no responde después del deploy**
   - Chat no funciona
   - API retorna errores

**🎯 ACCIÓN INMEDIATA:**
- Revisar `.github/workflows/deploy.yml` por comandos problemáticos
- Verificar que todos los directorios referenciados existen
- Eliminar `|| true` de comandos críticos
- Agregar pasos de verificación explícita

### 🆘 Contacto de Emergencia

Si algo falla en el deploy o el sitio está caído:
- **SSH**: Acceso directo al servidor con credenciales en `APIS_Y_CREDENCIALES.env`
- **Cloudflare**: Dashboard para gestionar DNS y cache
- **PM2**: Para reiniciar backend si es necesario

---

¿Dudas? Contacta a tu desarrollador o al equipo de Red Judicial. 