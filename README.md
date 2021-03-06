# Portfolio Tracker

Web app for tracking the performance of a stocks portfolio.

**Frontend**: React running on AWS Amplify with Cognito auth

**Backend**: Django REST framework

## Dev environment setup (Linux/OSX)

1. Navigate to where you want the project to live
1. `git clone git@github.com:willbeaufoy/portfolio-tracker.git`
1. `cd portfolio-tracker`

### Backend API

1. Make sure you have python3.8 installed
1. Enter the `api` directory and create a virtualenv, then activate it and install requirements:

   ```shell
   cd api
   python3.8 -m venv .venv
   . .venv/bin/activate
   pip install -r requirements.txt
   ```

1. Make an `.env` file and put `DEBUG=True` in it. This will turn on debug mode in the Django settings file.
1. Request an API key from [FinKi](https://finki.io/finkiAPI.html), then add `FINKI_API_KEY=your_key` to `.env` as well
1. Ask Will for the Marketstack API key, and add it to `.env`, e.g. `MARKETSTACK_API_KEY=key`
1. Run `./manage.py migrate`
1. Run `./manage.py runserver`

### Frontend

1. Install `npm` if you haven't already. Note, we use `npm` not `yarn` in this project.
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

### Code editor

If you have no strong editor preference then use VS Code, and make sure the following extensions are installed:

- Django
- ESLint
- markdownlint
- Prettier
- Pylance
- Python
- Python-autopep8
- TypeScript Import Sorter

These provide linting and code formatting so the project has a consistent style. The file `.vscode/settings.json` ensures
they are configured correctly. If you want to use another editor you'll need to make sure it can apply the same formatting rules.

## Code committing process

New code should be done in non-master branches, then pushed to GitHub for code review within a pull request
before being merged with the main branch. Here is an example process if using git on the command line:

1. Make sure the master branch is up to date with origin, then make a new branch e.g. `git checkout -b demobranch`
1. Make your changes and commit them, e.g. `git add . && git commit`.
1. Follow [this guide](https://chris.beams.io/posts/git-commit/) for writing commit messages, and:

   - Unless your change affects the whole codebase, put the service(s) changed [API, Client, Docs]
     in the message
   - If your code fixes a bug, put (fix #bugnum) at the end of the message

   ```none
   [API, Client] Add support for datetimes for trades (fix #12)

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
   1. Make sure to respond to all comments before sending it back for review, even if it's just to say why you won't be doing anything
      about a comment right now.
   1. Make sure you have no merge conflicts.
   1. Once you are happy with your changes, request review again.
1. Once your change is ready, willbeaufoy will approve it and merge it into master

## Style guide

### General

#### Indentation

Use spaces not tabs for indentation. Use a tab width of 2 for HTML, TS and JS, and 4 for Python.

### Python

Follow the [Django Coding style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/) guide.

### TypeScript+JavaScript

#### Exports

Use named exports where you can i.e. `export MyComponent` not `export default MyComponent`.
Default exports have no benefit for us and using named ones promotes consistency and clarity.

#### Function declarations vs function expressions

When creating a named function, use function declarations not function expressions, as function declarations
take up less space, and make it clearer that it is a function not another type of variable.

```ts
# Yes
function myFunc() {}
# No
const myFunc = () => {}
```
