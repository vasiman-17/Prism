import { useState, useRef, useEffect, useCallback } from 'react'
import ParticleField from './components/ParticleField'
import CustomCursor from './components/CustomCursor'
import Hero from './components/Hero'
import ScanAnimation from './components/ScanAnimation'
import Results from './components/Results'
import Toast from './components/Toast'
import gsap from 'gsap'
import './App.css'

function App() {
  const [internalState, setInternalState] = useState('landing')
  const [prUrl, setPrUrl] = useState('')
  const [analysisData, setAnalysisData] = useState(null)
  
  const [toast, setToast] = useState(null) // { message, type }
  const pageRef = useRef(null)

  // Incoming page animation
  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(pageRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      )
    }
  }, [internalState])

  const handleAnalyze = (url) => {
    setPrUrl(url)
    setInternalState('scanning')
  }

  const handleScanComplete = (data) => {
    if (!data || !data.success) {
      setToast({ message: data?.error || 'API failed to analyze PR.', type: 'error' })
      setInternalState('landing')
      return
    }
    
    setAnalysisData(data)
    setToast({ message: 'Analysis complete', type: 'success' })
    setInternalState('results')
  }

  const handleReset = () => {
    setInternalState('landing')
    setPrUrl('')
    setAnalysisData(null)
  }

  const handleError = (msg) => {
    setToast({ message: msg, type: 'error' })
  }

  // Stable callback for toast close to avoid re-render loops
  const handleToastClose = useCallback(() => {
    setToast(null)
  }, [])

  return (
    <div className="app">
      {/* Layer 0: Background Particles */}
      <ParticleField />

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={handleToastClose} 
        />
      )}

      {/* Layer 1: Main Content */}
      <div className="content">
        <div ref={pageRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
          {internalState === 'landing' && (
            <Hero onAnalyze={handleAnalyze} onError={handleError} />
          )}

          {internalState === 'scanning' && (
            <ScanAnimation
              prUrl={prUrl}
              onComplete={handleScanComplete}
            />
          )}

          {internalState === 'results' && (
            <Results data={analysisData} onReset={handleReset} />
          )}
        </div>
      </div>

      {/* Layer 99998+: Custom Cursor (renders last, highest z-index) */}
      <CustomCursor />
    </div>
  )
}

export default App
