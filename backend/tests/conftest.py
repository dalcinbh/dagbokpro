import pytest
from django.conf import settings
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_user(db):
    User = get_user_model()
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )

@pytest.fixture
def authenticated_client(api_client, test_user):
    api_client.force_authenticate(user=test_user)
    return api_client

@pytest.fixture
def sample_post_data():
    return {
        'title': 'Test Post',
        'content': 'Test content for the blog post',
        'category': 'technology'
    }

@pytest.fixture
def sample_transcription_data():
    return {
        'text': 'This is a test transcription that should be processed',
    } 