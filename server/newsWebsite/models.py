from django.db import models


def picture_upload_path(instance, filename):
    # file will be saved at <MEDIA_ROOT>/authorPictures/<filename>
    return 'authorPictures/{0}'.format(filename)


def hero_upload_path(instance, filename):
    # file will be saved at <MEDIA_ROOT>/heroImages/<filename>
    return 'heroImages/{0}'.format(filename)


class Subject(models.Model):
    name = models.CharField(max_length=200)
    color = models.CharField(max_length=10)

    def __str__(self):
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=200, unique=True)
    picture = models.ImageField(upload_to=picture_upload_path, default='authorPictures/default_author.png')

    def __str__(self):
        return self.name


class Article(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=500)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    heroImage = models.ImageField(upload_to=hero_upload_path, blank=True, max_length=500, default='heroImages/default_article.png')
    publishDate = models.DateTimeField('Publish date')
    text = models.TextField(blank=True)

    def __str__(self):
        return self.title
