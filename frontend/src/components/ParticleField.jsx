import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function ParticleSystem() {
  const pointsRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [particleData, setParticleData] = useState(null)

  // Generate particle data on mount
  useEffect(() => {
    const count = 4000
    const positions = new Float32Array(count * 3)
    const basePositions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Random sphere distribution (radius 10)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = Math.random() * 10

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
      speeds[i] = Math.random() * 2.0 + 0.8
      sizes[i] = Math.random() * 0.03 + 0.01

      // More varied colors - white, orange, cyan accents
      const rand = Math.random()
      if (rand < 0.15) {
        // Orange accent
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.24
        colors[i * 3 + 2] = 0.0
      } else if (rand < 0.3) {
        // Cyan accent
        colors[i * 3] = 0.31
        colors[i * 3 + 1] = 0.81
        colors[i * 3 + 2] = 0.89
      } else {
        // White
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 1.0
        colors[i * 3 + 2] = 1.0
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticleData({ positions, basePositions, phases, speeds, colors, sizes, count })
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
    if (!pointsRef.current || !particleData || !pointsRef.current.geometry.attributes.position) return

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

      // Much stronger oscillation animation - all particles constantly moving
      const speed = speeds[i] * 2
      y += Math.sin(time * speed + phases[i]) * 0.08
      x += Math.cos(time * speed * 0.7 + phases[i]) * 0.06
      z += Math.sin(time * speed * 0.5 + phases[i]) * 0.04

      // Add rotation effect around center
      const angle = time * 0.1 * speeds[i]
      const rotatedX = x * Math.cos(angle) - z * Math.sin(angle)
      const rotatedZ = x * Math.sin(angle) + z * Math.cos(angle)
      x = rotatedX
      z = rotatedZ

      // Pulsing size effect through position
      const pulse = Math.sin(time * 2 + phases[i]) * 0.02
      x += pulse
      y += pulse

      // Mouse interaction: stronger attraction within distance 2.0
      const dx = mouseWorldX - x
      const dy = mouseWorldY - y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 2.0) {
        const force = (2.0 - distance) / 2.0
        x += dx * force * 0.02
        y += dy * force * 0.02
      }

      // Gentle spring back to base position
      x += (baseX - x) * 0.003
      y += (baseY - y) * 0.003
      z += (baseZ - z) * 0.003

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (!particleData) {
    return (
      <points ref={pointsRef}>
        <bufferGeometry />
        <pointsMaterial transparent opacity={0} />
      </points>
    )
  }

  return (
    <points ref={pointsRef}>
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
      <pointsMaterial
        size={0.025}
        opacity={0.7}
        transparent
        vertexColors
        sizeAttenuation
        blending={2}
      />
    </points>
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
      <color attach="background" args={['#050508']} />
      <ParticleSystem />
    </Canvas>
  )
}
