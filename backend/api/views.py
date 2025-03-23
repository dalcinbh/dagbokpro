import os
"""
ResumeAPIView is a Django Rest Framework API view that processes a resume text file stored in an S3 bucket,
converts it to a structured JSON format using either the DeepSeek or ChatGPT API, and returns the JSON data.

Methods:
    get(self, request):
        Handles GET requests to the API endpoint. It checks if the input text file exists in the S3 bucket,
        processes it using the specified AI API if necessary, and returns the structured JSON data.

    process_with_deepseek(self, text, api_key):
        Processes the given unstructured resume text using the DeepSeek API and returns the structured JSON data.
        Args:
            text (str): The unstructured resume text.
            api_key (str): The API key for accessing the DeepSeek API.
        Returns:
            dict: The structured JSON data extracted from the resume text, or None if an error occurs.

    process_with_chatgpt(self, text, api_key):
        Processes the given unstructured resume text using the ChatGPT API and returns the structured JSON data.
        Args:
            text (str): The unstructured resume text.
            api_key (str): The API key for accessing the ChatGPT API.
        Returns:
            dict: The structured JSON data extracted from the resume text, or None if an error occurs.
"""
import re
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

# Load environment variables from .env file
load_dotenv()

# Configure the S3 client with the specified region
s3_client = boto3.client('s3', region_name=os.getenv('AWS_S3_REGION_NAME'))

class ResumeAPIView(APIView):
    def get(self, request):
        """
        IMPLEMENTAÇÃO TEMPORÁRIA PARA TESTE - Retorna dados JSON fixos sem acessar S3
        """
        try:
            # Retornar dados de teste para simular um currículo
            sample_resume = {
                "title": "Adriano Alves - Desenvolvedor Full Stack",
                "summary": {
                    "professional_summary": "Desenvolvedor Full Stack experiente com mais de 10 anos de experiência em desenvolvimento web. Especializado em Python, Django, JavaScript e React.js."
                },
                "education": {
                    "Universidade Federal do Paraná": "Bacharel em Ciência da Computação (2010-2014)"
                },
                "experience": [
                    {
                        "company": "Agilizatop",
                        "role": "Desenvolvedor Full Stack Sênior",
                        "timeline": "2018 - Presente",
                        "description": "Desenvolvimento de aplicações web utilizando Django e React.js",
                        "highlights": [
                            "Implementação de sistema de autenticação OAuth",
                            "Otimização de queries que melhoraram o desempenho em 40%",
                            "Liderança de equipe de 5 desenvolvedores"
                        ]
                    },
                    {
                        "company": "TechSolutions",
                        "role": "Desenvolvedor Backend",
                        "timeline": "2015 - 2018",
                        "description": "Desenvolvimento de APIs RESTful em Python/Django",
                        "highlights": [
                            "Criação de microserviços",
                            "Integração com sistemas de pagamento",
                            "Implementação de CI/CD"
                        ]
                    }
                ],
                "skills": [
                    "Python", "Django", "JavaScript", "React.js", "Docker", "AWS",
                    "Git", "SQL", "MongoDB", "REST APIs", "Agile", "Scrum"
                ],
                "additional_information": {
                    "languages": ["Português (nativo)", "Inglês (fluente)"],
                    "interests": ["Desenvolvimento open source", "Machine Learning", "Hiking"],
                    "availability": "Disponível para projetos imediatamente"
                }
            }
            
            return Response(sample_resume)
        except Exception as e:
            error_trace = traceback.format_exc()
            print(f"Error in ResumeAPIView: {e}\nTraceback:\n{error_trace}")
            return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def process_with_deepseek(self, text, api_key):
        try:
            print("Processing text with DeepSeek API...")
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            prompt = (
                "You are a helpful assistant that interprets unstructured resume text and structures it into a JSON format. "
                "Extract and categorize the following sections:\n"
                "Return in English a JSON object with the following sections:\n"
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
                "model": "deepseek-chat",  # Replace with the correct DeepSeek model
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant that interprets unstructured resume text and structures it into a JSON format."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7
            }

            # Send the request to the DeepSeek API
            response = requests.post("https://api.deepseek.com/v1/chat/completions", headers=headers, json=payload, timeout=3000)
            response.raise_for_status()  # Raise an exception for 4xx/5xx status codes

            # Log the full API response
            print("API Response:", response.text)

            # Decode the response as JSON
            result = response.json()

            # Check if the response contains the expected structure
            if not result.get('choices'):
                print("No 'choices' found in the API response.")
                return None

            content = result['choices'][0]['message']['content']
            print(f"DeepSeek response:\n{content}")  # Log for debugging

            # Extract JSON from the Markdown code block
            json_match = re.search(r'```json\s*({.*?})\s*```', content, re.DOTALL)
            if not json_match:
                print("No JSON found in the 'content'.")
                return None

            json_str = json_match.group(1)  # Extract JSON string
            return json.loads(json_str)  # Decode the extracted JSON

        except requests.exceptions.HTTPError as e:
            error_response = response.text if response else "No response from server"
            print(f"HTTPError: {e}. Response: {error_response}")
            return None
        except requests.exceptions.Timeout as e:
            print(f"TimeoutError: The request timed out. {e}")
            return None
        except json.JSONDecodeError as e:
            print(f"JSONDecodeError: {e}. Response content is not valid JSON.")
            return None
        except Exception as e:
            error_trace = traceback.format_exc()
            print(f"Error processing with DeepSeek: {e}\nTraceback:\n{error_trace}")
            return None

    def process_with_chatgpt(self, text, api_key):
        try:
            print("Processing text with ChatGPT API...")
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

            # Send the request to the ChatGPT API with a timeout
            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=3000)
            response.raise_for_status()  # Raise an exception for 4xx/5xx status codes

            # Log the full API response
            print("API Response:", response.text)

            # Decode the response as JSON
            result = response.json()

            # Check if the response contains the expected structure
            if not result.get('choices'):
                print("No 'choices' found in the API response.")
                return None

            content = result['choices'][0]['message']['content']
            print(f"ChatGPT response:\n{content}")  # Log for debugging

            # Try to decode the content as JSON
            try:
                return json.loads(content)
            except json.JSONDecodeError as e:
                print(f"JSONDecodeError: {e}. Response content is not valid JSON.")
                return None

        except requests.exceptions.HTTPError as e:
            error_response = response.text if response else "No response from server"
            print(f"HTTPError: {e}. Response: {error_response}")
            return None
        except requests.exceptions.Timeout as e:
            print(f"TimeoutError: The request timed out. {e}")
            return None
        except Exception as e:
            error_trace = traceback.format_exc()
            print(f"Error processing with ChatGPT: {e}\nTraceback:\n{error_trace}")
            return None