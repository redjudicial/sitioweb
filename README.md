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

### 🗂️ Estructura en Servidor

```bash
# WordPress (frontend público):
/opt/bitnami/wordpress/
├── index.html          # Landing principal
├── styles.css          # Estilos CSS
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
**Solución aplicada**:
```css
.comparison-section {
    margin-top: 6rem;                    /* Separación superior */
    padding-top: 2rem;                   /* Padding interno */
    border-top: 1px solid #e2e8f0;      /* Línea separadora */
}
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

### 🆘 Contacto de Emergencia

Si algo falla en el deploy o el sitio está caído:
- **SSH**: Acceso directo al servidor con credenciales en `APIS_Y_CREDENCIALES.env`
- **Cloudflare**: Dashboard para gestionar DNS y cache
- **PM2**: Para reiniciar backend si es necesario

---

¿Dudas? Contacta a tu desarrollador o al equipo de Red Judicial. 