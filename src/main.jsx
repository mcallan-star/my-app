//Role: Kicks it all off -- Entry point for your React app, where the React root is created and <App /> is rendered.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Tells Vite to bundle and inject your index.css
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// createRoot() finds <div id="root"></div> in index.html and creates a React root there.
//in that root, .render(<App />) puts the App component into the DOM
