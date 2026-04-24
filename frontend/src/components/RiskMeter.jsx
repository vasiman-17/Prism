import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import './RiskMeter.css'

export default function RiskMeter({ score = 0, verdict = '' }) {
  const containerRef = useRef(null)
  const fillRef = useRef(null)
  const counterRef = useRef(null)

  // Determine color based on score
  const getColor = (value) => {
    if (value < 30) return '#3ecf8e'
    if (value < 70) return '#f5c542'
    return '#ff3d00'
  }

  const color = getColor(score)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 })

    // Animate bar fill
    let currentCounter = 0
    tl.to(
      fillRef.current,
      {
        width: score + '%',
        duration: 2.0,
        ease: 'power2.out',
        onUpdate: function () {
          const progress = this.progress()
          const displayScore = Math.floor(score * progress)
          currentCounter = displayScore

          // Update counter text
          if (counterRef.current) {
            counterRef.current.textContent = displayScore
            counterRef.current.style.color = getColor(displayScore)
          }
        },
      },
      0
    )

    // Screen shake if score >= 75
    if (score >= 75) {
      tl.to(
        containerRef.current,
        {
          x: [-6, 6, -5, 5, -3, 3, 0],
          duration: 0.5,
        },
        2.0
      )
    }

    // Show verdict after counter finishes
    tl.add(() => {
      if (counterRef.current) {
        counterRef.current.style.color = color
      }
    }, 2.0)
  }, [score])

  return (
    <div ref={containerRef} className="risk-meter-container">
      <div className="risk-meter-label-row">
        <span className="risk-label">RISK SCORE</span>
        <span ref={counterRef} className="risk-counter" style={{ color }}>
          0
        </span>
      </div>

      <div className="risk-meter-track">
        <div
          ref={fillRef}
          className="risk-meter-fill"
          style={{
            background: color,
            boxShadow: `0 0 16px ${color}`,
          }}
        ></div>
      </div>

      <div className="risk-verdict" style={{ color }}>
        {verdict}
      </div>
    </div>
  )
}
