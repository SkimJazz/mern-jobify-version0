import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Import this above index.css
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './index.css'

// import axios from 'axios';
// import customFetch from './utils/customFetch.js'; // Demo customFetch



// fetch('/api/v0/test')
//     .then((res) => res.json())
//     .then((data) => console.log(data));


// This is just for demonstration purposes -> Not going to be used in the App.jsx
// const data = await axios.get('/api/v0/test');
// console.log(data);

// Ref customFetch.js
// const data = await customFetch.get('/test');
// console.log(data);

ReactDOM.createRoot(document.getElementById('root')).render(
    // <>
    //     <App />
    //     <ToastContainer position='top-center' />
    // </>

    <React.StrictMode>
        <App />
        <ToastContainer position='top-center' />
    </React.StrictMode>,
);
