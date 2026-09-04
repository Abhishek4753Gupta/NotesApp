import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthProvider from './context/AuthContext.jsx'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import {Toaster} from 'react-hot-toast'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
        <Toaster position='top-center' reverseOrder={false} />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
