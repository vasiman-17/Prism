import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import './ScanAnimation.css'

const CODE_LINES = [
  "const authenticate = async (req, res) => {",
  "  if (!req.headers.authorization) return res.status(401);",
  "  const token = req.headers.authorization.split(' ')[1];",
  "  const decoded = jwt.verify(token, process.env.SECRET);",
  "  const user = await User.findById(decoded.id);",
  "  if (!user) throw new Error('User not found');",
  "app.use('/api', authMiddleware, router);",
  "router.post('/analyze', async (req, res) => {",
  "  const { prUrl } = req.body;",
  "  const prData = await fetchPRDiff(prUrl);",
  "  const review = await generateReview(prData);",
  "  res.json({ success: true, ...review });",
  "const schema = new mongoose.Schema({",
  "  userId: { type: ObjectId, ref: 'User' },",
  "  prUrl: { type: String, required: true },",
  "  riskScore: { type: Number, min: 0, max: 100 },",
  "  createdAt: { type: Date, default: Date.now }",
  "useEffect(() => { fetchData(); }, [prUrl]);",
  "const [data, setData] = useState(null);",
  "const response = await axios.post('/api/analyze',",
  "  { prUrl }, { timeout: 30000 });",
  "if (response.data.success) {",
  "  setAnalysisData(response.data);",
  "  setPhase('results');",
  "git diff HEAD~1 HEAD --stat",
  "npm run build && vercel deploy --prod",
  "const riskScore = calculateRisk(diffStats);",
  "return score > 70 ? 'DANGER' : 'SAFE';",
  "async function parsePRDiff(url) {",
  "  const match = url.match(/pull\\/(\\d+)/);",
  "  const prNumber = match[1];",
  "  return await github.pulls.get({ prNumber });",
  "Object.keys(files).forEach(file => {",
  "  if (file.endsWith('.env')) flagSecurity();",
  "  if (additions > 500) flagComplexity();",
]

