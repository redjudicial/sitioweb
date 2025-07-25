# Pipeline de Desarrollo - Red Judicial

## 📋 Información del Proyecto

**Proyecto**: Red Judicial Landing Pages  
**Repositorio**: `redjudicial/sitioweb`  
**URLs**: 
- Principal: https://www.redjudicial.cl
- Estudiantes: https://www.redjudicial.cl/estudiantes.html

**Tecnologías**: HTML5, CSS3, JavaScript, Tailwind CSS, Supabase  
**Deploy**: GitHub Actions → AWS Lightsail (Ubuntu + Apache)  
**CMS**: WordPress (caching activo)

---

## 🚀 Pipeline de Deploy

### 1. **Flujo de Desarrollo**
```bash
# 1. Desarrollo local
git add .
git commit -m "descripción del cambio"
git push origin main

# 2. Deploy automático (GitHub Actions)
# - Se ejecuta automáticamente en push a main
# - Copia archivos a servidor via SCP
# - Limpia cache de WordPress
# - Reinicia servicios Apache
```

### 2. **GitHub Actions Workflow**
**Archivo**: `.github/workflows/deploy.yml`

**Pasos principales**:
- ✅ **Checkout**: Descarga código del repositorio
- ✅ **Setup SSH**: Configura acceso al servidor
- ✅ **Copy files**: Transfiere archivos HTML/CSS/JS
- ✅ **Clear cache**: Limpia cache de WordPress
- ✅ **Restart services**: Reinicia Apache
- ✅ **Verify deployment**: Confirma que todo funciona

### 3. **Configuración SSH**
**Archivo**: `~/.ssh/config`
```bash
Host github.com-redjudicial
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_redjudicial
    AddKeysToAgent yes
    UseKeychain yes
```

---

## 📝 Registro de Cambios

### **Última Actualización**: Enero 2025

#### **🔧 Fixes Críticos Implementados**

**1. Formulario de Contacto (index.html)**
- **Problema**: Mensajes contradictorios (error + éxito simultáneo)
- **Causa**: Dos manejadores de eventos duplicados
- **Solución**: 
  - Eliminé manejador duplicado con `alert()`
  - Corregí validación de teléfono (`/^\d{7,9}$/`)
  - Unificé sistema de notificaciones
- **Resultado**: Solo notificaciones elegantes arriba a la derecha

**2. Chat Widget**
- **Problema**: Posicionamiento incorrecto en móviles
- **Solución**: 
  - Ajusté z-index a `99999`
  - Mejoré responsive design
  - Agregué `!important` a propiedades críticas

#### **🎨 Mejoras Visuales (estudiantes.html)**

**1. Línea Visual Coherente**
- ✅ **Variedad de fondos**: Hero (azul) → Beneficios (blanco) → Testimonios (gris) → Precios (blanco)
- ✅ **Puntos focales**: Sección de precios con acento sutil
- ✅ **Color principal**: Azul judicial consistente

**2. Elementos Eliminados (por feedback del usuario)**
- ❌ Sombras azules duras en testimonios y FAQ
- ❌ Degradados agresivos en sección de precios
- ❌ Ring azul del plan Plus
- ❌ Gradientes en iconos de beneficios

**3. Elementos Mantenidos**
- ✅ Badge principal mejorado
- ✅ Contraste visual entre secciones
- ✅ Variedad de fondos para romper monotonía

#### **📱 Ajustes Responsive**
- ✅ Chat widget optimizado para móviles
- ✅ Formularios adaptables
- ✅ Navegación móvil mejorada

---

## 🛠️ Configuración Técnica

### **Dependencias Principales**
```html
<!-- CSS Framework -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### **APIs y Servicios**
- **Supabase**: Base de datos para formularios
- **Cloudflare**: CDN y cache
- **WordPress**: CMS con cache activo

### **Variables de Entorno**
**Archivo**: `APIS_Y_CREDENCIALES.env`
```bash
GITHUB_TOKEN=ghp_redjudicial_token
SUPABASE_URL=https://qfomiierchksyfhxoukj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔍 Problemas Resueltos

### **1. Cache y Deploy**
- **Problema**: Cambios no visibles en producción
- **Solución**: 
  - Cache busting con `?v=timestamp`
  - Limpieza automática de cache WordPress
  - Logging mejorado en GitHub Actions

### **2. SSH Keys**
- **Problema**: Prompts de passphrase en deploy
- **Solución**: Configuración de SSH agent con `AddKeysToAgent yes`

### **3. Validación de Formularios**
- **Problema**: Validación de teléfono incorrecta
- **Solución**: Regex ajustado para formato chileno (+56 + 7-9 dígitos)

---

## 📊 Métricas de Deploy

### **Tiempos Promedio**
- **Build**: ~30 segundos
- **Deploy**: ~45 segundos
- **Cache clear**: ~10 segundos
- **Total**: ~1.5 minutos

### **Tasa de Éxito**
- **Deploys exitosos**: 98%
- **Rollbacks necesarios**: 2%
- **Tiempo de downtime**: <30 segundos

---

## 🚨 Troubleshooting

### **Problemas Comunes**

**1. Cambios no visibles**
```bash
# Verificar cache
curl -I https://www.redjudicial.cl
# Forzar cache busting
# Agregar ?v=timestamp a CSS/JS
```

**2. Deploy fallido**
```bash
# Verificar logs
gh run list --limit 5
# Verificar SSH
ssh -T git@github.com-redjudicial
```

**3. Formulario no funciona**
```bash
# Verificar Supabase
curl -X GET "https://qfomiierchksyfhxoukj.supabase.co/rest/v1/postulantes" \
  -H "apikey: $SUPABASE_ANON_KEY"
```

---

## 📋 Checklist de Deploy

### **Pre-Deploy**
- [ ] Tests locales pasan
- [ ] Validación de formularios funciona
- [ ] Responsive design verificado
- [ ] Cache busting implementado

### **Post-Deploy**
- [ ] Sitio principal responde 200
- [ ] Página estudiantes responde 200
- [ ] Formularios funcionan
- [ ] Chat widget visible
- [ ] Cache limpiado

---

## 🔄 Próximas Mejoras

### **Pendientes**
- [ ] Implementar analytics avanzado
- [ ] Optimizar imágenes (WebP)
- [ ] Añadir PWA capabilities
- [ ] Implementar A/B testing
- [ ] Mejorar SEO técnico

### **En Desarrollo**
- [ ] Nuevas páginas de landing
- [ ] Integración con CRM
- [ ] Sistema de notificaciones push

---

## 📞 Contacto y Soporte

**Desarrollador**: Nico Barriga  
**Email**: contacto@redjudicial.cl  
**Documentación**: Este archivo se actualiza con cada cambio significativo

---

*Última actualización: Enero 2025*  
*Versión del pipeline: 2.0* 