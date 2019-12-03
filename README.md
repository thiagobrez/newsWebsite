## Synopsis

Django/React news website populated by a background scraping task.

## Installation

This installation manual is based on [Digital Ocean`s tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-18-04) and assumes you are using a UNIX-like OS.

Replace `apt-get` by your OS package manager and ensure the packages being installed exists in your package repository.

### Initial setup

Login as root:

`ssh root@your_server_ip`

Add new user:

`adduser ckl`

Grant administrative privileges:

`usermod -aG sudo ckl`

Allow SSH in firewall:

`ufw allow OpenSSH`

Enable firewall:

`ufw enable`

### Installing dependencies

Update package manager:

`sudo apt update`

Install dependencies:

`sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx rabbitmq-server curl`

### Creating the PostgreSQL database and user

Switch to the `postgres` user:

`sudo -u postgres psql`

Create the application database:

`CREATE DATABASE fullstackchallenge;`

Create the database user:

`CREATE USER ckl WITH PASSWORD '123';`

Optimize Django database operations:

`ALTER ROLE ckl SET client_encoding TO 'utf8';`

`ALTER ROLE ckl SET default_transaction_isolation TO 'read committed';`

`ALTER ROLE ckl SET timezone TO 'UTC';`

Grant access to our new user:

`GRANT ALL PRIVILEGES ON DATABASE fullstackChallenge TO ckl;`

Exit:

`\q`

### Setting up server

Upgrade pip:

`sudo -H pip3 install --upgrade pip`

Install virtualenv:

`sudo -H pip3 install virtualenv`

Clone the repository:

`git clone https://github.com/cheesecakelabs-cupcakers/thiago-brezinski-fullstack`

Enter server:

`cd ~/thiago-brezinski-fullstack/server`

Create the virtual environment:

`virtualenv python3-django`

Activate the virtual environment:

`source python3-django/bin/activate`

Install project requirements:

`pip install -r requirements.txt`

`pip install gunicorn`

Edit project settings:

`nano fullstackChallenge/settings.py`

Set allowed hosts and static and media variables:

```python
ALLOWED_HOSTS = ['your.server.ip', 'localhost']

STATIC_URL = '/static/'

STATIC_ROOT = '/var/www/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'media'),
]

MEDIA_URL = '/media/'

MEDIA_ROOT = '/var/www/media/'
```

Create an environment file, to secure our credentials:

`nano .env`

<b>~/thiago-brezinski-fullstack/server/.env</b>

```.env
SECRET_KEY==e+2=hz(br+9$&!(bl7rv6_3hlb6i*#1-d$vj24tikmp5tzv+g
DEBUG=False
DB_NAME=fullstackchallenge
DB_USER=ckl
DB_PASSWORD=123
DB_HOST=127.0.0.1
```

Migrate database:

`python manage.py makemigrations`

`python manage.py migrate`

Create a super user:

`python manage.py createsuperuser`

Collect static files to `STATIC_ROOT`:

`python manage.py collectstatic`

Deactivate the virtual environment:

`deactivate`

#### Creating systemd socket and service files for Gunicorn

Create and open a systemd socket file for Gunicorn with sudo privileges:

`sudo nano /etc/systemd/system/gunicorn.socket`

<b>/etc/systemd/system/gunicorn.socket</b>
```
[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target
```

Create and open a systemd service file for Gunicorn with sudo privileges. The service filename should match the socket filename with the exception of the extension:

`sudo nano /etc/systemd/system/gunicorn.service`

<b>/etc/systemd/system/gunicorn.service</b>
```
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=ckl
Group=www-data
WorkingDirectory=/home/ckl/thiago-brezinski-fullstack/server
ExecStart=/home/ckl/thiago-brezinski-fullstack/server/python3-django/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          fullstackChallenge.wsgi:application

[Install]
WantedBy=multi-user.target
```

Start and enable the Gunicorn socket. This will create the socket file at /run/gunicorn.sock now and at boot. When a connection is made to that socket, systemd will automatically start the gunicorn.service to handle it:

`sudo systemctl start gunicorn.socket`

`sudo systemctl enable gunicorn.socket`

#### Configure Nginx to proxy pass to Gunicorn

Create and open a new server block in Nginx's sites-available directory:

`sudo nano /etc/nginx/sites-available/fullstackChallenge`

<b>/etc/nginx/sites-available/fullstackChallenge</b>
```
server {
    listen 80;
    server_name your.server.ip;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        root /var/www;
    }

    location /media/ {
        root /var/www;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
    }
}
```
Replace `your.server.ip` to your actual server domain or IP.

Enable the file by linking it to the sites-enabled directory:

`sudo ln -s /etc/nginx/sites-available/fullstackChallenge /etc/nginx/sites-enabled`

Test your Nginx configuration for syntax errors by typing:

`sudo nginx -t`

If no errors are reported, go ahead and restart Nginx by typing:

`sudo systemctl restart nginx`

Finally, open up firewall to normal traffic on port 80:

`sudo ufw allow 'Nginx Full'`

### Setting up client

Install Node Version Manager:

`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash`

Add environment variables to your profile:

```
export NVM_DIR="${XDG_CONFIG_HOME/:-$HOME/.}nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Close and reopen terminal session. Test if nvm was installed successfully:

`command -v nvm`

Should output:

`nvm`

Install Node.js via NVM:

`nvm install node`

Enter client directory:

`cd ~/thiago-brezinski-fullstack/client`

Install dependencies:

`npm install`

### Running

Enter project home:

`cd ~/thiago-brezinski-fullstack`

#### Client

Create screen:

`screen -S client`

Enter client directory:

`cd client`

Run development server:

`npm run dev`

Exit screen:

`Ctrl + A + D`

#### Background-scraping task

Create screen:

`screen -S celery`

Enter server directory:

`cd server`

Start task:

`celery -A fullstackChallenge worker -l info`

Exit screen:

`Ctrl + A + D`

#### Scheduler

Create screen:

`screen -S beat`

Enter server directory:

`cd server`

Start task:

`celery -A fullstackChallenge beat`

Exit screen:

`Ctrl + A + D`

Application is now ready to access at `http://your.server.ip:5000`

## API Reference

The API is versioned using `AcceptHeaderVersioning`, which means you'll have to provide the following headers on every request:

```
{
    Accept: 'application/json; version=1.0',
    'Content-Type': 'application/json'
}
```

Currently only version 1.0 is available.

### Authentication token

Retrieves the necessary token to access `/users` endpoint.

<b>Endpoint:</b>

`POST /api-token-auth`

<b>Request body:</b>

```javascript
{
    username: "thiago",         //Django admin username
    password: "s3cr3tp4ssw0rd"  //Django admin password
}
```

<b>Response: </b>

```json
{
  "token": "072fc148e6b31cd9b6847fcbd7cfbd1a5635a874"
}
```

### Articles

Retrieves paginated articles, filtered by `subject`. 

<b>Endpoint:</b>

`GET /articles?limit=<limit>&offset=<offset>&subject=<subjectId>`

<b>Response: </b>

```json
[
    {
        "id": 1,
        "slug": "article-1",
        "title": "Article 1",
        "heroImage": "http://localhost:8000/media/heroImages/default_article.png",
        "author": {
            "name": "Thiago Brezinski",
            "picture": "http://localhost:8000/media/authorPictures/default_author.png"
        },
        "subject": {
            "id": 1,
            "name": "POLITICS",
            "color": "#D0021B"
        },
        "publishDate": "2019-03-27T19:47:58Z",
        "text": "Sample text"
    }
]
```

### Subjects

Retrieves all subjects. 

<b>Endpoint:</b>

`GET /subjects`

<b>Response: </b>

```json
[
    {
        "id": 1,
        "name": "POLITICS",
        "color": "#D0021B"
    }
]
```

### Users

Retrieves a user by `username`. 

<b>Endpoint:</b>

`GET /users/<username>`

<b>Response: </b>

```json
{
    "username": "thiago",
    "first_name": "Thiago",
    "last_name": "Brezinski",
    "email": "thiagobrez@gmail.com"
}
```

## License

MIT.