export default function ScanAnimation({ prUrl, onComplete }) {
  const [progress, setProgress] = useState(0)
  const [apiDone, setApiDone] = useState(false)
  const [apiData, setApiData] = useState(null)
  const [statusText, setStatusText] = useState('FETCHING PR DATA...')
  const [particles, setParticles] = useState([])

  const canvasRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const streamsRef = useRef([])
  const scannerRef = useRef(null)
  const statusRef = useRef(null)
  const wrapperRef = useRef(null)
  // Ref to hold the latest apiData so the completion callback always sees it
  const apiDataRef = useRef(null)

  const ESTIMATED_SECONDS = 7
  const MINIMUM_TIME = 3000 // 3 seconds

  // Keep apiDataRef in sync with apiData state
  useEffect(() => {
    apiDataRef.current = apiData
  }, [apiData])

  // Initialize code rain streams
  const initializeStreams = () => {
    const streams = []
    for (let i = 0; i < 20; i++) {
      streams.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -200,
        lineIndex: Math.floor(Math.random() * CODE_LINES.length),
        speed: Math.random() * 1.3 + 1.2,
        opacity: Math.random() * 0.4 + 0.3,
      })
    }
    streamsRef.current = streams
  }

  // Initialize floating particles
  useEffect(() => {
    const particleCount = 15
    const newParticles = []
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 4 + Math.random() * 4
      })
    }
    setParticles(newParticles)
  }, [])

  // Initialize data streams
  const [dataStreams, setDataStreams] = useState([])
  useEffect(() => {
    const streamCount = 8
    const streams = []
    for (let i = 0; i < streamCount; i++) {
      streams.push({
        id: i,
        left: (i / streamCount) * 100,
        animationDelay: Math.random() * 2,
        animationDuration: 1.5 + Math.random() * 1.5
      })
    }
    setDataStreams(streams)
  }, [])

  // Memoized completion handler that reads from ref to avoid stale closure
  const handleCompletion = useCallback(() => {
    const currentData = apiDataRef.current

    // 1. Scale center elements to 0
    if (scannerRef.current) {
      gsap.to(scannerRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
      })
    }

    // 2. White flash
    const flashDiv = document.createElement('div')
    flashDiv.style.cssText = `
      position: fixed;
      inset: 0;
      background: white;
      opacity: 0;
      z-index: 200;
      pointer-events: none;
    `
    document.body.appendChild(flashDiv)

    gsap.to(flashDiv, {
      opacity: 1,
      duration: 0.08,
      onComplete: () => {
        gsap.to(flashDiv, {
          opacity: 0,
          duration: 0.08,
          onComplete: () => {
            // Clean up the flash div from the DOM
            if (flashDiv.parentNode) {
              flashDiv.parentNode.removeChild(flashDiv)
            }
          },
        })
      },
    })

    // 3. Screen shake
    if (wrapperRef.current) {
      gsap.to(wrapperRef.current, {
        x: [-10, 10, -8, 8, -5, 5, 0],
        duration: 0.4,
      })
    }

    // 4. Call onComplete after delay
    setTimeout(() => {
      setProgress(100)
      onComplete(currentData)
    }, 500)
  }, [onComplete])

  // Setup and fetch PR data
  useEffect(() => {
    initializeStreams()

    // Fetch PR data from API
    const fetchPRData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        
        const response = await fetch(`${apiUrl}/api/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pr_url: prUrl }),
        })
        
        const data = await response.json()
        
        if (data.success) {
          setApiData(data)
        } else {
          setApiData({ success: false, error: data.error })
        }
      } catch (error) {
        console.error('API error:', error)
        setApiData({ success: false, error: error.message })
      } finally {
        setApiDone(true)
      }
    }

    fetchPRData()
  }, [prUrl])

  // Update status text based on elapsed time
  useEffect(() => {
    const statusTimer = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000

      if (elapsed < 1) setStatusText('FETCHING PR DATA...')
      else if (elapsed < 3) setStatusText('READING DIFF...')
      else if (elapsed < 5) setStatusText('AI ANALYSIS IN PROGRESS...')
      else setStatusText('GENERATING REVIEW...')
    }, 500)

    return () => clearInterval(statusTimer)
  }, [])

  // Canvas code rain animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let rafId;

    const animate = () => {
      // Clear canvas with slight fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw each stream
      streamsRef.current.forEach((stream) => {
        ctx.font = '11px Courier New'
        ctx.fillStyle = `rgba(255, 61, 0, ${stream.opacity})`
        ctx.fillText(CODE_LINES[stream.lineIndex], stream.x, stream.y)

        // Move stream down
        stream.y += stream.speed

        // Reset if off screen
        if (stream.y > canvas.height + 20) {
          stream.y = -50
          stream.lineIndex = (stream.lineIndex + 1) % CODE_LINES.length
          stream.x += (Math.random() - 0.5) * 100
        }
      })

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Progress and completion logic
  useEffect(() => {
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const rawProgress = (elapsed / 1000 / ESTIMATED_SECONDS) * 100

      // Cap at 94% until API responds
      let newProgress = Math.min(rawProgress, 94)
      setProgress(Math.floor(newProgress))

      // Check if we should complete
      if (apiDone && newProgress >= 94 && elapsed >= MINIMUM_TIME) {
        clearInterval(progressInterval)
        handleCompletion()
      }
    }, 50)

    return () => clearInterval(progressInterval)
  }, [apiDone, handleCompletion])

  return (
    <div ref={wrapperRef} className="scan-animation-wrapper">
      {/* Layer 1: Animated background */}
      <div className="scan-bg"></div>
      
      {/* Layer 2: Grid overlay */}
      <div className="grid-overlay"></div>
      
      {/* Layer 3: Hexagon pattern */}
      <div className="hexagon-pattern"></div>
      
      {/* Layer 4: Scan line */}
      <div className="scan-line"></div>

      {/* Layer 5: Code rain canvas */}
      <canvas
        ref={canvasRef}
        className="code-rain-canvas"
      ></canvas>
      
      {/* Layer 6: Floating particles */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="floating-particle"
            style={{
              left: `${particle.left}%`,
              bottom: '0',
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`
            }}
          />
        ))}
      </div>
      
      {/* Layer 7: Data streams */}
      {dataStreams.map((stream) => (
        <div
          key={stream.id}
          className="data-stream"
          style={{
            left: `${stream.left}%`,
            animationDelay: `${stream.animationDelay}s`,
            animationDuration: `${stream.animationDuration}s`
          }}
        />
      ))}

      {/* Layer 8: Center scanner */}
      <div ref={scannerRef} className="scanner-center">
        <svg className="scanner-rings" viewBox="0 0 300 300">
          {/* Outer ring */}
          <circle
            cx="150"
            cy="150"
            r="140"
            stroke="#ff3d00"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
            className="ring-outer"
          />
          {/* Middle ring */}
          <circle
            cx="150"
            cy="150"
            r="110"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="30 10"
            className="ring-inner"
          />
          {/* Inner ring */}
          <circle
            cx="150"
            cy="150"
            r="80"
            stroke="#ff3d00"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
            strokeDasharray="15 15"
            className="ring-outer"
            style={{ animationDelay: '0.5s' }}
          />
        </svg>

        <div className="progress-content">
          <div className="progress-number">{progress}%</div>
          <div className="progress-label">ANALYZING</div>
        </div>

        <div className="pr-info">
          {prUrl.substring(0, 50)}
          {prUrl.length > 50 ? '...' : ''}
        </div>
      </div>

      {/* Layer 9: Status text */}
      <div ref={statusRef} className="status-text">
        {statusText}
      </div>
    </div>
  )
}
