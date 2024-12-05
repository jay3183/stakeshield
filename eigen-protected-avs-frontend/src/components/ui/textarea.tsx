'use client'

import * as React from 'react'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => (
    <textarea
      className="w-full rounded-md border p-2"
      ref={ref}
      {...props}
    />
  )
)

export { Textarea }