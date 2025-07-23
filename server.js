// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = 'asst_hp3ezGzjsJI3liyho91nki6B';

// Header requerido por OpenAI Assistants v2
const openaiHeaders = {
  Authorization: `Bearer ${OPENAI_API_KEY}`,
  'OpenAI-Beta': 'assistants=v2'
};

app.post('/api/chat', async (req, res) => {
  const { message, threadId } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    // 1. Crear un thread si no existe
    let thread_id = threadId;
    if (!thread_id) {
      const threadResp = await axios.post(
        'https://api.openai.com/v1/threads',
        {},
        { headers: openaiHeaders }
      );
      thread_id = threadResp.data.id;
    }

    // 2. Añadir mensaje al thread
    await axios.post(
      `https://api.openai.com/v1/threads/${thread_id}/messages`,
      { role: 'user', content: message },
      { headers: openaiHeaders }
    );

    // 3. Lanzar run con el asistente
    const runResp = await axios.post(
      `https://api.openai.com/v1/threads/${thread_id}/runs`,
      { assistant_id: ASSISTANT_ID },
      { headers: openaiHeaders }
    );
    const run_id = runResp.data.id;

    // 4. Polling hasta que el run termine
    let status = 'queued';
    let result;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const runStatus = await axios.get(
        `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`,
        { headers: openaiHeaders }
      );
      status = runStatus.data.status;
      if (status === 'completed') {
        // 5. Obtener mensajes
        const messagesResp = await axios.get(
          `https://api.openai.com/v1/threads/${thread_id}/messages`,
          { headers: openaiHeaders }
        );
        const messages = messagesResp.data.data;
        const lastMessage = messages.reverse().find(m => m.role === 'assistant');
        result = lastMessage ? lastMessage.content[0].text.value : '';
        break;
      } else if (status === 'failed' || status === 'cancelled' || status === 'expired') {
        return res.status(500).json({ error: 'OpenAI run failed', status });
      }
    }
    if (!result) {
      return res.status(504).json({ error: 'Timeout waiting for OpenAI response' });
    }
    res.json({ reply: result, threadId: thread_id });
  } catch (err) {
    console.error(err.response ? err.response.data : err);
    // Enviar detalles completos del error al front para depuración
    res.status(500).json({ 
      error: 'Error comunicando con OpenAI', 
      details: err.message,
      openai: err.response ? err.response.data : undefined
    });
  }
});

app.listen(PORT, () => {
  console.log(`Red Judicial Chat backend listening on port ${PORT}`);
}); 