from __future__ import absolute_import, unicode_literals
from concurrent.futures import ThreadPoolExecutor
from django.utils.text import slugify
from django.core.exceptions import ObjectDoesNotExist
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from django.db import IntegrityError
from celery import task
from urllib.request import urlopen
from urllib.parse import urlparse
import asyncio
import requests
import json


@task
def get_news():

    def fetch(session, category):
        url = ('https://newsapi.org/v2/top-headlines'
               '?country=us'
               '&category={0}'
               '&pageSize=8'
               '&apiKey=40f6e017973148949534ed25324730e6'
               ).format(category)
        with session.get(url) as response:
            data = response.text
            if response.status_code != 200:
                print("FAILURE::{0}".format(url))

            return data

    async def get_categories():
        from .models import Article, Author, Subject

        categories = ['politics', 'business', 'science', 'sports', 'technology']

        with ThreadPoolExecutor(max_workers=5) as executor:
            with requests.Session() as session:
                loop = asyncio.get_event_loop()
                tasks = [
                    loop.run_in_executor(
                        executor,
                        fetch,
                        *(session, category)
                    )
                    for category in categories
                ]

                resolved_tasks = await asyncio.gather(*tasks)

                for index, response in enumerate(resolved_tasks, start=0):
                    response = json.loads(response)

                    for article in response.get('articles'):
                        try:
                            author = Author.objects.get(name=article.get('author'))
                        except ObjectDoesNotExist:
                            try:
                                if article.get('author') is not None:
                                    author = Author.objects.create(name=article.get('author'))
                                else:
                                    author = Author.objects.create(name=article.get('source').get('name'))
                            except IntegrityError:
                                # Duplicated key caused by Celery tasks being called more than once
                                # at start due to a messaging broker error
                                pass

                        if not Article.objects.filter(title=article.get('title')).exists():
                            new_article = Article(
                                title=article.get('title'),
                                slug=slugify(article.get('title')),
                                author=author,
                                subject=Subject.objects.get(name__iexact=categories[index]),
                                publishDate=article.get('publishedAt'),
                            )

                            if article.get('content') is not None:
                                new_article.text = article.get('content')

                            try:
                                image_url = article.get('urlToImage')

                                if image_url is not None:
                                    img_temp = NamedTemporaryFile(delete=True)
                                    img_temp.write(urlopen(image_url).read())
                                    img_temp.flush()

                                    filename = urlparse(image_url).path.split('/')[-1]
                                    new_article.heroImage.save(filename, File(img_temp))
                            except (OSError, ValueError):
                                pass

                            new_article.save()

    loop = asyncio.get_event_loop()
    future = asyncio.ensure_future(get_categories())
    loop.run_until_complete(future)
