import os
import json
from datetime import datetime
from pathlib import Path
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

class ResumeAPIView(APIView):
    def get(self, request):
        # Caminhos dos diretórios e arquivos
        text_dir = Path(settings.BASE_DIR) / 'text'
        json_path = Path(os.getenv('OUTPUT_JSON_FILE_PATH'))

        # Cria o diretório pai do JSON se não existir
        json_path.parent.mkdir(parents=True, exist_ok=True)

        # Verifica se o JSON existe e sua data de modificação
        json_mtime = json_path.stat().st_mtime if json_path.exists() else 0

        # Verifica a data de modificação mais recente dos arquivos de texto
        text_files = list(text_dir.glob('*'))
        if not text_files:
            return Response({"error": "No text files found in backend/text/"}, status=status.HTTP_404_NOT_FOUND)

        latest_text_mtime = max(os.path.getmtime(file) for file in text_files)

        # Se o JSON não existe ou os arquivos de texto são mais recentes, atualize o JSON
        if not json_path.exists() or latest_text_mtime > json_mtime:
            # Combina todos os arquivos de texto
            combined_text = ""
            for file_path in text_files:
                with open(file_path, 'r', encoding='utf-8') as f:
                    combined_text += f.read() + "\n"

            print(f"Combined text sent to ChatGPT:\n{combined_text}")  # Log do texto enviado

            # Chama a API do ChatGPT para processar o texto
            api_key = os.getenv('API_KEY_DAGBOK')
            if not api_key:
                return Response({"error": "API key not found in .env"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            processed_data = self.process_with_chatgpt(combined_text, api_key)
            if not processed_data:
                # Se falhar ao processar com ChatGPT, retorna um JSON padrão
                processed_data = {
                    "title": "Adriano Alves",
                    "summary": {"professional_summary": "Failed to process resume with ChatGPT"},
                    "education": {},
                    "experience": [],
                    "skills": [],
                    "additional_information": {}
                }

            # Salva o JSON
            try:
                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump(processed_data, f, indent=2)
            except Exception as e:
                print(f"Error saving JSON to {json_path}: {e}")
                return Response({"error": f"Failed to save JSON: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Lê o JSON e retorna
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                if not content:  # Verifica se o arquivo está vazio
                    return Response({"error": "JSON file is empty"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                resume_data = json.loads(content)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from {json_path}: {e}")
            return Response({"error": "Invalid JSON format in dagbok.json"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(f"Error reading JSON from {json_path}: {e}")
            return Response({"error": f"Failed to read JSON: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(resume_data)

    def process_with_chatgpt(self, text, api_key):
        try:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            prompt = (
                "You are a helpful assistant that interprets unstructured resume text and structures it into a JSON format. "
                "Extract and categorize the following sections:\n"
                "- 'title': The person's name and professional title (e.g., 'Adriano Alves - Software Engineer').\n"
                "- 'summary': An object with 'professional_summary' (a brief overview of the person's career). Do NOT include a 'key_skills' field here, as skills should only be in the 'skills' section.\n"
                "- 'education': An object where each key is an institution name, with the value being either a single string (e.g., 'Bachelor of Computer Science (2014-2018)') or a list of strings if multiple degrees are mentioned.\n"
                "- 'experience': A list of objects, each describing a professional experience with the following fields: 'company' (company name), 'role', 'timeline', 'description', and 'highlights' (a list of achievements). Extract this from job history or narrative text.\n"
                "- 'skills': A list of technical and soft skills mentioned anywhere in the text (e.g., ['JavaScript', 'Leadership']). This should be the only section containing skills.\n"
                "- 'additional_information': An object with fields like 'languages', 'citizenship', 'availability', and 'interests' if present.\n"
                "Ensure that 'experience' and 'skills' are always populated if relevant information exists in the text. If the text mentions jobs or roles, include them in the 'experience' section with full details. If skills are mentioned (e.g., 'experienced in JavaScript', 'leadership skills'), list them in the 'skills' section. "
                "Return a valid JSON object with these sections.\n\n"
                f"Unstructured resume text:\n\n{text}"
            )
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant that interprets unstructured resume text and structures it into a JSON format."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7
            }
            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            response.raise_for_status()

            result = response.json()
            content = result['choices'][0]['message']['content']
            print(f"ChatGPT response:\n{content}")  # Log para depuração
            return json.loads(content)  # Converte a resposta do ChatGPT (JSON em string) para um dicionário Python
        except Exception as e:
            print(f"Error processing with ChatGPT: {e}")
            return None