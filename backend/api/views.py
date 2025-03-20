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
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

# Load environment variables from .env file
load_dotenv()

# Configure the S3 client with the specified region
s3_client = boto3.client('s3', region_name=os.getenv('AWS_S3_REGION_NAME'))

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = 'https://auth.dagbok.pro/app1/api/auth/callback/google'

class ResumeAPIView(APIView):
    def get(self, request):
        try:
            # Verifica autenticação
            if not request.user.is_authenticated:
                return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

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
                api_key = os.getenv('API_KEY_DAGBOK')
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
        url = "https://api.deepseek.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        prompt = (
            "Extract and structure the following resume text into a JSON format with the following sections: "
            "title (name of the person), summary (professional summary), education (list of degrees with institution, degree, and year), "
            "experience (list of jobs with company, role, duration, and description), skills (list of skills), "
            "and additional_information (any other relevant details like certifications, languages, etc.). "
            "Ensure the output is clean and well-structured JSON. Here is the resume text:\n\n" + text
        )
        data = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that extracts and structures resume data into JSON."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 4096,
            "temperature": 0.7
        }

        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            content = result['choices'][0]['message']['content'].strip()

            # Clean the response if it contains markdown or extra text
            if content.startswith("```json"):
                content = content[7:-3].strip()  # Remove ```json and ``` markers
            return json.loads(content)
        except Exception as e:
            print(f"Error processing with DeepSeek: {e}")
            return None

    def process_with_chatgpt(self, text, api_key):
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        prompt = (
            "Extract and structure the following resume text into a JSON format with the following sections: "
            "title (name of the person), summary (professional summary), education (list of degrees with institution, degree, and year), "
            "experience (list of jobs with company, role, duration, and description), skills (list of skills), "
            "and additional_information (any other relevant details like certifications, languages, etc.). "
            "Ensure the output is clean and well-structured JSON. Here is the resume text:\n\n" + text
        )
        data = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that extracts and structures resume data into JSON."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 4096,
            "temperature": 0.7
        }

        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            content = result['choices'][0]['message']['content'].strip()

            # Clean the response if it contains markdown or extra text
            if content.startswith("```json"):
                content = content[7:-3].strip()  # Remove ```json and ``` markers
            return json.loads(content)
        except Exception as e:
            print(f"Error processing with ChatGPT: {e}")
            return None