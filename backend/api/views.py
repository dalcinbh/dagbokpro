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
                "Return in English a JSON object with these sections.\n\n"
                f"Unstructured resume text:\n\n{text}"
            )
            payload = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant that interprets unstructured resume text and structures it into a JSON format."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7
            }
            response = requests.post("https://api.deepseek.com/v1/chat/completions", headers=headers, json=payload, timeout=3000)
            response.raise_for_status()
            result = response.json()
            return result
        except Exception as e:
            print(f"Error in DeepSeek processing: {str(e)}")
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
                "Return in English a JSON object with these sections.\n\n"
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
            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=3000)
            response.raise_for_status()
            result = response.json()
            return result
        except Exception as e:
            print(f"Error in ChatGPT processing: {str(e)}")
            return None