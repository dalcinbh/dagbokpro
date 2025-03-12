import os
import json
import boto3
import requests
import traceback
from datetime import datetime
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Carrega variáveis de ambiente
load_dotenv()

# Configura o cliente do S3
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION_NAME')
)

class ResumeAPIView(APIView):
    def get(self, request):
        try:
            bucket_name = os.getenv('AWS_STORAGE_BUCKET_NAME')
            text_folder = 'text/'
            json_folder = 'json/'

            # Define o caminho do arquivo TXT de entrada
            txt_input_file_key = text_folder + os.getenv('INPUT_TEXT_FILE_PATH')
            # Define o caminho do arquivo JSON de saída            
            json_output_file_key = json_folder + os.getenv('OUTPUT_JSON_FILE_PATH')

            # Verifica se o arquivo TXT de entrada existe no S3
            try:
                s3_client.head_object(Bucket=bucket_name, Key=txt_input_file_key)
            except ClientError as e:
                if e.response['Error']['Code'] == '404':
                    return Response({"error": f"Input text file '{txt_input_file_key}' not found in S3 bucket"}, status=status.HTTP_404_NOT_FOUND)
                else:
                    print(f"Unexpected error checking input text file in S3: {e}")
                    return Response({"error": f"Failed to check input text file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Verifica se o arquivo JSON de saída já existe e se está atualizado
            try:
                json_obj = s3_client.head_object(Bucket=bucket_name, Key=json_output_file_key)
                json_mtime = json_obj['LastModified'].timestamp()
            except ClientError as e:
                if e.response['Error']['Code'] == '404':
                    print(f"JSON file '{json_output_file_key}' not found. Creating a new one...")
                    json_mtime = 0  # Força a geração do JSON
                else:
                    print(f"Unexpected error checking JSON file in S3: {e}")
                    return Response({"error": f"Failed to check JSON file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Obtém a data de modificação mais recente do arquivo TXT de entrada
            txt_mtime = s3_client.head_object(Bucket=bucket_name, Key=txt_input_file_key)['LastModified'].timestamp()

            # Se o JSON não existe ou o arquivo TXT é mais recente, atualiza o JSON
            if not json_mtime or txt_mtime > json_mtime or True:
                # Lê o conteúdo do arquivo TXT de entrada
                response = s3_client.get_object(Bucket=bucket_name, Key=txt_input_file_key)
                combined_text = response['Body'].read().decode('utf-8')

                # Chama a API da DeepSeek para processar o texto
                api_key = os.getenv('API_KEY_DEEPSEEK')  # Usa a chave da DeepSeek
                if not api_key:
                    return Response({"error": "API key not found in .env"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                processed_data = self.process_with_deepseek(combined_text, api_key)
                if not processed_data:
                    processed_data = {
                        "title": "Adriano Alves",
                        "summary": {"professional_summary": "Failed to process resume with DeepSeek"},
                        "education": {},
                        "experience": [],
                        "skills": [],
                        "additional_information": {}
                    }

                # Salva o JSON processado no S3
                s3_client.put_object(
                    Bucket=bucket_name,
                    Key=json_output_file_key,
                    Body=json.dumps(processed_data, indent=2),
                    ContentType='application/json'
                )

            # Lê o conteúdo do arquivo JSON de saída
            response = s3_client.get_object(Bucket=bucket_name, Key=json_output_file_key)
            content = response['Body'].read().decode('utf-8').strip()
            if not content:
                return Response({"error": "JSON file is empty"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            resume_data = json.loads(content)

            return Response(resume_data)
        except Exception as e:
            error_trace = traceback.format_exc()
            print(f"Error in ResumeAPIView: {e}\nTraceback:\n{error_trace}")
            return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def process_with_deepseek(self, text, api_key):
        try:
            print("Processing text with DeepSeek API...", text)
            url = "https://api.deepseek.com/v1/chat/completions"  # Verifique o endpoint correto
            prompt = (
                "You are a helpful assistant that interprets unstructured resume text and structures it into a JSON format. "
                "Extract and categorize the following sections:\n"
                "- 'title': The person's name and professional title.\n"
                "- 'summary': An object with 'professional_summary'.\n"
                "- 'education': An object mapping institutions to degrees.\n"
                "- 'experience': A list of work experiences.\n"
                "- 'skills': A list of technical and soft skills.\n"
                "- 'additional_information': Other relevant details.\n"
                f"\nUnstructured resume text:\n{text}"
            )
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "deepseek-chat",  # Substitua pelo nome do modelo correto
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 500,
                "temperature": 0.7
            }
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()  # Lança uma exceção para códigos de status 4xx/5xx

            # Log da resposta completa da API
            print("API Response:", response.text)

            # Tenta decodificar a resposta como JSON
            result = response.json()

            # Verifica se a resposta contém a estrutura esperada
            if not result.get('choices'):
                print("No 'choices' found in the API response.")
                return None

            content = result['choices'][0].get('message', {}).get('content', '{}')
            if not content:
                print("No 'content' found in the API response.")
                return None

            # Tenta decodificar o conteúdo como JSON
            return json.loads(content)
        except requests.exceptions.HTTPError as e:
            error_response = response.text if response else "No response from server"
            print(f"HTTPError: {e}. Response: {error_response}")
            return None
        except json.JSONDecodeError as e:
            print(f"JSONDecodeError: {e}. Response content is not valid JSON.")
            return None
        except Exception as e:
            error_trace = traceback.format_exc()
            print(f"Error processing with DeepSeek: {e}\nTraceback:\n{error_trace}")
            return None