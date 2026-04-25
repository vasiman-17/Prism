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
  const apiDataRef = useRef(null)

  const ESTIMATED_SECONDS = 7
  const MINIMUM_TIME = 3000

  useEffect(() => { apiDataRef.current = apiData }, [apiData])

  // Initialize code rain streams — spaced 200px apart for readability
  const initializeStreams = () => {
    const streams = []
    const spacing = 200
    const count = Math.floor(window.innerWidth / spacing)
    for (let i = 0; i < count; i++) {
      streams.push({
        x: i * spacing + Math.random() * 40,
        y: Math.random() * -300,
        lineIndex: Math.floor(Math.random() * CODE_LINES.length),
        speed: Math.random() * 0.8 + 0.6,
        opacity: Math.random() * 0.3 + 0.2,
      })
    }
    streamsRef.current = streams
  }

  useEffect(() => {
    const newParticles = []
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 4 + Math.random() * 4
      })
    }
    setParticles(newParticles)
  }, [])

  const [dataStreams, setDataStreams] = useState([])
  useEffect(() => {
    const streams = []
    for (let i = 0; i < 8; i++) {
      streams.push({
        id: i,
        left: (i / 8) * 100,
        animationDelay: Math.random() * 2,
        animationDuration: 1.5 + Math.random() * 1.5
      })
    }
    setDataStreams(streams)
  }, [])

  const handleCompletion = useCallback(() => {
    const currentData = apiDataRef.current
    if (scannerRef.current) {
      gsap.to(scannerRef.current, { scale: 0, opacity: 0, duration: 0.3 })
    }
    const flashDiv = document.createElement('div')
    flashDiv.style.cssText = 'position:fixed;inset:0;background:white;opacity:0;z-index:200;pointer-events:none;'
    document.body.appendChild(flashDiv)
    gsap.to(flashDiv, {
      opacity: 1, duration: 0.08,
      onComplete: () => {
        gsap.to(flashDiv, {
          opacity: 0, duration: 0.08,
          onComplete: () => { if (flashDiv.parentNode) flashDiv.parentNode.removeChild(flashDiv) }
        })
      }
    })
    if (wrapperRef.current) {
      gsap.to(wrapperRef.current, { x: [-10, 10, -8, 8, -5, 5, 0], duration: 0.4 })
    }
    setTimeout(() => { setProgress(100); onComplete(currentData) }, 500)
  }, [onComplete])

  useEffect(() => {
    initializeStreams()
    const fetchPRData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const response = await fetch(`${apiUrl}/api/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pr_url: prUrl }),
        })
        const data = await response.json()
        setApiData(data.success ? data : { success: false, error: data.error })
      } catch (error) {
        console.error('API error:', error)
        setApiData({ success: false, error: error.message })
      } finally {
        setApiDone(true)
      }
    }
    fetchPRData()
  }, [prUrl])

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

  // Canvas code rain — DPI-aware for crisp text
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.scale(dpr, dpr)

    let rafId
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
      ctx.fillRect(0, 0, w, h)
      streamsRef.current.forEach((stream) => {
        ctx.font = 'bold 13px Courier New'
        ctx.fillStyle = `rgba(255, 61, 0, ${stream.opacity})`
        ctx.fillText(CODE_LINES[stream.lineIndex], stream.x, stream.y)
        stream.y += stream.speed
        if (stream.y > h + 20) {
          stream.y = -30
          stream.lineIndex = (stream.lineIndex + 1) % CODE_LINES.length
        }
      })
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const rawProgress = (elapsed / 1000 / ESTIMATED_SECONDS) * 100
      let newProgress = Math.min(rawProgress, 94)
      setProgress(Math.floor(newProgress))
      if (apiDone && newProgress >= 94 && elapsed >= MINIMUM_TIME) {
        clearInterval(progressInterval)
        handleCompletion()
      }
    }, 50)
    return () => clearInterval(progressInterval)
  }, [apiDone, handleCompletion])

  return (
    <div ref={wrapperRef} className="scan-animation-wrapper">
      <div className="scan-bg"></div>
      <div className="grid-overlay"></div>
      <div className="hexagon-pattern"></div>
      <div className="scan-line"></div>

      <canvas ref={canvasRef} className="code-rain-canvas"></canvas>

      <div className="particles-container">
        {particles.map((p) => (
          <div key={p.id} className="floating-particle" style={{
            left: `${p.left}%`, bottom: '0',
            animationDelay: `${p.animationDelay}s`,
            animationDuration: `${p.animationDuration}s`
          }} />
        ))}
      </div>

      {dataStreams.map((s) => (
        <div key={s.id} className="data-stream" style={{
          left: `${s.left}%`,
          animationDelay: `${s.animationDelay}s`,
          animationDuration: `${s.animationDuration}s`
        }} />
      ))}

      {/* Center scanner — percentage INSIDE rings */}
      <div ref={scannerRef} className="scanner-center">
        <div className="ring-wrapper">
          <svg className="scanner-rings" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="140" stroke="#ff3d00" strokeWidth="2" fill="none" opacity="0.8" className="ring-outer" />
            <circle cx="150" cy="150" r="110" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeDasharray="30 10" className="ring-inner" />
            <circle cx="150" cy="150" r="80" stroke="#ff3d00" strokeWidth="1" fill="none" opacity="0.5" strokeDasharray="15 15" className="ring-outer" style={{ animationDelay: '0.5s' }} />
          </svg>
          {/* Percentage centered inside the rings */}
          <div className="progress-inside">
            <div className="progress-number">{progress}%</div>
            <div className="progress-label">ANALYZING</div>
          </div>
        </div>

        <div className="pr-info">
          {prUrl.substring(0, 50)}
          {prUrl.length > 50 ? '...' : ''}
        </div>
      </div>

      <div ref={statusRef} className="status-text">{statusText}</div>
    </div>
  )
}
