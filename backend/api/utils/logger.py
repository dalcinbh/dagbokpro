import os
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime

class CustomFormatter(logging.Formatter):
    def format(self, record):
        # Add timestamp to the message
        record.timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return super().format(record)

def setup_logger():
    # Create logs directory outside of the Django project
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    log_dir = os.path.join(os.path.dirname(base_dir), 'logs')
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, 'backend.log')

    # Create logger
    logger = logging.getLogger('django')
    logger.setLevel(logging.DEBUG)

    # Create handlers
    console_handler = logging.StreamHandler()
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )

    # Create formatters
    formatter = CustomFormatter(
        '%(timestamp)s [%(levelname)s] %(name)s: %(message)s'
    )

    # Set formatters for handlers
    console_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)

    # Add handlers to logger
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger

# Create a singleton instance
logger = setup_logger() 