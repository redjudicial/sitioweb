// chat-widget.js
(function () {
  // Configuración
  const WIDGET_COLOR = '#25D366'; // Verde WhatsApp
  const BUTTON_TEXT = '¿Tienes Dudas?';
  const API_URL = '/api/chat';

  // Crear estilos
  const style = document.createElement('style');
  style.innerHTML = `
    .rj-chat-bubble {
      position: fixed;
      right: 32px;
      bottom: 32px;
      z-index: 9999;
      background: ${WIDGET_COLOR};
      color: #fff;
      border-radius: 50px;
      box-shadow: 0 4px 16px rgba(44,62,80,0.13);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      width: 56px;
      height: 56px;
      font-size: 1.15rem;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: box-shadow 0.2s, background 0.2s;
    }
    .rj-chat-bubble:hover {
      box-shadow: 0 8px 32px rgba(44,62,80,0.18);
      background: #20ba5a;
    }
    .rj-chat-bubble .rj-chat-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1.3rem;
      /* Eliminar margin-right */
      margin: 0;
    }
    .rj-chat-modal {
      position: fixed;
      right: 24px;
      bottom: 100px;
      width: 350px;
      max-width: 95vw;
      height: 480px;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 8px 32px rgba(44,62,80,0.18);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Inter', Arial, sans-serif;
      animation: rj-fade-in 0.25s;
    }
    @keyframes rj-fade-in {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: none; }
    }
    .rj-chat-header {
      background: ${WIDGET_COLOR};
      color: #fff;
      padding: 18px 18px 12px 18px;
      font-size: 1.15rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .rj-chat-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.3rem;
      cursor: pointer;
      margin-left: 8px;
      transition: color 0.2s;
    }
    .rj-chat-close:hover {
      color: #23272f;
    }
    .rj-chat-body {
      flex: 1;
      background: #f7f8fa;
      padding: 18px 12px 12px 12px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .rj-chat-msg {
      max-width: 85%;
      padding: 10px 16px;
      border-radius: 16px;
      font-size: 1.02rem;
      line-height: 1.5;
      word-break: break-word;
      box-shadow: 0 2px 8px rgba(44,62,80,0.06);
      margin-bottom: 2px;
    }
    .rj-chat-msg.user {
      align-self: flex-end;
      background: #e2fbe6;
      color: #23272f;
      border-bottom-right-radius: 4px;
    }
    .rj-chat-msg.assistant {
      align-self: flex-start;
      background: #fff;
      color: #23272f;
      border-bottom-left-radius: 4px;
    }
    .rj-chat-footer {
      padding: 12px 14px 14px 14px;
      background: #fff;
      display: flex;
      gap: 8px;
      border-top: 1px solid #e5e7eb;
    }
    .rj-chat-input {
      flex: 1;
      border: 1.5px solid #e5e7eb;
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 1rem;
      outline: none;
      transition: border 0.2s;
    }
    .rj-chat-input:focus {
      border-color: ${WIDGET_COLOR};
    }
    .rj-chat-send {
      background: ${WIDGET_COLOR};
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 0 18px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }
    .rj-chat-send:disabled {
      background: #b2e9c7;
      cursor: not-allowed;
    }
    @media (max-width: 500px) {
      .rj-chat-modal {
        right: 2vw;
        width: 98vw;
        height: 80vh;
        min-width: 0;
      }
      .rj-chat-bubble {
        right: 2vw;
        bottom: 2vw;
        font-size: 1rem;
        height: 48px;
        padding: 0 14px 0 10px;
      }
    }
  `;
  document.head.appendChild(style);

  // Crear burbuja
  const bubble = document.createElement('button');
  bubble.className = 'rj-chat-bubble';
  bubble.innerHTML = `
    <span class="rj-chat-icon">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="14" y="20" text-anchor="middle" font-size="20" fill="#fff" font-family="Arial, sans-serif" font-weight="bold">?</text>
      </svg>
    </span>
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
      <div class="rj-chat-header">
        Asistente Red Judicial
        <button class="rj-chat-close" title="Cerrar">&times;</button>
      </div>
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
})(); 