import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Parse from 'parse';

// Environment Variables ထဲကနေ Key တွေကို ဆွဲထုတ်တာဖြစ်လို့ ပိုလုံခြုံသွားပါပြီ
Parse.initialize(
  process.env.REACT_APP_PARSE_APPLICATION_ID,
  process.env.REACT_APP_PARSE_JAVASCRIPT_KEY
);
Parse.serverURL = process.env.REACT_APP_PARSE_HOST_URL;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);