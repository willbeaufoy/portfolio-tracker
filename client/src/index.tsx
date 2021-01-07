import './index.css';

import Amplify from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

if (process.env.NODE_ENV === 'development') {
  const {worker} = require('./mocks/browser');
  worker.start();
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
