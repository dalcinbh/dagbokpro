from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from social_django.utils import load_backend, load_strategy
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger('api')

class SocialTokenLoginView(APIView):
    def post(self, request, provider):
        logger.info(f"Processing social login for provider: {provider}")
        try:
            # Load the social auth backend
            strategy = load_strategy(request)
            backend = load_backend(strategy=strategy, name=provider, redirect_uri=None)

            logger.debug(f"Attempting to authenticate user with {provider} token")
            # Attempt to authenticate the user
            user = backend.do_auth(request.data.get('access_token'))

            if user:
                login(request, user)
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                tokens = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                logger.info(f"User {user.email} successfully authenticated with {provider}")
                return Response(tokens)
            
            logger.warning(f"Authentication failed for {provider} token")
            return Response(
                {"error": "Invalid token"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        except Exception as e:
            logger.error(f"Error during {provider} authentication: {str(e)}")
            return Response(
                {"error": f"Authentication failed: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 