import { React } from 'react'
import NotificationProvider from './components/notification/NotificationContext';
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <NotificationProvider>
    <App />
  </NotificationProvider>
)
