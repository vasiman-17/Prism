import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const ringPosRef = useRef({ x: -999, y: -999 })
  const [ripples, setRipples] = useState([])
  const [isMoving, setIsMoving] = useState(false)

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      setIsMoving(true)

      // Dot follows exactly
      if (dotRef.current) {
        gsap.set(dotRef.current, {
          left: e.clientX,
          top: e.clientY,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Ring follows with lerp in requestAnimationFrame
  useEffect(() => {
    let rafId
    const animate = () => {
      if (isMoving) {
        ringPosRef.current.x += (mouseRef.current.x - ringPosRef.current.x) * 0.1
        ringPosRef.current.y += (mouseRef.current.y - ringPosRef.current.y) * 0.1

        if (ringRef.current) {
          gsap.set(ringRef.current, {
            left: ringPosRef.current.x,
            top: ringPosRef.current.y,
          })
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [isMoving])

  // Hover states for interactive elements
  useEffect(() => {
    const handleMouseOver = (e) => {
      const isInteractive =
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'INPUT' ||
        e.target.dataset.cursor === 'pointer'

      if (isInteractive) {
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            scale: 0,
            duration: 0.3,
          })
        }
        if (ringRef.current) {
          gsap.to(ringRef.current, {
            scale: 2.2,
            borderColor: 'rgba(255, 61, 0, 1)',
            backgroundColor: 'rgba(255, 61, 0, 0.1)',
            duration: 0.3,
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
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            scale: 1,
            duration: 0.3,
          })
        }
        if (ringRef.current) {
          gsap.to(ringRef.current, {
            scale: 1,
            borderColor: 'rgba(255, 61, 0, 0.6)',
            backgroundColor: 'transparent',
            duration: 0.3,
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

  // Click ripple effect
  useEffect(() => {
    const handleMouseDown = (e) => {
      const rippleId = Date.now()
      const ripple = {
        id: rippleId,
        x: e.clientX,
        y: e.clientY,
      }

      setRipples((prev) => [...prev, ripple])

      // Animate ripple
      setTimeout(() => {
        const rippleEl = document.getElementById(`ripple-${rippleId}`)
        if (rippleEl) {
          gsap.fromTo(
            rippleEl,
            { scale: 0, opacity: 0.6 },
            {
              scale: 4,
              opacity: 0,
              duration: 0.6,
              ease: 'power2.out',
              onComplete: () => {
                setRipples((prev) => prev.filter((r) => r.id !== rippleId))
              },
            }
          )
        }
      }, 0)
    }

    window.addEventListener('mousedown', handleMouseDown)
    return () => window.removeEventListener('mousedown', handleMouseDown)
  }, [])

  return (
    <>
      {/* Cursor Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          width: '8px',
          height: '8px',
          backgroundColor: '#ff3d00',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate(-50%, -50%)',
          scale: 1,
          display: isMoving ? 'block' : 'none',
        }}
      />

      {/* Cursor Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: '32px',
          height: '32px',
          border: '1.5px solid rgba(255, 61, 0, 0.6)',
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          zIndex: 99998,
          transform: 'translate(-50%, -50%)',
          scale: 1,
          display: isMoving ? 'block' : 'none',
        }}
      />

      {/* Click Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          id={`ripple-${ripple.id}`}
          style={{
            position: 'fixed',
            left: ripple.x,
            top: ripple.y,
            width: '1px',
            height: '1px',
            border: '1px solid rgba(255, 61, 0, 0.8)',
            pointerEvents: 'none',
            zIndex: 99997,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </>
  )
}
