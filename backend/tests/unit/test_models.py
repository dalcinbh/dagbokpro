import pytest
from django.core.exceptions import ValidationError
from api.models import Post, Transcription

@pytest.mark.django_db
class TestPostModel:
    def test_create_post(self, test_user):
        post = Post.objects.create(
            title="Test Post",
            content="Test content",
            category="technology",
            author=test_user
        )
        assert post.title == "Test Post"
        assert post.author == test_user

    def test_post_str_representation(self, test_user):
        post = Post.objects.create(
            title="Test Post",
            content="Test content",
            category="technology",
            author=test_user
        )
        assert str(post) == "Test Post"

    def test_post_category_validation(self, test_user):
        with pytest.raises(ValidationError):
            post = Post.objects.create(
                title="Test Post",
                content="Test content",
                category="invalid_category",
                author=test_user
            )
            post.full_clean()

@pytest.mark.django_db
class TestTranscriptionModel:
    def test_create_transcription(self, test_user):
        transcription = Transcription.objects.create(
            text="Test transcription",
            user=test_user
        )
        assert transcription.text == "Test transcription"
        assert transcription.user == test_user

    def test_transcription_str_representation(self, test_user):
        transcription = Transcription.objects.create(
            text="Test transcription",
            user=test_user
        )
        assert str(transcription).startswith("Transcription by") 