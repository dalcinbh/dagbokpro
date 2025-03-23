import logging
import json
from django.utils.timezone import now

logger = logging.getLogger('api')

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log request
        start_time = now()
        
        # Log basic request info
        logger.info(f"Request: {request.method} {request.path}")
        
        # Log headers
        headers = {k: v for k, v in request.headers.items()}
        logger.debug(f"Headers: {json.dumps(headers, indent=2)}")
        
        # Log body for POST/PUT/PATCH
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                body = request.body.decode('utf-8')
                if body:
                    logger.debug(f"Body: {body}")
            except Exception as e:
                logger.warning(f"Could not decode request body: {e}")

        # Get response
        response = self.get_response(request)
        
        # Calculate duration
        duration = (now() - start_time).total_seconds()
        
        # Log response
        logger.info(
            f"Response: {response.status_code} "
            f"(took {duration:.2f}s)"
        )
        
        return response

    def process_exception(self, request, exception):
        logger.error(f"Exception during request: {exception}", exc_info=True)
        return None 