Web app for tracking the performance of a stocks portfolio.

Frontend: React running on AWS Amplify with Cognito auth
Backend: Django REST framework

# Dev environment setup

1. Navigate to where you want the project to live
1. `git clone git@github.com:willbeaufoy/portfolio-tracker.git`
1. `cd portfolio-tracker`

## Backend API

1. Install virtualenvwrapper and make a virtualenv for the app using python3, e.g. `mkvirtualenv --python 3 portfolio`
1. `cd api`. Then activate the virtualenv if you haven't already, e.g. `workon portfolio`
1. `pip install -r requirements.txt`
1. Add this line to your `.bashrc`/`.bash_aliases` etc: `export DJANGO_DEVELOPMENT=true`
1. `./manage.py migrate`
1. `./manage.py runserver`

### Sync

This populates price data in the backend from [FinKi](https://finki.io/). To run:

`./manage.py sync_prices`

## Frontend

1. Install `npm` if you haven't already
1. Open a new tab, and go to the `client` directory
1. `npm install` (to install the required packages from `package.json`)
1. You will need to create three extra files, `src/aws-exports.js`, `.env.development.local`, and `.env.test.local`.
   Contact me for the required content of these files.
1. `npm start`
1. Navigate to http://localhost:3000

## Tests

Backend:
`./manage.py test`

Frontend:
`npm test`
