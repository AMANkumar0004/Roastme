import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      theme="dark"
      toastStyle={{
        fontFamily: 'Space Mono, monospace',
        fontSize: '0.8rem',
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        color: '#f0f0f0',
      }}
    />
    <App />
  </>
)