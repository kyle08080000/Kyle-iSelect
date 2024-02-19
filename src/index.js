import React from 'react';
import ReactDOM from 'react-dom/client';
import './sass/all.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { HashRouter } from 'react-router-dom';
import { store } from './store';
import { Provider } from 'react-redux';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const root = ReactDOM.createRoot(document.getElementById('root'));
// basename={process.env.PUBLIC_URL}
root.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
