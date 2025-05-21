import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <h1 className="text-4xl font-bold text-brand">Hello Tailwind v4!</h1>
        <button className="btn-primary mt-6">Click me</button>
      </div>
    </>
  )
}

export default App
