# OrdSys

OrdSys is a web application designed to create, display, and manage order tickets for use in the kitchen and bar during
various events held by the Uppsala Union of Engineering and Science Students. It is written in Python3 and Javascript 
using Django and PostgreSQL for the backend and React & Bootstrap for the frontend. 

![OrdSys Front Page](https://i.imgur.com/USQ3IQw.png)

## Requirements

The application requires Python (version 3.6 or greater), Node.js, and PostgreSQL to be installed on your system.

## Installation

To begin, clone the repo and open the repository folder in your terminal.

### Backend

We recommend running the backend in a Python virtual environment. 

#### Creating a Python Virtual Environment

##### MacOS/Linux
1. Create a new virtual environment with `$ python3 -m venv venv`.
2. Enter the virtual environment with `$ source venv/bin/activate`
(or `$ source venv/bin/activate.fish` if you are using fish).
3. In the virtual environment, install the required Python dependencies with `(venv) $ pip install -r requirements.txt`.
<br>If you are experiencing issues with installing 'psycopg2', ensure you fulfill the prerequisites specified in [the
official documentation](https://www.psycopg.org/docs/install.html#build-prerequisites).

##### Windows
1. Make sure you have the `virtualenv` and `virtualenvwrapper-win` packages installed on your system.
If you don't, install them using `$ pip install virtualenv` or `$ pip install virtualenvwrapper-win`.
2. Create a new virtual environment with `$ mkvirtualenv venv`. This will create a virtual environment called `venv` 
and automatically enter it.
3. Install the required Python dependencies with `(venv) $ pip install -r requirements.txt`.
If the versions are mis-matched, you may have to install each package of `requirements.txt` manually.

### Setting up the database

Create and configure a PostgreSQL database for the application. <br>
In the project's root folder, create a file called `.env`. Into your `.env` file, enter:

```
SECRET_KEY = ...
DEBUG = True # Change this to False when deploying to production!
DB_NAME = ...
DB_USER = ...
DB_PASSWORD = ...
DB_HOST = ...
DB_PORT = ... # Usually 5432
```

A secret key is generated using Django. To do so, follow these steps while in the virtual environment:

1. Enter the a Python shell with `(venv) $ python`
2. Generate a key with these commands:
```python
>>> from django.core.management.utils import get_random_secret_key
>>> get_random_secret_key()
>>> exit()
```

This will generate a secret key and output it in the terminal.

#### Connect backend and database

1. To connect and create all required database tables, enter `(venv) $ python ./manage.py makemigrations`
followed by `(venv) $ python ./manage.py migrate`.

#### Running the backend

1. Make sure you're in your virtual environment. If not, enter it using `$ source venv/bin/activate`
2. Start the server by typing `(venv) $ python ./manage.py runserver`.

The backend can now be accessed at http://localhost:8000/.

### Frontend

1. `cd` to `frontend/`
2. Install the required dependencies using either `$ npm install` or `$ yarn install`.
3. Run the frontend using `$ npm start` or `$ yarn start`. It should automatically open in your web browser. If not,
you can open your web browser and browse to http://localhost:3000/.

__Note__: Running the frontend with `start` launches it in development mode. To build and deploy to a production
environment, use `$ npm run build` or `$ yarn build`, and follow the appropriate steps at the
[official guide](https://create-react-app.dev/docs/deployment/).
