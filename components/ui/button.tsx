import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[25px] font-semibold transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3FD3CC] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-[#3FD3CC] hover:bg-[#36B3AD] text-white",
        secondary: "bg-[#142D42] hover:bg-[#1D3D59] text-white",
        outline: "border-2 border-[#3FD3CC] text-[#3FD3CC] hover:bg-[#E6F7F7] bg-transparent",
        ghost: "text-[#142D42] hover:bg-[#F4F4F4] bg-transparent",
        danger: "bg-[#EF4444] hover:bg-[#DC2626] text-white",
      },
      size: {
        sm: "h-9 px-4 py-2 text-xs",
        default: "h-11 px-6 py-3 text-sm",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-11 w-11 p-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
