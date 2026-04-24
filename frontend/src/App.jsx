import { useState, useRef } from 'react'
import ParticleField from './components/ParticleField'
import CustomCursor from './components/CustomCursor'
import Hero from './components/Hero'
import ScanAnimation from './components/ScanAnimation'
import Results from './components/Results'
import './App.css'

function App() {
  const [state, setState] = useState('landing')
  const [prUrl, setPrUrl] = useState('')
  const [analysisData, setAnalysisData] = useState(null)
  const [error, setError] = useState(null)

  const apiPromiseRef = useRef(null)

  const handleAnalyze = (url) => {
    setPrUrl(url)
    setState('scanning')

    // Create the API promise and store it
    const apiPromise = fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pr_url: url }),
    })
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          setError(data.error || 'Failed to analyze PR')
          setState('landing')
          return null
        }
        return data
      })
      .catch(err => {
        setError('Error connecting to backend. Make sure the server is running on http://localhost:5000')
        setState('landing')
        return null
      })

    apiPromiseRef.current = apiPromise
  }

  const handleScanComplete = (data) => {
    setAnalysisData(data)
    setState('results')
  }

  const handleReset = () => {
    setState('landing')
    setPrUrl('')
    setAnalysisData(null)
    setError(null)
  }

  return (
    <div className="app">
      {/* Layer 0: Background Particles */}
      <ParticleField />

      {/* Layer 1: Main Content */}
      <div className="content">
        {state === 'landing' && (
          <Hero onAnalyze={handleAnalyze} error={error} />
        )}

        {state === 'scanning' && (
          <ScanAnimation
            prUrl={prUrl}
            apiCall={apiPromiseRef.current}
            onComplete={handleScanComplete}
          />
        )}

        {state === 'results' && analysisData && (
          <Results data={analysisData} onReset={handleReset} />
        )}
      </div>

      {/* Layer 99998+: Custom Cursor (renders last, highest z-index) */}
      <CustomCursor />
    </div>
  )
}

export default App

