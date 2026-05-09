exports.handler = async (event) => {
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    const { prompt } = JSON.parse(event.body);
    console.log("Recebi o prompt:", prompt);

    const response = await fetch(`https://googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    console.log("Resposta bruta do Google:", JSON.stringify(data));

    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      const textoGerado = data.candidates[0].content.parts[0].text;
      
      return {
        statusCode: 200,
        body: JSON.stringify({ resposta: textoGerado }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ resposta: "Google mandou um formato estranho", erro: data }),
      };
    }

  } catch (error) {
    console.error("ERRO CRÍTICO NA FUNÇÃO:", error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ resposta: "Erro no servidor", detalhes: error.message }) 
    };
  }
};
