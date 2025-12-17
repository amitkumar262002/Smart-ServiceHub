import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
}

export default function Splash({ onDone, delayMs = 2500 }: { onDone: () => void; delayMs?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])

  // Flame particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let running = true
    const DPR = Math.min(2, window.devicePixelRatio || 1)

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window
      canvas.width = w * DPR
      canvas.height = h * DPR
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize flame particles
    const PARTICLE_COUNT = 80
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + Math.random() * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 3 - 1,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.3,
      hue: Math.random() * 60 + 10 // 10-70 (orange to red range)
    }))

    const draw = () => {
      if (!running) return
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight)
      gradient.addColorStop(0, 'rgba(255, 94, 77, 0.15)')
      gradient.addColorStop(0.5, 'rgba(255, 154, 0, 0.15)')
      gradient.addColorStop(1, 'rgba(255, 206, 84, 0.15)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.opacity -= 0.005
        particle.size *= 0.998

        // Reset particle if it goes off screen or fades out
        if (particle.y < -50 || particle.opacity <= 0) {
          particlesRef.current[index] = {
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + Math.random() * 100,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 3 - 1,
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.5 + 0.3,
            hue: Math.random() * 60 + 10
          }
        }

        // Draw flame particle with glow
        ctx.save()
        ctx.globalAlpha = particle.opacity
        
        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        glowGradient.addColorStop(0, `hsla(${particle.hue}, 100%, 60%, 0.8)`)
        glowGradient.addColorStop(0.5, `hsla(${particle.hue}, 100%, 50%, 0.3)`)
        glowGradient.addColorStop(1, `hsla(${particle.hue}, 100%, 40%, 0)`)
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()
        
        // Inner core
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, 1)`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
      })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { running = false; cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  // Auto-navigate after delay
  useEffect(() => {
    const t = setTimeout(onDone, delayMs)
    return () => clearTimeout(t)
  }, [onDone, delayMs])

  return (
    <div className="face-splash-root">
      <canvas ref={canvasRef} className="face-splash-canvas" aria-hidden="true" />
      
      {/* Skip button */}
      <button className="face-splash-skip" onClick={onDone} aria-label="Skip intro">Skip</button>
      
      {/* Central content */}
      <div className="face-splash-content">
        {/* Eye-like logo with radial animation */}
        <div className="face-splash-logo-container">
          {/* Rotating radial rings */}
          <div className="face-radial-ring ring-1" />
          <div className="face-radial-ring ring-2" />
          <div className="face-radial-ring ring-3" />
          
          {/* Central eye-like element */}
          <div className="face-eye-container">
            <div className="face-eye-outer">
              <div className="face-eye-inner">
                <div className="face-eye-pupil" />
                <div className="face-eye-glow" />
              </div>
            </div>
            {/* Scanning effect */}
            <div className="face-scan-line" />
          </div>
        </div>
        
        {/* Title text */}
        <div className="face-splash-text">
          <h1 className="face-splash-title">
            Advanced Face Recognition
            <br />
            Attendance System
          </h1>
        </div>
        
        {/* Loading indicator */}
        <div className="face-splash-loading">
          <div className="face-loading-dot" />
          <div className="face-loading-dot" />
          <div className="face-loading-dot" />
        </div>
      </div>
    </div>
  )
}
