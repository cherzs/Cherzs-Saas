import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    
    const variantClasses = {
      default: "border-transparent bg-white text-black hover:bg-gray-200",
      secondary: "border-transparent bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700",
      destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
      outline: "text-gray-300 border-gray-700 bg-transparent hover:bg-gray-800"
    }
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`
    
    return (
      <div
        ref={ref}
        className={classes}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge } 