from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.decorators import permission_classes
from .serializers import UserSerializerV1, SubjectSerializerV1, ArticleSerializerV1, AuthorSerializerV1
from .models import Subject, Article, Author
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import AllowAny


class MultiSerializerViewSet(viewsets.ReadOnlyModelViewSet):
    def get_serializer_class(self):
        return self.serializers.get(self.request.version)


class UserViewSet(MultiSerializerViewSet):
    serializers = {
        '1.0': UserSerializerV1
        # Add serializers for further versions
    }

    pagination_class = None

    def get_queryset(self):
        username = self.kwargs['username']
        try:
            queryset = User.objects.filter(username=username).values()
        except ObjectDoesNotExist:
            queryset = []
        return queryset


@permission_classes((AllowAny, ))
class SubjectViewSet(MultiSerializerViewSet):
    serializers = {
        '1.0': SubjectSerializerV1
        # Add serializers for further versions
    }

    queryset = Subject.objects.all()
    pagination_class = None


@permission_classes((AllowAny, ))
class AuthorViewSet(MultiSerializerViewSet):
    serializers = {
        '1.0': AuthorSerializerV1
        # Add serializers for further versions
    }

    queryset = Author.objects.all()


@permission_classes((AllowAny, ))
class ArticleViewSet(MultiSerializerViewSet):
    serializers = {
        '1.0': ArticleSerializerV1
        # Add serializers for further versions
    }

    def get_queryset(self):
        queryset = Article.objects.all().order_by('-publishDate')
        subject = self.request.query_params.get('subject', None)

        if subject is not None:
            queryset = queryset.filter(subject__id=subject)

        return queryset
