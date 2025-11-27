// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import AuthProvider from './context/AuthContext'; 
import App from './App'; 

const rootElement = document.getElementById('root'); 
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider> 
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);