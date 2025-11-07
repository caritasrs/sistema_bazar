export function CaritasLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Red Cross */}
      <path
        d="M35 20 L35 40 L20 40 L20 60 L35 60 L35 80 L65 80 L65 60 L80 60 L80 40 L65 40 L65 20 Z"
        fill="#DC2626"
        stroke="#991B1B"
        strokeWidth="2"
      />
      {/* Inner highlight */}
      <path
        d="M40 25 L40 40 L25 40 L25 55 L40 55 L40 75 L60 75 L60 55 L75 55 L75 40 L60 40 L60 25 Z"
        fill="#EF4444"
        opacity="0.6"
      />
    </svg>
  )
}
