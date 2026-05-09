// O Netlify no Node 18+ já tem fetch, mas vamos garantir a estabilidade
exports.handler = async (event) => {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ resposta: "Erro: Chave API não configurada no Netlify" }) };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    console.log("Enviando para o Google...");

    const url = `https://googleapis.com{API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro do Google:", errorData);
      return { statusCode: response.status, body: JSON.stringify({ resposta: "O Google retornou um erro", erro: errorData }) };
    }

    const data = await response.json();
    console.log("Sucesso ao receber resposta!");

    // Caminho seguro para pegar o texto (Gemini 1.5 Flash)
    const textoGerado = data.candidates?.[0]?.content?.parts?.[0]?.text || "Não consegui gerar uma resposta.";

    return {
      statusCode: 200,
      body: JSON.stringify({ resposta: textoGerado }),
    };

  } catch (error) {
    console.error("ERRO DETALHADO:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ resposta: "Erro de rede no servidor", detalhes: error.message }) 
    };
  }
};
