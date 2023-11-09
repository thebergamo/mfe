import { useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import { Header } from './components/Header/Header'
import { Navigation } from './components/Navigation'

function App() {
  const [count, setCount] = useState(0)
  const navlinks = [
    { label: 'MFE 1', href: '/mfe-1' },
    { label: 'MFE 2', href: '/mfe-2' },
    { label: 'MFE 3', href: '/mfe-3' },
  ]

  return (
    <div className="App">
      <Header menu={[]} />
      <Navigation pages={navlinks} />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
