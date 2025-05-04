"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

type TooltipTriggerProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>, 
  HTMLDivElement
> & { asChild?: boolean }

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ 
  children, 
  className,
  ...props
}) => {
  return (
    <div className={cn("inline-block", className)} {...props}>
      {children}
    </div>
  )
}

interface TooltipContentProps {
  children: React.ReactNode
  className?: string
  sideOffset?: number
}

const TooltipContent: React.FC<TooltipContentProps> = ({ 
  children, 
  className,
  ...props
}) => {
  return (
    <div 
      className={cn(
        "absolute z-50 hidden group-hover:block top-full left-1/2 transform -translate-x-1/2 mt-2 rounded-md bg-white border px-3 py-1.5 text-sm shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Custom tooltip that doesn't require Radix
export function SimpleTooltip({ children, content, side = 'top', className }: TooltipProps) {
  return (
    <div className="relative inline-flex group">
      {children}
      <div 
        className={cn(
          "absolute z-50 hidden group-hover:block bg-white border rounded-md px-3 py-1.5 text-sm shadow-md",
          side === 'top' && "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
          side === 'right' && "left-full top-1/2 transform -translate-y-1/2 ml-2",
          side === 'bottom' && "top-full left-1/2 transform -translate-x-1/2 mt-2",
          side === 'left' && "right-full top-1/2 transform -translate-y-1/2 mr-2",
          className
        )}
      >
        {content}
      </div>
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } 