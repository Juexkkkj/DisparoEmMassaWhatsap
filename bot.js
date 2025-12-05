const axios = require('axios');
// Adicione outras dependências se o seu código original usava, como 'fs' para ler arquivos
// const fs = require('fs'); 

// ==============================================================================
// 1. CONFIGURAÇÕES DA API (LÊ AS CHAVES DA VERCEL)
// ==============================================================================
const API_URL = "https://api.green-api.com";
const ID_INSTANCE = process.env.ID_INSTANCE;
const API_TOKEN = process.env.API_TOKEN;

// -----------------------------------------------------------------------------
// !!! IMPORTANTE !!!
// A LISTA ABAIXO DEVE SER GERADA PELA LEITURA DO SEU ARQUIVO CSV NO CÓDIGO ORIGINAL.
// Para este exemplo, usaremos apenas um contato de teste.
// Mantenha o formato: DDI + DDD + Número. O '@c.us' é obrigatório.
const CONTATOS_PARA_ENVIO = [
    "557597002889@c.us", // SEU NÚMERO (Para Teste)
    // "5511999999999@c.us", // Exemplo de Outro Contato
];

const MENSAGEM_PADRAO = "Olá! Sua mensagem de disparo em massa está funcionando com Vercel + Green API!";
// -----------------------------------------------------------------------------


// ==============================================================================
// 2. FUNÇÃO PRINCIPAL DE DISPARO
// ==============================================================================
/**
 * Executa o loop de envio de mensagens para a lista de contatos.
 */
async function iniciarDisparo() {
    console.log(`Iniciando disparo para ${CONTATOS_PARA_ENVIO.length} contatos com a instância ${ID_INSTANCE}`);
    
    // Simula a leitura da lista de contatos (se o seu código original lia um CSV, ele iria aqui)

    for (const chatId of CONTATOS_PARA_ENVIO) {
        try {
            const endpoint = `${API_URL}/waInstance${ID_INSTANCE}/sendMessage/${API_TOKEN}`;

            await axios.post(endpoint, {
                chatId: chatId,
                message: MENSAGEM_PADRAO
            });

            console.log(`Mensagem enviada com sucesso para: ${chatId}`);
            
            // Adicione um pequeno delay para evitar bloqueios por excesso de velocidade (Spam)
            await new Promise(resolve => setTimeout(resolve, 1000)); 

        } catch (error) {
            console.error(`❌ Erro ao enviar para ${chatId}:`, error.response ? error.response.data : error.message);
        }
    }
    console.log('Fim do processo de disparo.');
} 


// ==============================================================================
// 3. GATILHO VERCEL (O QUE CORRIGE O ERRO 404)
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
