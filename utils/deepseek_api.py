import requests

# Substitua 'sua_chave_api' pela sua chave de API real
api_key = 'sk-afffdb16e95e4572a6c8aba0d7913388'
url = 'https://api.deepseek.com/v1/chat/completions'

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

data = {
    'model': 'deepseek-chat',  # Substitua pelo modelo correto, se necessário
    'messages': [{'role': 'user', 'content': 'Quem foi Machado de Assis?'}]
}

response = requests.post(url, headers=headers, json=data)

if response.status_code == 200:
    print("Resposta da API:", response.json())
else:
    print("Erro na conexão com a API:", response.status_code, response.text)