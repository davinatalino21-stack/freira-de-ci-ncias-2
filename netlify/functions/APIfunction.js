exports.handler = async (event) => {
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    const { prompt } = JSON.parse(event.body);

    const response = await fetch(`https://googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
        return { statusCode: 500, body: JSON.stringify({ resposta: "Erro na API do Google", erro: data.error }) };
    }

    const textoGerado = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ resposta: textoGerado }),
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ resposta: "Erro no servidor", detalhes: error.message }) 
    };
  }
};
