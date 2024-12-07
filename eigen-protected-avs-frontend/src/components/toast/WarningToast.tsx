import { FC } from 'react'

interface WarningToastProps {
  message: string
}

export const WarningToast: FC<WarningToastProps> = ({ message }) => (
  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg shadow-lg">
    <p className="text-yellow-800">{message}</p>
  </div>
) 