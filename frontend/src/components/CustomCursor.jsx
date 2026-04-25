import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const mouseRef = useRef({ x: -100, y: -100 })
  const posRef = useRef({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const rafRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      if (!visible) setVisible(true)
    }
    const handleMouseLeave = () => setVisible(false)
    const handleMouseEnter = () => setVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [visible])

  // Smooth follow via RAF — no GSAP to avoid transform conflicts
  useEffect(() => {
    const animate = () => {
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.15
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.15
      if (cursorRef.current) {
        cursorRef.current.style.left = posRef.current.x + 'px'
        cursorRef.current.style.top = posRef.current.y + 'px'
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Hover scale for interactive elements
  useEffect(() => {
    const onOver = (e) => {
      const el = e.target
      if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.dataset?.cursor === 'pointer') {
        if (cursorRef.current) cursorRef.current.classList.add('cursor-hover')
      }
    }
    const onOut = (e) => {
      const el = e.target
      if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.dataset?.cursor === 'pointer') {
        if (cursorRef.current) cursorRef.current.classList.remove('cursor-hover')
      }
    }
    document.addEventListener('mouseover', onOver, true)
    document.addEventListener('mouseout', onOut, true)
    return () => {
      document.removeEventListener('mouseover', onOver, true)
      document.removeEventListener('mouseout', onOut, true)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        width: '36px',
        height: '36px',
        pointerEvents: 'none',
        zIndex: 99999,
        transform: 'translate(-50%, -50%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease, transform 0.15s ease',
      }}
      className="custom-cursor"
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" stroke="#f0ede5" strokeWidth="1" fill="none" opacity="0.6" />
        <line x1="18" y1="4" x2="18" y2="13" stroke="#ff3d00" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="23" x2="18" y2="32" stroke="#ff3d00" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="18" x2="13" y2="18" stroke="#ff3d00" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="23" y1="18" x2="32" y2="18" stroke="#ff3d00" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="18" r="2" fill="#ff3d00" />
      </svg>
    </div>
  )
}
