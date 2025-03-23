import os
import re
import json
import boto3
import requests
import traceback
from datetime import datetime
from botocore.exceptions import ClientError
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from dotenv import load_dotenv
from .models import UserProfile, Resume
from rest_framework.permissions import IsAuthenticated
from social_django.utils import load_backend, load_strategy
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
import logging
from .serializers import ResumeSerializer

logger = logging.getLogger('api')

class SocialTokenLoginView(APIView):
    def post(self, request, provider):
        access_token = request.data.get('access_token')
        if not access_token:
            return Response({"error": "Access token is required"}, status=status.HTTP_400_BAD_REQUEST)

        strategy = load_strategy(request)
        try:
            backend = load_backend(strategy, provider, redirect_uri=None)
            user = backend.do_auth(access_token)
            if user:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                })
            else:
                return Response({"error": "Authentication failed"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GoogleCallback(APIView):
    def post(self, request):
        SECRET_KEY = os.getenv('SECRET_KEY')
        access_token = request.data.get('access_token')
        strategy = load_strategy(request)
        backend = load_backend(strategy, 'google-oauth2', redirect_uri=None)
        
        try:
            user = backend.do_auth(access_token)
            login(request, user)
            return Response({"token": SECRET_KEY })  # Replace with actual JWT token
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Load environment variables from .env file
load_dotenv()

# Configure the S3 client with the specified region
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION_NAME')
)

# backend/api/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from social_django.utils import load_backend, load_strategy
from django.contrib.auth import login

class GoogleLogin(APIView):
    def get(self, request):
        # Load the strategy and backend for Google OAuth2
        strategy = load_strategy(request)
        backend = load_backend(strategy, 'google-oauth2', redirect_uri=None)

        # Generate the Google OAuth2 authorization URL
        auth_url = backend.auth_url()
        return Response({"auth_url": auth_url})

    def post(self, request):
        # Handle the callback from Google OAuth2
        access_token = request.data.get('access_token')

        if not access_token:
            return Response({"error": "Access token is required"}, status=400)

        strategy = load_strategy(request)
        backend = load_backend(strategy, 'google-oauth2', redirect_uri=None)

        try:
            # Authenticate the user using the access token
            user = backend.do_auth(access_token)

            if user:
                # Log the user in
                login(request, user)
                return Response({"message": "Login successful", "user_id": user.id})
            else:
                return Response({"error": "Authentication failed"}, status=401)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class ResumeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.info(f"Fetching resume for user: {request.user.email}")
        try:
            resume = Resume.objects.get(user=request.user)
            serializer = ResumeSerializer(resume)
            logger.debug(f"Resume data fetched successfully for user: {request.user.email}")
            return Response(serializer.data)
        except Resume.DoesNotExist:
            logger.warning(f"Resume not found for user: {request.user.email}")
            return Response(
                {"error": "Resume not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error fetching resume for user {request.user.email}: {str(e)}")
            return Response(
                {"error": "Internal server error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        logger.info(f"Creating/updating resume for user: {request.user.email}")
        try:
            resume, created = Resume.objects.get_or_create(user=request.user)
            serializer = ResumeSerializer(resume, data=request.data)
            
            if serializer.is_valid():
                serializer.save()
                action = "created" if created else "updated"
                logger.debug(f"Resume {action} successfully for user: {request.user.email}")
                return Response(serializer.data)
            
            logger.warning(f"Invalid data for resume update: {serializer.errors}")
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error saving resume for user {request.user.email}: {str(e)}")
            return Response(
                {"error": "Internal server error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def get(self, request):
    try:
        # Retrieve bucket name from environment variables
        bucket_name = os.getenv('AWS_STORAGE_BUCKET_NAME')
        if not bucket_name:
            return Response({"error": "Bucket name not found in environment variables"}, status=500)

        # Define txt_input_file_key before checking TXT file existence
        text_folder = 'text/'
        txt_input_file_key = text_folder + os.getenv('INPUT_TEXT_FILE_PATH')

        # Check TXT file existence
        s3_client.head_object(Bucket=bucket_name, Key=txt_input_file_key)
    except ClientError as e:
        if e.response['Error']['Code'] == '404':
            return Response({"error": "TXT file not found"}, status=404)
        return Response({"error": "S3 error"}, status=500)

