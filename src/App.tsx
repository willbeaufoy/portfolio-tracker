import React from 'react';
import './App.css';
import HoldingForm from './HoldingForm';
import {withAuthenticator} from '@aws-amplify/ui-react';

function App() {
  return (
    <div className="App">
      <header className="App-header">Portfolio Tracker</header>
      <HoldingForm></HoldingForm>
    </div>
  );
}

export default withAuthenticator(App);
