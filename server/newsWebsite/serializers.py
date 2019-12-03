from django.contrib.auth.models import User

from .models import Subject, Article, Author
from rest_framework import serializers


class UserSerializerV1(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')


class SubjectSerializerV1(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Subject
        fields = ('id', 'name', 'color')


class AuthorSerializerV1(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Author
        fields = ('name', 'picture')


class ArticleSerializerV1(serializers.HyperlinkedModelSerializer):
    author = AuthorSerializerV1()
    subject = SubjectSerializerV1()
    text = serializers.SerializerMethodField('text_subset')

    class Meta:
        model = Article
        fields = ('id', 'slug', 'title', 'heroImage', 'author', 'subject', 'publishDate', 'text')

    def text_subset(self, obj):
        subset = obj.text[0:200]
        if len(subset) > 200:
            subset += '...'
        return subset
