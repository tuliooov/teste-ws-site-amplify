import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './global.css';
import * as Sentry from "@sentry/react";

// import { registerServiceWorker } from './serviceWorker'

// registerServiceWorker();
if( !(localStorage.getItem('teste') || (window.location.hostname).includes('localhost')) ){
        console.log = function() {};
}

Sentry.init({ dsn: "https://e2625ab3f53645f591e434b8559d16f5@o436862.ingest.sentry.io/5398602" });

ReactDOM.render(
        <App />, 
        document.getElementById('root')
);