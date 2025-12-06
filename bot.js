const axios = require('axios');
// const fs = require('fs'); // Removido para simplificar o teste final

// ==============================================================================
// 1. CONFIGURAÇÕES DA API (LÊ AS CHAVES DA VERCEL)
// ==============================================================================
const API_URL = "https://api.green-api.com";
const ID_INSTANCE = process.env.ID_INSTANCE;
const API_TOKEN = process.env.API_TOKEN;

// -----------------------------------------------------------------------------
// LISTA DE CONTATOS DE TESTE
// O SEU NÚMERO FOI INSERIDO AQUI PARA O TESTE FINAL.
const CONTATOS_PARA_ENVIO = [
    "557597002889@c.us", // SEU NÚMERO DE TESTE (No formato DDI+DDD+Número@c.us)
];

const MENSAGEM_PADRAO = "✅ Teste FINAL BEM-SUCEDIDO! Seu bot Vercel + Green API está funcionando corretamente.";
// -----------------------------------------------------------------------------


// ==============================================================================
// 2. FUNÇÃO PRINCIPAL DE DISPARO
// ==============================================================================
/**
 * Executa o loop de envio de mensagens para a lista de contatos.
 */
async function iniciarDisparo() {
    console.log(`Iniciando disparo para ${CONTATOS_PARA_ENVIO.length} contato com a instância ${ID_INSTANCE}`);
    
    for (const chatId of CONTATOS_PARA_ENVIO) {
        try {
            const endpoint = `${API_URL}/waInstance${ID_INSTANCE}/sendMessage/${API_TOKEN}`;

            await axios.post(endpoint, {
                chatId: chatId,
                message: MENSAGEM_PADRAO
            });

            console.log(`Mensagem enviada com sucesso para: ${chatId}`);
            
            // Adiciona um delay para maior segurança
            await new Promise(resolve => setTimeout(resolve, 1000)); 

        } catch (error) {
            console.error(`❌ Erro ao enviar para ${chatId}:`, error.response ? error.response.data : error.message);
        }
    }
    console.log('Fim do processo de disparo.');
} 


// ==============================================================================
// 3. GATILHO VERCEL (CORREÇÃO DO ERRO 404)
// ==============================================================================

// Esta função é o ponto de entrada Serverless da Vercel.
module.exports = async (request, response) => {
    try {
        if (!ID_INSTANCE || !API_TOKEN) {
            return response.status(500).send('Erro: Chaves ID_INSTANCE ou API_TOKEN não configuradas na Vercel.');
        }

        // Executa a lógica de disparo
        await iniciarDisparo(); 
        
        // Retorna uma resposta de sucesso HTTP.
        response.status(200).send('Disparo em massa iniciado com sucesso! O script rodou.');
    
    } catch (error) {
        console.error('Erro de Execução do Script:', error);
        response.status(500).send('Erro interno do servidor. Verifique os logs.');
    }
};
