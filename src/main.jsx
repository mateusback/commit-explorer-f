import { React } from 'react'
import NotificationProvider from './components/notification/NotificationContext';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </BrowserRouter>

)
