import * as React from "react"

interface AlertProps {
  children: React.ReactNode
  variant?: "default" | "error" | "warning" | "success"
}

export function Alert({ children, variant = "default" }: AlertProps) {
  const variantClasses = {
    default: "bg-gray-100",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    success: "bg-green-100 text-green-800"
  }

  return (
    <div className={`p-4 rounded-md ${variantClasses[variant]}`}>
      {children}
    </div>
  )
}