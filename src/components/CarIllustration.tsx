// ════════════════════════════════════════════════════════════════
// CarIllustration, stylized side view SVG silhouettes for each
// vehicle category. Single source of truth for vehicle imagery.
// ════════════════════════════════════════════════════════════════

interface CarIllustrationProps {
  category: string
  className?: string
}

export default function CarIllustration({ category, className = "" }: CarIllustrationProps) {
  const gradientId = `grad-${category.replace(/\s+/g, "-").toLowerCase()}`
  const windowGradId = `${gradientId}-window`

  // Shared gradient definitions
  const defs = (
    <defs>
      <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"  stopColor="var(--car-body-light)" />
        <stop offset="100%" stopColor="var(--car-body-dark)" />
      </linearGradient>
      <linearGradient id={windowGradId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"  stopColor="var(--car-window-light)" />
        <stop offset="100%" stopColor="var(--car-window-dark)" />
      </linearGradient>
    </defs>
  )

  // Body, window, wheel fills
  const bodyFill   = `url(#${gradientId})`
  const windowFill = `url(#${windowGradId})`
  const wheelStroke = "var(--car-wheel)"
  const wheelFill   = "var(--car-wheel-rim)"

  // Compact car (sedan profile)
  if (category === "Best Compact") {
    return (
      <svg viewBox="0 0 400 160" className={className} xmlns="http://www.w3.org/2000/svg">
        {defs}
        <path d="M 40 110 Q 40 80 90 75 L 130 50 Q 145 40 175 38 L 240 38 Q 270 40 285 55 L 320 75 Q 360 80 360 110 L 360 125 Q 360 130 355 130 L 45 130 Q 40 130 40 125 Z" fill={bodyFill} />
        <path d="M 135 70 Q 148 50 175 48 L 235 48 Q 262 50 275 70 L 275 75 L 135 75 Z" fill={windowFill} />
        <line x1="205" y1="50" x2="205" y2="75" stroke="var(--car-body-dark)" strokeWidth="2" />
        <circle cx="115" cy="130" r="22" fill={wheelStroke} />
        <circle cx="115" cy="130" r="12" fill={wheelFill} />
        <circle cx="285" cy="130" r="22" fill={wheelStroke} />
        <circle cx="285" cy="130" r="12" fill={wheelFill} />
      </svg>
    )
  }

  // Midsize sedan (longer profile)
  if (category === "Best Midsize") {
    return (
      <svg viewBox="0 0 400 160" className={className} xmlns="http://www.w3.org/2000/svg">
        {defs}
        <path d="M 30 115 Q 30 78 80 73 L 125 45 Q 142 35 175 33 L 250 33 Q 283 35 298 50 L 330 73 Q 370 78 370 115 L 370 128 Q 370 133 365 133 L 35 133 Q 30 133 30 128 Z" fill={bodyFill} />
        <path d="M 130 68 Q 145 45 175 43 L 245 43 Q 275 45 290 68 L 290 73 L 130 73 Z" fill={windowFill} />
        <line x1="210" y1="45" x2="210" y2="73" stroke="var(--car-body-dark)" strokeWidth="2" />
        <circle cx="110" cy="133" r="23" fill={wheelStroke} />
        <circle cx="110" cy="133" r="13" fill={wheelFill} />
        <circle cx="295" cy="133" r="23" fill={wheelStroke} />
        <circle cx="295" cy="133" r="13" fill={wheelFill} />
      </svg>
    )
  }

  // SUV (taller, boxier)
  if (category === "Best SUV") {
    return (
      <svg viewBox="0 0 400 160" className={className} xmlns="http://www.w3.org/2000/svg">
        {defs}
        <path d="M 35 115 Q 35 70 90 65 L 110 30 Q 122 22 155 20 L 250 20 Q 285 22 300 32 L 320 65 Q 365 70 365 115 L 365 128 Q 365 133 360 133 L 40 133 Q 35 133 35 128 Z" fill={bodyFill} />
        <path d="M 117 60 Q 128 32 155 30 L 245 30 Q 275 32 290 60 L 290 65 L 117 65 Z" fill={windowFill} />
        <line x1="200" y1="30" x2="200" y2="65" stroke="var(--car-body-dark)" strokeWidth="2" />
        <circle cx="115" cy="133" r="25" fill={wheelStroke} />
        <circle cx="115" cy="133" r="14" fill={wheelFill} />
        <circle cx="290" cy="133" r="25" fill={wheelStroke} />
        <circle cx="290" cy="133" r="14" fill={wheelFill} />
      </svg>
    )
  }

  // Pickup truck (cabin + bed)
  if (category === "Best Truck") {
    return (
      <svg viewBox="0 0 400 160" className={className} xmlns="http://www.w3.org/2000/svg">
        {defs}
        <path d="M 30 115 Q 30 75 70 70 L 90 30 Q 100 22 130 20 L 220 20 Q 230 22 235 30 L 250 70 L 355 70 Q 370 70 370 85 L 370 128 Q 370 133 365 133 L 35 133 Q 30 133 30 128 Z" fill={bodyFill} />
        <path d="M 95 60 Q 105 32 130 30 L 215 30 Q 225 32 230 60 L 230 65 L 95 65 Z" fill={windowFill} />
        <line x1="165" y1="30" x2="165" y2="65" stroke="var(--car-body-dark)" strokeWidth="2" />
        <rect x="250" y="78" width="100" height="40" fill="none" stroke="var(--car-body-dark)" strokeWidth="1.5" opacity="0.3" />
        <circle cx="105" cy="133" r="25" fill={wheelStroke} />
        <circle cx="105" cy="133" r="14" fill={wheelFill} />
        <circle cx="305" cy="133" r="25" fill={wheelStroke} />
        <circle cx="305" cy="133" r="14" fill={wheelFill} />
      </svg>
    )
  }

  // Hybrid (aerodynamic teardrop)
  if (category === "Best Hybrid") {
    return (
      <svg viewBox="0 0 400 160" className={className} xmlns="http://www.w3.org/2000/svg">
        {defs}
        <path d="M 30 118 Q 30 75 75 68 L 110 38 Q 130 25 175 22 L 250 22 Q 295 25 320 50 L 350 78 Q 370 90 370 118 L 370 128 Q 370 133 365 133 L 35 133 Q 30 133 30 128 Z" fill={bodyFill} />
        <path d="M 120 60 Q 138 32 175 30 L 245 30 Q 285 32 305 65 L 305 70 L 120 70 Z" fill={windowFill} />
        <line x1="215" y1="32" x2="215" y2="70" stroke="var(--car-body-dark)" strokeWidth="2" />
        <circle cx="105" cy="133" r="23" fill={wheelStroke} />
        <circle cx="105" cy="133" r="13" fill={wheelFill} />
        <circle cx="290" cy="133" r="23" fill={wheelStroke} />
        <circle cx="290" cy="133" r="13" fill={wheelFill} />
        <path d="M 175 95 L 195 100 L 175 105 L 180 100 Z" fill="var(--accent)" opacity="0.9" />
      </svg>
    )
  }

  // Fallback generic
  return (
    <svg viewBox="0 0 400 160" className={className} xmlns="http://www.w3.org/2000/svg">
      {defs}
      <rect x="50" y="60" width="300" height="60" rx="30" fill={bodyFill} />
    </svg>
  )
}
