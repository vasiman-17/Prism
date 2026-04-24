import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import RiskMeter from './RiskMeter'
import './Results.css'

const ReviewCard = ({ title, accent, children, index }) => {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const dx = (mouseX - centerX) / centerX
    const dy = (mouseY - centerY) / centerY

    gsap.to(cardRef.current, {
      rotationX: -dy * 6,
      rotationY: dx * 6,
      duration: 0.2,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.2,
      ease: 'power2.out',
    })
  }

  return (
    <div
      ref={cardRef}
      className="review-card"
      style={{ borderLeftColor: accent }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h3 className="card-title" style={{ borderLeftColor: accent }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function Results({ data, onReset }) {
  const cardsRef = useRef(null)
  const summaryTextRef = useRef(null)
  const risksRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Animate summary text word by word
  useEffect(() => {
    if (!summaryTextRef.current) return

    const words = data.plain_summary.split(' ')
    summaryTextRef.current.innerHTML = words
      .map((word) => `<span class="summary-word">${word}</span>`)
      .join(' ')

    const wordElements = summaryTextRef.current.querySelectorAll('.summary-word')
    gsap.from(wordElements, {
      opacity: 0,
      y: 8,
      stagger: 0.03,
      duration: 0.5,
      delay: 2.7,
      ease: 'power2.out',
    })
  }, [data.plain_summary])

  // Animate risk items
  useEffect(() => {
    if (!risksRef.current) return
    const riskItems = risksRef.current.querySelectorAll('.risk-item')
    gsap.from(riskItems, {
      opacity: 0,
      y: 10,
      stagger: 0.1,
      duration: 0.6,
      delay: 3.0,
      ease: 'power2.out',
    })
  }, [data.risks])

  // Animate suggestion items
  useEffect(() => {
    if (!suggestionsRef.current) return
    const suggestionItems = suggestionsRef.current.querySelectorAll('.suggestion-item')
    gsap.from(suggestionItems, {
      opacity: 0,
      y: 10,
      stagger: 0.1,
      duration: 0.6,
      delay: 3.0,
      ease: 'power2.out',
    })
  }, [data.suggestions])

  // Animate cards
  useEffect(() => {
    if (!cardsRef.current) return
    const cards = cardsRef.current.querySelectorAll('.review-card')
    gsap.from(cards, {
      y: 50,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      delay: 2.5,
    })
  }, [])

  const scoreColor =
    data.risk_score < 30 ? '#3ecf8e' : data.risk_score < 70 ? '#f5c542' : '#ff3d00'

  return (
    <div className="results-page">
      {/* Section 1: PR Header */}
      <div className="results-header">
        <div className="header-left">
          <div className="header-label">PRISM ANALYSIS</div>
          <h1 className="header-title">{data.pr_title}</h1>
          <a href={data.pr_url} target="_blank" rel="noopener noreferrer" className="header-url">
            {data.pr_url}
          </a>
        </div>

        <div className="header-stats">
          <div className="stat-chip">{data.files_changed} FILES</div>
          <div className="stat-chip additions">+{data.additions}</div>
          <div className="stat-chip deletions">-{data.deletions}</div>
        </div>
      </div>

      {/* Section 2: Risk Meter */}
      <RiskMeter score={data.risk_score} verdict={data.verdict} />

      {/* Section 3: Review Cards */}
      <div className="cards-container" ref={cardsRef}>
        {/* Card 1: Summary */}
        <ReviewCard title="WHAT THIS PR DOES" accent="#4ecdc4" index={0}>
          <div ref={summaryTextRef} className="card-content summary-content"></div>
        </ReviewCard>

        {/* Card 2: Risks */}
        <ReviewCard title="POTENTIAL RISKS" accent="#ff3d00" index={1}>
          <div ref={risksRef} className="card-content risks-content">
            {data.risks.map((risk, idx) => (
              <div key={idx} className="risk-item">
                <span className="risk-icon">▸</span>
                <span className="risk-text">{risk}</span>
              </div>
            ))}
          </div>
        </ReviewCard>

        {/* Card 3: Suggestions */}
        <ReviewCard title="ENGINEER WOULD CHANGE" accent="#3ecf8e" index={2}>
          <div ref={suggestionsRef} className="card-content suggestions-content">
            {data.suggestions.map((sug, idx) => (
              <div key={idx} className="suggestion-item">
                <div className="suggestion-title">{sug.title}</div>
                <div className="suggestion-detail">{sug.detail}</div>
                {sug.code && (
                  <pre className="suggestion-code">
                    <code>{sug.code}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>
        </ReviewCard>

        {/* Card 4: Verdict */}
        <div className="review-card verdict-card" style={{ gridColumn: '1 / -1' }}>
          <div className="verdict-large" style={{ color: scoreColor }}>
            {data.verdict}
          </div>
          <div className="verdict-reasoning">{data.risk_reasoning || 'Analysis complete.'}</div>
        </div>
      </div>

      {/* Section 4: Bottom Bar */}
      <div className="results-footer">
        <div className="footer-brand">PRISM</div>
        <button className="reset-button" onClick={onReset}>
          ANALYZE ANOTHER PR
        </button>
      </div>
    </div>
  )
}
