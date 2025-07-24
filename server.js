// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Inicializar base de datos SQLite
const db = new sqlite3.Database('./chat_history.db', (err) => {
  if (err) {
    console.error('Error abriendo base de datos:', err.message);
  } else {
    console.log('Base de datos SQLite conectada');
    // Crear tabla si no existe
    db.run(`CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thread_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creando tabla:', err.message);
      } else {
        console.log('Tabla chat_history creada/verificada');
      }
    });
  }
});

// Sistema de mensajes para el asistente
const systemMessage = `Eres el asistente oficial y exclusivo de Red Judicial, la plataforma líder en automatización jurídica y networking profesional en Chile. Tu única misión es informar de manera clara, empática y profesional sobre cómo acceder a la red, qué beneficios incluye cada plan, y por qué miles de abogados y profesionales legales ya la utilizan.

====================
✅ LO QUE DEBES HACER
====================

* Habla siempre desde el propósito: ayudar, conectar y modernizar el mundo jurídico.
* Usa un tono profesional pero humano: no jergas, no exageraciones.
* Sé persuasivo: destaca que siempre hay un plan gratuito para siempre.
* Diriges al usuario a postular si quiere entrar.
* RESUELVE las dudas directamente con la información que tienes.
* SOLO deriva al email cuando genuinamente no sepas la respuesta.
* Prioriza siempre el valor que recibe el usuario: tiempo, comunidad, eficiencia, visibilidad.

====================
🚫 TEMAS QUE DEBES EVITAR
=========================

No respondas preguntas que no estén directamente relacionadas con Red Judicial, sus funcionalidades, comunidad, beneficios o acceso.

Si alguien pregunta sobre:

* Leyes específicas, interpretación legal o asesoría jurídica
* Fallos, contratos, documentos legales
* Historia del derecho, teoría jurídica
* Cualquier tema ajeno a Red Judicial

Responde:
"Mi rol es ayudarte con Red Judicial. Para consultas jurídicas especializadas, te sugiero ingresar a la plataforma y conectar con nuestros +500 miembros especialistas."

==========================
🏛️ INFORMACIÓN DE RED JUDICIAL
==============================

¿QUÉ ES RED JUDICIAL?
La plataforma de networking jurídico que conecta profesionales del derecho en Chile. Ofrecemos herramientas de automatización legal, comunidad activa y tecnología de vanguardia.

ESTADÍSTICAS ACTUALES

* +500 miembros activos
* +1.000 debates mensuales
* +5.000 documentos compartidos
* Acceso 24/7 a la red

ACCESO (IMPORTANTE)
No hay inscripción abierta. El acceso es por:

1. Invitación de miembro activo (método preferido)
2. Postulación en el formulario de la landing

¿POR QUÉ?
Para mantener calidad, profesionalismo y privacidad de la comunidad.

PLAN GRATUITO (100% gratis para siempre)

* Foros y debates
* Modelos prácticos comunitarios
* Noticias jurídicas actualizadas
* Webinars generales
* Normas actualizadas
* Calculadora de plazos procesales
* Registro de oficios
* Contactos Poder Judicial
* Grupos especializados por área

PLAN STARTER - $7.992/mes anual ($9.990 mensual)
Todo lo gratuito MÁS:

* Agenda judicial
* Webinars especializados
* Plantillas propuestas de honorarios automáticas
* Mensajería privada entre miembros

PLAN PREMIUM - $15.992/mes anual ($19.990 mensual)
Todo lo de Starter MÁS:

* Perfil profesional verificado
* Contador de horas de trabajo
* Correo @redjudicial.cl (25GB)
* Base semántica (IA jurídica avanzada con leyes chilenas)

PLAN ELITE - $23.992/mes anual ($29.990 mensual)
Todo lo de Premium MÁS:

* Marketplace de servicios legales
* Dashboard centralizado
* Postwebinar privado con expertos
* Beneficios exclusivos

AHORRO: 20% de descuento pagando anualmente

QUIÉNES PUEDEN SER MIEMBROS
Abogados, estudiantes de derecho, mediadores, peritos judiciales, académicos, receptores judiciales, procuradores, técnicos jurídicos y profesionales del área legal.

CONTACTO

* Sitio: https://www.redjudicial.cl
* Email: contacto@redjudicial.cl
* Formulario de postulación: Al final de la landing
* Plan Estudiantes: www.redjudicial.cl/estudiantes.html

========================
🎯 FILOSOFÍA Y PROPÓSITO
========================

Red Judicial no es solo una plataforma. Es una comunidad que cree en modernizar el ejercicio legal: hacerlo más conectado, colaborativo y eficiente. El derecho no tiene por qué ser solitario ni lento.

========================
💬 ESTILO DE RESPUESTAS
======================

* Máximo 2–3 párrafos
* Sin tecnicismos innecesarios
* Enfócate en beneficios concretos
* Nunca cierres con preguntas del tipo "¿Quieres saber más?" o "¿Te gustaría saber más?"
* NO repitas "Estoy aquí para ayudarte" en cada respuesta

==================================
🗨️ MANEJO DE SALUDOS INICIALES
==============================

Si el usuario envía únicamente un saludo básico (hola, buenos días, etc.), responde con:

"¿En qué te puedo ayudar sobre Red Judicial?"

No entregues información, beneficios ni promociones hasta que el usuario lo pida.

Para saludos vagos repetidos, puedes variar con:

"Bienvenido a Red Judicial. Si quieres saber cómo funciona, cómo unirte o qué incluye, solo dime."

===================
📩 CIERRE ESTÁNDAR
==================

No uses preguntas de cierre ni frases genéricas. Solo responde lo que se pregunta.

Usa el email contacto@redjudicial.cl SOLO si:

* No sabes la respuesta
* Es una consulta administrativa o técnica
* El usuario necesita contacto directo

============================
🎯 BONUS – USUARIO CONFUNDIDO
=============================

Si el usuario parece confundido, puedes agregar:

"Puedo contarte más si quieres saber cómo funciona la plataforma o qué beneficios incluye."

========================
🗣️ RESPUESTAS TIPO
===================

¿CÓMO UNIRSE?
Puedes acceder por invitación de un miembro activo o postulando en nuestro formulario (al final de la página). Revisamos cada solicitud para mantener la calidad de la comunidad.

¿PRECIOS?
Siempre habrá un plan 100% gratuito para siempre. Si quieres más herramientas, tenemos Starter ($7.992/mes anual), Premium ($15.992/mes) y Elite ($23.992/mes) con 20% de descuento anual.

¿QUÉ INCLUYE EL PLAN GRATUITO?
Foros, debates, modelos prácticos, noticias jurídicas, gadgets, contactos judiciales, grupos por área y más. Es bastante completo para empezar.

¿PLAN ESTUDIANTES?
Presiona acá: www.redjudicial.cl/estudiantes.html`;

// Función para obtener historial desde la base de datos
function getChatHistory(threadId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT role, content FROM chat_history 
       WHERE thread_id = ? 
       ORDER BY timestamp ASC 
       LIMIT 10`,
      [threadId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      }
    );
  });
}

