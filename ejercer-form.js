// ejercer-form.js
class EjercerForm {
  constructor() {
    this.form = null;
    this.init();
  }

  init() {
    this.createForm();
    this.bindEvents();
  }

  createForm() {
    const modal = document.createElement('div');
    modal.className = 'ejercer-modal';
    modal.id = 'ejercerModal';
    modal.innerHTML = `
      <div class="ejercer-modal-content">
        <div class="ejercer-modal-header">
          <h2>Actualiza tu Perfil para Ejercer</h2>
          <button class="ejercer-close" onclick="this.closest('.ejercer-modal').remove()">&times;</button>
        </div>
        
        <form id="ejercerForm" class="ejercer-form">
          <div class="form-section">
            <h3>Información Personal</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="nombre">Nombre Completo *</label>
                <input type="text" id="nombre" name="nombre" required>
              </div>
              <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" required>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono">
              </div>
              <div class="form-group">
                <label for="universidad">Universidad *</label>
                <select id="universidad" name="universidad" required>
                  <option value="">Selecciona tu universidad</option>
                  <option value="Universidad de Chile">Universidad de Chile</option>
                  <option value="Pontificia Universidad Católica">Pontificia Universidad Católica</option>
                  <option value="Universidad Diego Portales">Universidad Diego Portales</option>
                  <option value="Universidad del Desarrollo">Universidad del Desarrollo</option>
                  <option value="Universidad de Concepción">Universidad de Concepción</option>
                  <option value="Universidad de Valparaíso">Universidad de Valparaíso</option>
                  <option value="Universidad Austral">Universidad Austral</option>
                  <option value="Universidad de Los Andes">Universidad de Los Andes</option>
                  <option value="Universidad Adolfo Ibáñez">Universidad Adolfo Ibáñez</option>
                  <option value="Universidad de Talca">Universidad de Talca</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h3>Ubicación</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="region">Región *</label>
                <select id="region" name="region" required onchange="this.form.comuna.innerHTML='<option value=\'\'>Selecciona primero la región</option>'">
                  <option value="">Selecciona tu región</option>
                  <option value="Arica y Parinacota">Arica y Parinacota</option>
                  <option value="Tarapacá">Tarapacá</option>
                  <option value="Antofagasta">Antofagasta</option>
                  <option value="Atacama">Atacama</option>
                  <option value="Coquimbo">Coquimbo</option>
                  <option value="Valparaíso">Valparaíso</option>
                  <option value="Región Metropolitana">Región Metropolitana</option>
                  <option value="O'Higgins">O'Higgins</option>
                  <option value="Maule">Maule</option>
                  <option value="Ñuble">Ñuble</option>
                  <option value="Biobío">Biobío</option>
                  <option value="La Araucanía">La Araucanía</option>
                  <option value="Los Ríos">Los Ríos</option>
                  <option value="Los Lagos">Los Lagos</option>
                  <option value="Aysén">Aysén</option>
                  <option value="Magallanes">Magallanes</option>
                </select>
              </div>
              <div class="form-group">
                <label for="comuna">Comuna *</label>
                <select id="comuna" name="comuna" required>
                  <option value="">Selecciona primero la región</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h3>Especialización</h3>
            
            <div class="form-group">
              <label for="areas_interes">Áreas de Interés *</label>
              <div class="checkbox-group">
                <label><input type="checkbox" name="areas_interes" value="Derecho Civil"> Derecho Civil</label>
                <label><input type="checkbox" name="areas_interes" value="Derecho Penal"> Derecho Penal</label>
                <label><input type="checkbox" name="areas_interes" value="Derecho Laboral"> Derecho Laboral</label>
                <label><input type="checkbox" name="areas_interes" value="Derecho Comercial"> Derecho Comercial</label>
                <label><input type="checkbox" name="areas_interes" value="Derecho de Familia"> Derecho de Familia</label>
                <label><input type="checkbox" name="areas_interes" value="Derecho Administrativo"> Derecho Administrativo</label>
                <label><input type="checkbox" name="areas_interes" value="Derecho Tributario"> Derecho Tributario</label>
                <label><input type="checkbox" name="areas_interes" value="Derecho Procesal"> Derecho Procesal</label>
                <label><input type="checkbox" name="areas_interes" value="Derecho Internacional"> Derecho Internacional</label>
                <label><input type="checkbox" name="areas_interes" value="Derecho Constitucional"> Derecho Constitucional</label>
              </div>
            </div>
            
            <div class="form-group">
              <label for="experiencia">Experiencia</label>
              <textarea id="experiencia" name="experiencia" placeholder="Describe tu experiencia laboral, prácticas, proyectos relevantes..."></textarea>
            </div>
            
            <div class="form-group">
              <label for="habilidades">Habilidades Específicas</label>
              <textarea id="habilidades" name="habilidades" placeholder="Redacción de escritos, investigación jurídica, mediación, etc..."></textarea>
            </div>
          </div>
          
          <div class="form-section">
            <h3>Disponibilidad y Tarifas</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="disponibilidad">Disponibilidad</label>
                <select id="disponibilidad" name="disponibilidad">
                  <option value="">Selecciona tu disponibilidad</option>
                  <option value="Tiempo completo">Tiempo completo</option>
                  <option value="Medio tiempo">Medio tiempo</option>
                  <option value="Por proyecto">Por proyecto</option>
                  <option value="Fines de semana">Fines de semana</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div class="form-group">
                <label for="tarifa_hora">Tarifa por Hora (CLP)</label>
                <input type="number" id="tarifa_hora" name="tarifa_hora" placeholder="15000" min="0">
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="this.closest('.ejercer-modal').remove()">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar Perfil</button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.form = document.getElementById('ejercerForm');
  }

  bindEvents() {
    // Cargar comunas según región
    document.getElementById('region').addEventListener('change', (e) => {
      this.loadComunas(e.target.value);
    });

    // Validar checkboxes de áreas de interés
    const checkboxes = document.querySelectorAll('input[name="areas_interes"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        this.validateAreasInteres();
      });
    });

    // Enviar formulario
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitForm();
    });
  }

  loadComunas(region) {
    const comunas = {
      'Región Metropolitana': [
        'Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú', 'Puente Alto', 
        'La Florida', 'San Miguel', 'La Cisterna', 'El Bosque', 'La Granja', 'La Pintana',
        'San Ramón', 'Lo Espejo', 'Pedro Aguirre Cerda', 'Lo Prado', 'Estación Central',
        'Cerrillos', 'Independencia', 'Recoleta', 'Huechuraba', 'Conchalí', 'Renca',
        'Quilicura', 'Colina', 'Lampa', 'Tiltil', 'San José de Maipo', 'Pirque',
        'Puente Alto', 'San Bernardo', 'Buin', 'Paine', 'Calera de Tango', 'Isla de Maipo',
        'Talagante', 'El Monte', 'Padre Hurtado', 'Peñaflor', 'Melipilla', 'Alhué',
        'Curacaví', 'María Pinto', 'San Pedro', 'Santo Domingo'
      ],
      'Valparaíso': [
        'Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Limache', 'Olmué',
        'Quillota', 'La Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Antonio',
        'Cartagena', 'El Tabo', 'El Quisco', 'Algarrobo', 'Santo Domingo', 'San Felipe',
        'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Quintero',
        'Puchuncaví', 'Zapallar', 'Papudo', 'Petorca', 'La Ligua', 'Cabildo',
        'Los Andes', 'San Esteban', 'Calle Larga', 'Rinconada', 'San Vicente',
        'Santa Ana', 'Casablanca', 'Concón', 'Juan Fernández', 'Isla de Pascua'
      ],
      'Biobío': [
        'Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles', 'Coronel', 'San Pedro de la Paz',
        'Chiguayante', 'Hualpén', 'Lota', 'Penco', 'Tomé', 'Florida', 'Hualqui',
        'Santa Juana', 'Bulnes', 'Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo',
        'Quirihue', 'Ránquil', 'Treguaco', 'San Nicolás', 'San Carlos', 'San Fabián',
        'Ñiquén', 'San Ignacio', 'Yungay', 'Pemuco', 'Pinto', 'El Carmen',
        'Yumbel', 'Cabrero', 'Tucapel', 'Antuco', 'Santa Bárbara', 'Quilaco',
        'Mulchén', 'Negrete', 'Nacimiento', 'San Rosendo', 'Laja', 'Los Ángeles'
      ]
    };

    const comunaSelect = document.getElementById('comuna');
    comunaSelect.innerHTML = '<option value="">Selecciona tu comuna</option>';
    
    if (comunas[region]) {
      comunas[region].forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna;
        option.textContent = comuna;
        comunaSelect.appendChild(option);
      });
    }
  }

  validateAreasInteres() {
    const checkboxes = document.querySelectorAll('input[name="areas_interes"]:checked');
    if (checkboxes.length === 0) {
      // Mostrar error
      return false;
    }
    return true;
  }

  async submitForm() {
    // Validar áreas de interés
    if (!this.validateAreasInteres()) {
      alert('Debes seleccionar al menos un área de interés');
      return;
    }

    const formData = new FormData(this.form);
    const data = {
      user_id: this.generateUserId(),
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      telefono: formData.get('telefono'),
      universidad: formData.get('universidad'),
      region: formData.get('region'),
      comuna: formData.get('comuna'),
      areas_interes: Array.from(formData.getAll('areas_interes')).join(', '),
      experiencia: formData.get('experiencia'),
      habilidades: formData.get('habilidades'),
      disponibilidad: formData.get('disponibilidad'),
      tarifa_hora: formData.get('tarifa_hora') || null
    };

    try {
      const response = await fetch('/api/ejercer/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        alert('¡Perfil actualizado exitosamente! Los abogados podrán contactarte.');
        document.getElementById('ejercerModal').remove();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el perfil. Intenta de nuevo.');
    }
  }

  generateUserId() {
    // Generar un ID único para el usuario
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  // Agregar estilos CSS
  const styles = `
    .ejercer-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    }

    .ejercer-modal-content {
      background: white;
      border-radius: 20px;
      max-width: 800px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .ejercer-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px;
      border-bottom: 1px solid #e5e7eb;
    }

    .ejercer-modal-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a365d;
      margin: 0;
    }

    .ejercer-close {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;
    }

    .ejercer-close:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .ejercer-form {
      padding: 32px;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a365d;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      transition: border 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #1a365d;
      box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 80px;
    }

    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-top: 8px;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 400;
      cursor: pointer;
    }

    .checkbox-group input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .btn-primary,
    .btn-secondary {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-primary {
      background: #1a365d;
      color: white;
    }

    .btn-primary:hover {
      background: #2d5a87;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    @media (max-width: 768px) {
      .ejercer-modal-content {
        width: 95%;
        max-height: 95vh;
      }

      .ejercer-form {
        padding: 24px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .checkbox-group {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Agregar evento al botón "Actualizar mi Perfil"
  const updateProfileBtn = document.querySelector('button[onclick*="Actualizar mi Perfil"]');
  if (updateProfileBtn) {
    updateProfileBtn.onclick = () => {
      new EjercerForm();
    };
  }
});

// Función global para abrir el formulario
function openEjercerForm() {
  new EjercerForm();
} 