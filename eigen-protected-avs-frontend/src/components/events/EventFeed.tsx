'use client'

import { type AVSEvent } from '@/hooks/use-avs-events'
import { formatDistanceToNow } from 'date-fns'

interface EventFeedProps {
  events: AVSEvent[]
  isLoading: boolean
}

export function EventFeed({ events, isLoading }: EventFeedProps) {
  if (isLoading) {
    return <div>Loading events...</div>
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="rounded-lg border p-4">
          {/* Event content */}
        </div>
      ))}
    </div>
  )
} 