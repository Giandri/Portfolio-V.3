import { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ProgressiveBlur } from "@/components/ui/progressive-blur"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  href: string
  cta: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden ",
      // light styles
      "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "dark:bg-background transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
      className
    )}
    {...props}
  >
    <div className="absolute inset-0">
      {background}
      {/* Solid blur fill on hover */}
      <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
      {/* Progressive blur overlay on hover */}
      <ProgressiveBlur
        direction="bottom"
        blurLayers={8}
        blurIntensity={2}
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
      />
      {/* Dark gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>

    {/* Hover content: title, description, and CTA */}
    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
      <div className="flex flex-col gap-3 transform-gpu transition-all duration-500 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-mono font-medium text-white">
            {name}
          </h3>
          <p className="text-sm font-mono text-white/70 line-clamp-2">{description}</p>
        </div>

        <Button
          variant="link"
          asChild
          size="sm"
          className="p-0 w-fit text-white hover:text-white/80"
        >
          <a href={href} target="_blank" rel="noopener noreferrer">
            {cta}
            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
          </a>
        </Button>
      </div>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
)

export { BentoCard, BentoGrid }
