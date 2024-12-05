import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: "default" | "destructive" | "outline"
  size?: "default" | "sm" | "lg"
}

export function Button({ 
  children, 
  loading, 
  variant = "default",
  size = "default",
  ...props 
}: ButtonProps) {
  const variants = {
    default: "bg-blue-500 text-white",
    destructive: "bg-red-500 text-white",
    outline: "border border-gray-300"
  }

  const sizes = {
    default: "px-4 py-2",
    sm: "px-2 py-1 text-sm",
    lg: "px-6 py-3 text-lg"
  }

  return (
    <button 
      className={`${variants[variant]} ${sizes[size]} rounded disabled:opacity-50`}
      disabled={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
