import Image from "next/image"

export function CaritasLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/caritas-logo-oficial.jpg"
      alt="Cáritas Brasileira Regional Rio Grande do Sul"
      width={500}
      height={500}
      className={className}
      priority
    />
  )
}
