# Usa a imagem oficial do Python
FROM python:3.9-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de requisitos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código do backend
COPY . .

# Configura variáveis de ambiente
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Expondo a porta esperada pelo Cloud Run
EXPOSE 8080

# Comando para rodar o servidor com Gunicorn na porta correta
CMD ["sh", "-c", "gunicorn --workers 2 --timeout 120 --bind 0.0.0.0:$PORT dagbok.wsgi:application"]
