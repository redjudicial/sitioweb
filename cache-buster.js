// Cache Buster - Genera versiones automáticas para romper caché
const fs = require('fs');
const path = require('path');

// Función para generar timestamp
function generateVersion() {
  return Date.now().toString(36);
}

// Función para actualizar referencias en HTML
function updateHTMLFile(filePath, version) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Actualizar CSS
  content = content.replace(
    /href="([^"]*\.css)(\?v=\d+)?"/g,
    `href="$1?v=${version}"`
  );
  
  // Actualizar JS
  content = content.replace(
    /src="([^"]*\.js)(\?v=\d+)?"/g,
    `src="$1?v=${version}"`
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ ${filePath} actualizado con versión ${version}`);
}

// Función principal
function updateCacheBusters() {
  const version = generateVersion();
  
  // Archivos HTML a actualizar
  const htmlFiles = ['index.html', 'estudiantes.html'];
  
  htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
      updateHTMLFile(file, version);
    }
  });
  
  console.log(`\n🚀 Cache busting completado con versión: ${version}`);
  console.log('📝 Recuerda hacer commit y push para aplicar cambios');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateCacheBusters();
}

module.exports = { updateCacheBusters, generateVersion }; 