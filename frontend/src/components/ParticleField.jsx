import { useEffect, useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'

function ParticleSystem() {
  const pointsRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Generate particle data
  const particleData = useMemo(() => {
    const count = 2500
    const positions = new Float32Array(count * 3)
    const basePositions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Random sphere distribution (radius 7)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = Math.random() * 7

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      basePositions[i * 3] = x
      basePositions[i * 3 + 1] = y
      basePositions[i * 3 + 2] = z

      phases[i] = Math.random() * Math.PI * 2
      speeds[i] = Math.random() * 0.6 + 0.2

      // 90% white, 10% accent
      const isAccent = Math.random() < 0.1
      if (isAccent) {
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.24
        colors[i * 3 + 2] = 0.0
      } else {
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 1.0
        colors[i * 3 + 2] = 1.0
      }
    }

    return { positions, basePositions, phases, speeds, colors, count }
  }, [])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animation loop
  useFrame(({ clock }) => {
    if (!pointsRef.current) return

    const time = clock.getElapsedTime()
    const positions = pointsRef.current.geometry.attributes.position.array
    const { basePositions, phases, speeds, count } = particleData

    // Convert mouse position to world coordinates
    const mouseWorldX = (mousePos.x / window.innerWidth) * 2 - 1
    const mouseWorldY = -(mousePos.y / window.innerHeight) * 2 + 1

    for (let i = 0; i < count; i++) {
      const baseX = basePositions[i * 3]
      const baseY = basePositions[i * 3 + 1]
      const baseZ = basePositions[i * 3 + 2]

      let x = baseX
      let y = baseY
      let z = baseZ

      // Oscillation animation
      y += Math.sin(time * speeds[i] + phases[i]) * 0.001
      x += Math.cos(time * speeds[i] * 0.6 + phases[i]) * 0.0008

      // Mouse interaction: nudge toward mouse within distance 1.5
      const dx = mouseWorldX - x
      const dy = mouseWorldY - y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 1.5) {
        x += dx * 0.003
        y += dy * 0.003
      }

      // Spring back to base position
      x += (baseX - x) * 0.0008
      y += (baseY - y) * 0.0008
      z += (baseZ - z) * 0.0008

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleData.count}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleData.count}
          array={particleData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.018}
        opacity={0.5}
        transparent
        vertexColors
        sizeAttenuation
      />
    </Points>
  )
}

export default function ParticleField() {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 6], fov: 75 }}
      gl={{ alpha: true }}
    >
      <color attach="background" args={['#030303']} />
      <ParticleSystem />
    </Canvas>
  )
}
