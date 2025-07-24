// chat-widget.js
(function () {
  // Configuración
  const WIDGET_COLOR = '#1a365d'; // Azul institucional
  const BUTTON_TEXT = '¿Tienes dudas? Chatea con Red Judicial';
  const API_URL = '/api/chat';

  // Crear burbuja
  const bubble = document.createElement('button');
  bubble.className = 'rj-chat-bubble';
  bubble.innerHTML = `
    <span class="rj-chat-icon"><i class="fas fa-robot"></i></span>
    <span class="rj-chat-badge" id="rj-chat-badge">Nuevo</span>
  `;
  bubble.title = BUTTON_TEXT;
  document.body.appendChild(bubble);

  // Crear modal (inicialmente oculto)
  let modal = null;
  let chatBody = null;
  let chatInput = null;
  let chatSend = null;
  let threadId = null;

  function openModal() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'rj-chat-modal';
    modal.innerHTML = `
      <button class="rj-chat-close" title="Cerrar">&times;</button>
      <div class="rj-chat-body"></div>
      <form class="rj-chat-footer">
        <input class="rj-chat-input" type="text" placeholder="Escribe tu pregunta..." autocomplete="off" required />
        <button class="rj-chat-send" type="submit">Enviar</button>
      </form>
    `;
    document.body.appendChild(modal);
    chatBody = modal.querySelector('.rj-chat-body');
    chatInput = modal.querySelector('.rj-chat-input');
    chatSend = modal.querySelector('.rj-chat-send');
    // Cerrar
    modal.querySelector('.rj-chat-close').onclick = closeModal;
    // Enviar mensaje
    modal.querySelector('.rj-chat-footer').onsubmit = sendMessage;
    chatInput.focus();
    // Mensaje inicial por defecto
    addMessage('Hola, ¿en qué te puedo ayudar?', 'assistant');
  }

  function closeModal() {
    if (modal) {
      modal.remove();
      modal = null;
      chatBody = null;
      chatInput = null;
      chatSend = null;
    }
  }

  bubble.onclick = openModal;

  // Lógica de chat
  async function sendMessage(e) {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if (!msg) return;
    addMessage(msg, 'user');
    chatInput.value = '';
    chatInput.disabled = true;
    chatSend.disabled = true;
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, threadId })
      });
      const data = await resp.json();
      if (data.reply) {
        addMessage(data.reply, 'assistant');
        threadId = data.threadId;
      } else {
        addMessage('Lo siento, hubo un error. Intenta de nuevo más tarde.', 'assistant');
      }
    } catch (err) {
      addMessage('Lo siento, hubo un error de conexión.', 'assistant');
    }
    chatInput.disabled = false;
    chatSend.disabled = false;
    chatInput.focus();
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addMessage(text, who) {
    if (!chatBody) return;
    const msg = document.createElement('div');
    msg.className = 'rj-chat-msg ' + who;
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Lógica para mostrar el badge solo si hay mensajes no leídos
  function setChatBadge(visible) {
    const badge = document.getElementById('rj-chat-badge');
    if (badge) badge.style.display = visible ? 'block' : 'none';
  }
  // Por defecto oculto, pero puedes llamar setChatBadge(true) cuando detectes mensajes no leídos
  setChatBadge(false);
})(); 