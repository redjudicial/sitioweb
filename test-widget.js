// test-widget.js - Script de prueba simple
console.log('🧪 Script de prueba iniciando...');

// Crear un elemento de prueba muy simple
const testElement = document.createElement('div');
testElement.innerHTML = '🧪 TEST WIDGET FUNCIONA';
testElement.style.cssText = `
  position: fixed !important;
  top: 20px !important;
  right: 20px !important;
  background: red !important;
  color: white !important;
  padding: 10px !important;
  z-index: 999999 !important;
  font-size: 16px !important;
  border-radius: 5px !important;
`;

document.body.appendChild(testElement);
console.log('✅ Elemento de prueba agregado al DOM'); 