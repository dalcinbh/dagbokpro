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
from rest_framework_simplejwt.tokens import RefreshToken

# Load environment variables from .env file
load_dotenv()

# Configure the S3 client with the specified region
s3_client = boto3.client('s3', region_name=os.getenv('AWS_S3_REGION_NAME'))

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

    # ... (métodos process_with_deepseek e process_with_chatgpt permanecem os mesmos)

@csrf_exempt
def google_login(request):
    if request.method == 'POST':
        token = request.POST.get('access_token')
        if not token:
            return JsonResponse({'error': 'No access token provided'}, status=400)

        # Validação do token com Google (usando OAuth2Client do allauth)
        client = OAuth2Client('google', request)
        try:
            social_account = SocialAccount.objects.from_token(token, 'google')
            user = social_account.user
            login(request, user)  # Faz login do usuário

            # Gera token JWT
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'message': 'Login successful',
                'user': user.email,
                'token': str(refresh.access_token)
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)