# Portfolio Tracker

Web app for tracking the performance of a stocks portfolio.

**Frontend**: React running on AWS Amplify with Cognito auth

**Backend**: Django REST framework

## Dev environment setup (Linux/OSX)

1. Navigate to where you want the project to live
1. `git clone git@github.com:willbeaufoy/portfolio-tracker.git`
1. `cd portfolio-tracker`

### Backend API

1. Install virtualenvwrapper and then make a virtualenv for the app using python3, e.g. `mkvirtualenv --python 3 portfolio`
1. `cd api`. Then activate the virtualenv if it's not already activated, e.g. `workon portfolio`
1. Run `pip install -r requirements.txt` to install the required backend dependencies
1. Add this line to your `.bashrc`/`.bash_aliases` etc: `export DJANGO_DEVELOPMENT=true`
1. Request an API key from [FinKi](https://finki.io/finkiAPI.html), then add `export FINKI_API_KEY='your_key'` to the same file
1. Run `./manage.py migrate`
1. Run `./manage.py runserver`

### Frontend

1. Install `npm` if you haven't already
1. Open a new tab in your terminal, and go to the top level `client` directory (e.g. `cd ../client`)
1. Run `npm install` to install the required packages from `package.json`
1. You will need to create an extra file for authentication to work: `src/aws-exports.js`
1. Contact me for the required content of this file as it cannot be checked into version control
1. Run `npm start`
1. Navigate to http://localhost:3000

## Sync

This populates price data for instruments you have added in the backend from [FinKi](https://finki.io/). To run:

`./manage.py sync_prices`

## Tests

Backend:

`cd api`

`./manage.py test`

Frontend:

`cd client`

`npm test`

## Code committing process

New code should be done in non-master branches, then pushed to GitHub for code review within a pull request
before being merged with the main branch. Here is an example process if using git on the command line:

1. Make sure the master branch is up to date with origin, then make a new branch e.g. `git checkout -b demobranch`
1. Make your changes and commit them, e.g. `git add . && git commit`.
1. Follow [this guide](https://chris.beams.io/posts/git-commit/) for writing commit messages. Unless your change
   affects the whole codebase, put the service(s) changed [API, Client, Docs] in your git commit messages, e.g.

```none
[API, Client] Add support for datetimes for trades

This allows users to...
```

```none
Add .prettierrc and reformat whole codebase
```

1. Push the branch to GitHub, setting an equivalent upstream branch at the same time: `git push -u origin demobranch`
1. Go to your new branch in GitHub, e.g. https://github.com/willbeaufoy/portfolio-tracker/tree/demobranch/
1. Click the 'Compare & pull request' button and create a pull request
1. Click Reviewers and add willbeaufoy
1. If changes are required, willbeaufoy will comment on the pull request:
   1. Make these changes by either amending your commit or adding another commit. Amend if it's a small fix to what you've already done,
      make a new commit if it's different functionality.
   1. Then push to GitHub again.
1. Once your change is ready, willbeaufoy will approve it and merge it into master

## Style guide

### General

#### Indentation

Use spaces not tabs for indentation. Use a tab width of 2 for HTML, TS and JS, and 4 for Python.

### Python

Follow the [Django Coding style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/) guide.

### TypeScript+JavaScript

#### Function declarations vs function expressions

When creating a named function, use function declarations not function expressions, as function declarations
take up less space, and make it clearer that it is a function not another type of variable.

```ts
# Yes
function myFunc() {}
# No
const myFunc = () => {}
```
