import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import './Hero.css'

export default function Hero({ onAnalyze, onError }) {
  const [url, setUrl] = useState('')

  // Refs for GSAP animations
  const heroRef = useRef(null)
  const tagRef = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const subtitleRef = useRef(null)
  const inputRowRef = useRef(null)
  const statsRef = useRef(null)
  const inputRef = useRef(null)

  // GSAP timeline animation on mount
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from(tagRef.current, { y: 20, opacity: 0, duration: 0.6, delay: 0.3 })
        .from(line1Ref.current, { y: 80, opacity: 0, duration: 0.9, ease: 'power4.out' }, '-=0.2')
        .from(line2Ref.current, { y: 80, opacity: 0, duration: 0.9, ease: 'power4.out' }, '-=0.7')
        .from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from(inputRowRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
        .from(statsRef.current, { y: 10, opacity: 0, duration: 0.5 }, '-=0.2')
    }, heroRef);
    
    return () => ctx.revert(); // clean up to fix StrictMode bug!
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation: check for github.com and /pull/
    if (!url.includes('github.com') || !url.includes('/pull/')) {
      if (onError) onError('Invalid GitHub PR URL. Must contain github.com and /pull/')
      
      // Shake animation
      gsap.to(inputRef.current, {
        x: [-8, 8, -6, 6, -4, 4, 0],
        duration: 0.4,
      })

      // Flash border red
      gsap.to(inputRef.current, {
        borderColor: '#ff3d00',
        duration: 0.2,
      })
      gsap.to(inputRef.current, {
        borderColor: '#1e1e1e',
        duration: 0.2,
        delay: 0.2,
      })
      return
    }

    // Valid URL - call onAnalyze
    onAnalyze(url)
  }

  return (
    <div className="hero-container" ref={heroRef}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo">
            <span className="logo-pr">PR</span>
            <span className="logo-ism">ism</span>
            <div className="logo-dot"></div>
          </div>
        </div>

        <div className="navbar-right">
          <a href="#" className="nav-link">DOCS</a>
          <a href="#" className="nav-link">GITHUB</a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="hero-content">
        {/* Tag Label */}
        <div ref={tagRef} className="tag-label">
          <span>AI-POWERED CODE REVIEW</span>
        </div>

        {/* Main Title */}
        <div className="title-container">
          <h1 ref={line1Ref} className="title-line">
            YOUR CODE.
          </h1>
          <h1 ref={line2Ref} className="title-line title-line-2">
            REVIEWED.
          </h1>
        </div>

        {/* Subtitle */}
        <p ref={subtitleRef} className="subtitle">
          Paste any GitHub PR link. Get a senior engineer's full review in seconds. Free.
        </p>

        {/* Input Row */}
        <form ref={inputRowRef} className="input-row" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="https://github.com/owner/repo/pull/123"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="hero-input"
          />
          <button type="submit" className="hero-button" data-cursor="pointer">
            ANALYZE →
          </button>
        </form>

        {/* Stats */}
        <div ref={statsRef} className="stats-row">
          <div className="stat">2.3K+ PRs Analyzed</div>
          <div className="stat-dot"></div>
          <div className="stat">&lt; 8s Average Review Time</div>
          <div className="stat-dot"></div>
          <div className="stat">Works on Any Public Repo</div>
        </div>
      </div>
    </div>
  )
}
