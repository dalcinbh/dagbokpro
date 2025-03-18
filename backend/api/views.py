import os
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
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.contrib.auth import login

# Load environment variables from .env file
load_dotenv()

# Configure the S3 client with the specified region
s3_client = boto3.client('s3', region_name=os.getenv('AWS_S3_REGION_NAME'))

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
class ResumeAPIView(APIView):
    def get(self, request):
        try:
            # Retrieve bucket name and folder paths from environment variables
            bucket_name = os.getenv('AWS_STORAGE_BUCKET_NAME')
            text_folder = 'text/'
            json_folder = 'json/'

            # Define the input TXT file path and output JSON file path
            txt_input_file_key = text_folder + os.getenv('INPUT_TEXT_FILE_PATH')
            json_output_file_key = json_folder + os.getenv('OUTPUT_JSON_FILE_PATH')

            # Check if the input TXT file exists in the S3 bucket
            try:
                s3_client.head_object(Bucket=bucket_name, Key=txt_input_file_key)
            except ClientError as e:
                if e.response['Error']['Code'] == '404':
                    return Response({"error": f"Input text file '{txt_input_file_key}' not found in S3 bucket"}, status=status.HTTP_404_NOT_FOUND)
                else:
                    print(f"Unexpected error checking input text file in S3: {e}")
                    return Response({"error": f"Failed to check input text file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Check if the output JSON file exists and is up-to-date
            try:
                json_obj = s3_client.head_object(Bucket=bucket_name, Key=json_output_file_key)
                json_mtime = json_obj['LastModified'].timestamp()
            except ClientError as e:
                if e.response['Error']['Code'] == '404':
                    print(f"JSON file '{json_output_file_key}' not found. Creating a new one...")
                    json_mtime = 0  # Force JSON generation
                else:
                    print(f"Unexpected error checking JSON file in S3: {e}")
                    return Response({"error": f"Failed to check JSON file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Get the last modified date of the input TXT file
            txt_mtime = s3_client.head_object(Bucket=bucket_name, Key=txt_input_file_key)['LastModified'].timestamp()

            # If the JSON file does not exist or the TXT file is more recent, update the JSON
            if not json_mtime or txt_mtime > json_mtime:
                # Read the content of the input TXT file
                response = s3_client.get_object(Bucket=bucket_name, Key=txt_input_file_key)
                combined_text = response['Body'].read().decode('utf-8')

                # Call the DeepSeek API to process the text
                api_key = os.getenv('API_KEY_DAGBOK')  # Use the AI key
                if not api_key:
                    return Response({"error": "API key not found in .env"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                processed_data = self.process_with_chatgpt(combined_text, api_key)
                if not processed_data:
                    processed_data = {
                        "title": "Adriano Alves",
                        "summary": {"professional_summary": "Failed to process resume with DeepSeek"},
                        "education": {},
                        "experience": [],
                        "skills": [],
                        "additional_information": {}
                    }

                # Save the processed JSON to S3
                s3_client.put_object(
                    Bucket=bucket_name,
                    Key=json_output_file_key,
                    Body=json.dumps(processed_data, indent=2),
                    ContentType='application/json'
                )

            # Read the content of the output JSON file
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

@csrf_exempt  # Desative CSRF para teste (remova em produção)
def google_login(request):
    if request.method == 'POST':
        token = request.POST.get('access_token')
        if not token:
            return JsonResponse({'error': 'No access token provided'}, status=400)

        # Validação do token com Google (pode usar OAuth2Client do allauth)
        client = OAuth2Client('google', request)
        try:
            # Aqui você pode validar o token com o Google, mas o allauth já faz isso
            # Para simplificar, use o token para criar ou obter a conta
            social_token = SocialToken(token=token)
            social_account = SocialAccount.objects.from_token(token, 'google')
            user = social_account.user
            login(request, user)  # Faz login do usuário
            return JsonResponse({'message': 'Login successful', 'user': user.email})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)