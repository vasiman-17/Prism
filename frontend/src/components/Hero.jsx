import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import './Hero.css'

export default function Hero({ onAnalyze, onError }) {
  const [url, setUrl] = useState('')

  const heroRef = useRef(null)
  const tagRef = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const subtitleRef = useRef(null)
  const inputRowRef = useRef(null)
  const statsRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from(tagRef.current, { y: 20, opacity: 0, duration: 0.6, delay: 0.3 })
        .from(line1Ref.current, { y: 80, opacity: 0, duration: 0.9, ease: 'power4.out' }, '-=0.2')
        .from(line2Ref.current, { y: 80, opacity: 0, duration: 0.9, ease: 'power4.out' }, '-=0.7')
        .from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from(inputRowRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
        .from(statsRef.current, { y: 10, opacity: 0, duration: 0.5 }, '-=0.2')
    }, heroRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url.includes('github.com') || !url.includes('/pull/')) {
      if (onError) onError('Invalid GitHub PR URL. Must contain github.com and /pull/')
      gsap.to(inputRef.current, { x: [-8, 8, -6, 6, -4, 4, 0], duration: 0.4 })
      gsap.to(inputRef.current, { borderColor: '#ff3d00', duration: 0.2 })
      gsap.to(inputRef.current, { borderColor: '#1e1e1e', duration: 0.2, delay: 0.4 })
      return
    }
    onAnalyze(url)
  }

  return (
    <div className="hero-container" ref={heroRef}>


      {/* Hero Content */}
      <div className="hero-content">
        {/* Tag Label — lines on each side, no background */}
        <div ref={tagRef} className="tag-label">
          <span>AI-POWERED CODE REVIEW</span>
        </div>

        {/* Main Title */}
        <div className="title-container">
          <h1 ref={line1Ref} className="title-line">YOUR CODE.</h1>
          <h1 ref={line2Ref} className="title-line title-outline">REVIEWED.</h1>
        </div>

        {/* Subtitle — clean text, no dots */}
        <p ref={subtitleRef} className="subtitle">
          Paste any GitHub PR link. Get a senior engineer&#39;s full review in seconds. Free.
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

        {/* Stats — clean separators, no bullet dots */}
        <div ref={statsRef} className="stats-row">
          <span className="stat">2.3K+ PRs Analyzed</span>
          <span className="stat-line"></span>
          <span className="stat">Under 8s Average</span>
          <span className="stat-line"></span>
          <span className="stat">Any Public Repo</span>
        </div>
      </div>
    </div>
  )
}
