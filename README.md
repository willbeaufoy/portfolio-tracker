Web app for tracking the performance of a stocks portfolio.

Frontend: React running on AWS Amplify with Cognito auth
Backend: Django REST framework running on AWS Elastic Beanstalk

# Dev environment setup

1. `git clone git@github.com:willbeaufoy/portfolio-tracker.git`
1. `cd portfolio-tracker`

## Backend API

1. Install virtualenvwrapper and make a virtualenv for the app using python3, e.g. `mkvirtualenv --python 3 portfolio`
1. `cd api`. Then activate the virtualenv if you haven't already, e.g. `workon portfolio`
1. `pip install -r requirements.txt`
1. `./manage.py migrate`
1. `./manage.py runserver`

## Frontend

1. Install `npm` if you haven't already
1. Open a new tab, and go to the client directory
1. `npm install` (to install the required packages from `package.json`)
1. `npm start`

# Current limitations

Ticker symbols inputted by the user must exactly match those found on the [marketstack API](https://marketstack.com/search),
e.g. AAPL for Apple, or TSCO.XLON for Tesco, otherwise we cannot fetch prices. In future we want to convert this input to
an autocomplete to prevent user error.
