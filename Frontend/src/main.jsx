import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './Context/contextApi.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
 <UserProvider>
 

    <App />
 
 </UserProvider>
  </StrictMode>,
)