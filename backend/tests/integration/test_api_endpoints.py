import pytest
from rest_framework import status
from django.urls import reverse

@pytest.mark.django_db
class TestPostEndpoints:
    def test_list_posts(self, authenticated_client):
        url = reverse('post-list')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)

    def test_create_post(self, authenticated_client, sample_post_data):
        url = reverse('post-list')
        response = authenticated_client.post(url, sample_post_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == sample_post_data['title']

    def test_retrieve_post(self, authenticated_client, test_user):
        # Create a post first
        post = Post.objects.create(
            title="Test Post",
            content="Test content",
            category="technology",
            author=test_user
        )
        url = reverse('post-detail', kwargs={'pk': post.pk})
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == "Test Post"

@pytest.mark.django_db
class TestTranscriptionEndpoints:
    def test_create_transcription(self, authenticated_client, sample_transcription_data):
        url = reverse('transcription-create')
        response = authenticated_client.post(url, sample_transcription_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['text'] == sample_transcription_data['text']

    def test_generate_post_from_transcription(self, authenticated_client):
        # Create a transcription first
        transcription = Transcription.objects.create(
            text="Test transcription",
            user=authenticated_client.user
        )
        url = reverse('generate-post')
        response = authenticated_client.post(url, {'transcription_id': transcription.id})
        assert response.status_code == status.HTTP_200_OK
        assert 'slug' in response.data

@pytest.mark.django_db
class TestAuthenticationEndpoints:
    def test_unauthorized_access(self, api_client):
        url = reverse('post-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_oauth_authentication(self, api_client):
        # Test OAuth authentication flow
        url = reverse('oauth-login')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK 