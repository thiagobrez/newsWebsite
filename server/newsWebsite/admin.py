from django.contrib import admin
from .models import *


class SubjectAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


class AuthorAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


class ArticleAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'get_subject_name', 'publishDate', 'get_author_name')

    def get_subject_name(self, instance):
        return instance.subject.name

    def get_author_name(self, instance):
        return instance.author.name

    get_subject_name.short_description = 'Subject'
    get_author_name.short_description = 'Author'


admin.site.register(Subject, SubjectAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Article, ArticleAdmin)
