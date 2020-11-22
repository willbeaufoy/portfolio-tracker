Web app for tracking the performance of a stocks portfolio.

Frontend: React running on AWS Amplify with Cognito auth
Backend: Django REST framework

# Dev environment setup (linux)

1. Navigate to where you want the project to live
1. `git clone git@github.com:willbeaufoy/portfolio-tracker.git`
1. `cd portfolio-tracker`

## Backend API

1. Install virtualenvwrapper and then make a virtualenv for the app using python3, e.g. `mkvirtualenv --python 3 portfolio`
1. `cd api`. Then activate the virtualenv if it's not already activated, e.g. `workon portfolio`
1. Run `pip install -r requirements.txt` to install the required backend dependencies
1. Add this line to your `.bashrc`/`.bash_aliases` etc: `export DJANGO_DEVELOPMENT=true`
1. Request an API key from [FinKi](https://finki.io/finkiAPI.html), then add `export FINKI_API_KEY='your_key'` to the same file 
1. Run `./manage.py migrate`
1. Run `./manage.py runserver`

## Frontend

1. Install `npm` if you haven't already
1. Open a new tab in your terminal, and go to the top level `client` directory (e.g. `cd ../client`)
1. Run `npm install` to install the required packages from `package.json`
1. You will need to create an extra file for authentication to work: `src/aws-exports.js`
1. Contact me for the required content of this file as it cannot be checked into version control
1. Run `npm start`
1. Navigate to http://localhost:3000

### Sync

This populates price data for instruments you have added in the backend from [FinKi](https://finki.io/). To run:

`./manage.py sync_prices`

## Tests

Backend:

`cd api`

`./manage.py test`

Frontend:

`cd client`

`npm test`
