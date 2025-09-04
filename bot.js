const {
  default: makeWASocket,
  useSingleFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require('@adiwajshing/baileys');

const { Boom } = require('@hapi/boom');
const P = require('pino');

// Salva sessão em arquivo
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startSock() {
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger: P({ level: 'silent' })
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      console.log('✅ Conectado ao WhatsApp com sucesso!');

      // ✅ Altere para o número que vai receber a mensagem (formato: DDI+DDD+Número)
      const jid = '5517991243282@s.whatsapp.net';

      const buttons = [
        { buttonId: 'opcao_1', buttonText: { displayText: '✅ Opção 1' }, type: 1 },
        { buttonId: 'opcao_2', buttonText: { displayText: '🔍 Opção 2' }, type: 1 }
      ];

      const buttonMessage = {
        text: 'Escolha uma opção:',
        footer: 'Bot de teste - Baileys',
        buttons: buttons,
        headerType: 1
      };

      await sock.sendMessage(jid, buttonMessage);
      console.log('📨 Mensagem com botões enviada!');
    }

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error instanceof Boom &&
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;

      console.log('❌ Conexão encerrada.', shouldReconnect ? 'Reconectando...' : 'Você saiu da sessão.');

      if (shouldReconnect) {
        startSock();
      }
    }
  });
}

startSock();
