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

¿Dudas? Contacta a tu desarrollador o al equipo de Red Judicial. 