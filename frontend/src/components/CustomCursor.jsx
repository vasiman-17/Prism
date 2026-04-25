import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const triangleRef = useRef(null)
  const lineRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const cursorPosRef = useRef({ x: -999, y: -999 })
  const [isMoving, setIsMoving] = useState(false)
  const [rotation, setRotation] = useState(0)

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const prevX = mouseRef.current.x
      const prevY = mouseRef.current.y
      
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      setIsMoving(true)

      // Calculate rotation based on movement direction
      if (prevX !== -999) {
        const deltaX = e.clientX - prevX
        const deltaY = e.clientY - prevY
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
        setRotation(angle)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Cursor follows with lerp in requestAnimationFrame
  useEffect(() => {
    let rafId
    const animate = () => {
      if (isMoving) {
        cursorPosRef.current.x += (mouseRef.current.x - cursorPosRef.current.x) * 0.15
        cursorPosRef.current.y += (mouseRef.current.y - cursorPosRef.current.y) * 0.15

        if (cursorRef.current) {
          gsap.set(cursorRef.current, {
            left: cursorPosRef.current.x,
            top: cursorPosRef.current.y,
            rotation: rotation,
          })
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [isMoving, rotation])

  // Hover states for interactive elements
  useEffect(() => {
    const handleMouseOver = (e) => {
      const isInteractive =
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'INPUT' ||
        e.target.dataset.cursor === 'pointer'

      if (isInteractive) {
        if (cursorRef.current) {
          gsap.to(cursorRef.current, {
            scale: 1.5,
            borderColor: '#ff3d00',
            backgroundColor: 'rgba(255, 61, 0, 0.1)',
            duration: 0.2,
          })
        }
        if (triangleRef.current) {
          gsap.to(triangleRef.current, {
            scale: 1.3,
            fill: '#ff3d00',
            duration: 0.2,
          })
        }
      }
    }

    const handleMouseOut = (e) => {
      const isInteractive =
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'INPUT' ||
        e.target.dataset.cursor === 'pointer'

      if (isInteractive) {
        if (cursorRef.current) {
          gsap.to(cursorRef.current, {
            scale: 1,
            borderColor: '#f0ede5',
            backgroundColor: 'transparent',
            duration: 0.2,
          })
        }
        if (triangleRef.current) {
          gsap.to(triangleRef.current, {
            scale: 1,
            fill: '#f0ede5',
            duration: 0.2,
          })
        }
      }
    }

    document.addEventListener('mouseover', handleMouseOver, true)
    document.addEventListener('mouseout', handleMouseOut, true)

    return () => {
      document.removeEventListener('mouseover', handleMouseOver, true)
      document.removeEventListener('mouseout', handleMouseOut, true)
    }
  }, [])

  return (
    <>
      {/* Custom Crosshair Cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: '40px',
          height: '40px',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate(-50%, -50%)',
          display: isMoving ? 'block' : 'none',
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {/* Outer ring */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="#f0ede5"
            strokeWidth="1"
            fill="none"
            opacity="0.8"
          />
          {/* Cross lines */}
          <line
            x1="20"
            y1="5"
            x2="20"
            y2="15"
            stroke="#ff3d00"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="20"
            y1="25"
            x2="20"
            y2="35"
            stroke="#ff3d00"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="5"
            y1="20"
            x2="15"
            y2="20"
            stroke="#ff3d00"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="25"
            y1="20"
            x2="35"
            y2="20"
            stroke="#ff3d00"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Center triangle */}
          <polygon
            ref={triangleRef}
            points="20,12 24,20 16,20"
            fill="#f0ede5"
            style={{ transformOrigin: 'center' }}
          />
        </svg>
      </div>
    </>
  )
}