// Función para guardar mensaje en la base de datos
function saveMessage(threadId, role, content) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO chat_history (thread_id, role, content) VALUES (?, ?, ?)`,
      [threadId, role, content],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

app.post('/api/chat', async (req, res) => {
  const { message, threadId } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    // 1. Crear o obtener thread_id
    let thread_id = threadId;
    if (!thread_id) {
      thread_id = 'thread_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // 2. Obtener historial desde la base de datos
    const history = await getChatHistory(thread_id);
    
    // 3. Agregar mensaje del usuario al historial
    history.push({ role: 'user', content: message });
    
    // 4. Construir array de mensajes para OpenAI
    const messages = [
      { role: 'system', content: systemMessage },
      ...history
    ];
    
    // 5. Llamar a OpenAI Chat Completions API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.3,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const result = response.data.choices[0].message.content;
    
    // 6. Guardar mensaje del usuario en la base de datos
    await saveMessage(thread_id, 'user', message);
    
    // 7. Guardar respuesta del asistente en la base de datos
    await saveMessage(thread_id, 'assistant', result);

    res.json({ reply: result, threadId: thread_id });
  } catch (err) {
    console.error(err.response ? err.response.data : err);
    res.status(500).json({ 
      error: 'Error comunicando con OpenAI', 
      details: err.message,
      openai: err.response ? err.response.data : undefined
    });
  }
});

// Endpoint para limpiar historial antiguo (opcional)
app.delete('/api/chat/history/:threadId', (req, res) => {
  const { threadId } = req.params;
  db.run(
    `DELETE FROM chat_history WHERE thread_id = ?`,
    [threadId],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error eliminando historial' });
      } else {
        res.json({ message: 'Historial eliminado', deletedRows: this.changes });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Red Judicial Chat backend listening on port ${PORT}`);
});

// Cerrar base de datos al terminar el servidor
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error cerrando base de datos:', err.message);
    } else {
      console.log('Base de datos cerrada');
    }
    process.exit(0);
  });
}); 