from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import json
import os
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from google import genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DIRETORIO_MODELO = "./ia_mostratec_final"
tokenizer = AutoTokenizer.from_pretrained(DIRETORIO_MODELO)
modelo = AutoModelForSequenceClassification.from_pretrained(DIRETORIO_MODELO)
modelo.eval()

with open(os.path.join(DIRETORIO_MODELO, "categorias.json"), "r", encoding="utf-8") as f:
    mapeamento_categorias = json.load(f)

# Pega a chave direto do painel do Render com total segurança
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

class RequisicaoProjeto(BaseModel):
    resumo: str

@app.post("/classificar")
def classificar_resumo_api(dados: RequisicaoProjeto):
    texto = dados.resumo

    inputs = tokenizer(texto, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = modelo(**inputs)

    probabilidades = torch.nn.functional.softmax(outputs.logits, dim=-1)
    top_k = torch.topk(probabilidades, k=min(3, len(mapeamento_categorias)))
    ids = top_k.indices.tolist()
    confiancas = (top_k.values * 100).tolist()

    dados_bert = ""
    for i, (id_cat, conf) in enumerate(zip(ids, confiancas), start=1):
        dados_bert += f"- {i}º Lugar: {mapeamento_categorias[str(id_cat)]} ({conf:.2f}%)\n"

    prompt_instrucao = f"""
    Você é um avaliador especialista em feiras de ciências (Mostratec e FEBRACE).
    Um modelo classificador BERT analisou o resumo de um aluno e gerou probabilidades de categorias no padrão da Mostratec.

    Sua missão é ler o resumo do aluno, analisar as pistas matemáticas do BERT e gerar uma resposta final incrível, amigável e explicativa para o aluno.

    TEXTO DO RESUMO DO ALUNO:
    "{texto}"

    PISTAS MATEMÁTICAS DO MODELO BERT (PADRÃO MOSTRATEC):
    {dados_bert}

    INSTRUÇÕES DE FORMATAÇÃO DA SUA RESPOSTA:
    1. Seja empático, encorajador e trate o aluno de forma amigável.
    2. Explique brevemente por que o projeto dele se encaixa nas categorias sugeridas (Dê a justificativa que o BERT não consegue dar).
    3. Identifique se o projeto é multidisciplinar (se o BERT ficou muito dividido entre categorias com notas próximas).
    4. Faça o mapeamento para a FEBRACE: Diga qual seria a categoria ideal para esse mesmo projeto se o aluno fosse se inscrever na FEBRACE (ex: Engenharia, Ciências Exatas e da Terra, Ciências da Saúde, etc.).

    Gere uma resposta bem estruturada usando tópicos e markdown.
    """

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt_instrucao,
    )

    return {"resultado": response.text}
