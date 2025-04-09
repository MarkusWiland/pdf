import React from 'react'
import { Button } from '../ui/button'
import { Calendar, ChevronLeft, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '../ui/badge'

export default function SummaryHeader({
  title,
  createdAt,
  readingTime,
}: {
  title: string
  createdAt: Date
  readingTime: number
}) {
  return (
    <div className="flex gap-4 mb-4 justify-between">
      <div className="space-y-6">
        <Badge
          variant="secondary"
          className="relative px-4 py-1.5 text-sm font-medium bg-white/80 backdrop-blur-xs rounded-full hover:bg-white/90 transition-all duration-200 shadow-xs hover:shadow-md"
        >
          <Sparkles className="h-4 w-4 mr-1.5 text-rose-500" />
          AI Summary
        </Badge>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-rose-400" />
          {new Date(createdAt).toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-rose-400" />
            {readingTime} läsningstid
          </div>
        </div>
        <h1> {title}</h1>
      </div>
      <div>
        <Link href="/dashboard">
          <Button
            variant="link"
            size="sm"
            className="group flex items-center gap-2 sm:gap-2 hover:bg-white/80 backdrop-blur-xs rounded-full transition-all duration-200 shadow-xs hover:shadow-md border border-rose-100 bg-rose-100 px-2 sm:px-3"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500 transition-transform group-hover:translate-x-0.5" />
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              Tillbaka <span className="hidden sm:inline">till dashboard</span>
            </span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
