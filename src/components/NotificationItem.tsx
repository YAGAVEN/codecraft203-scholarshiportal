import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, Info } from 'lucide-react'

interface Props {
  title: string
  description?: string
  onAction?: () => void
}

export default function NotificationItem({ title, description, onAction }: Props) {
  return (
    <div className="flex items-start gap-3 p-3 bg-card border rounded-lg">
      <div className="mt-0.5">
        <Info className="h-5 w-5 text-amber-500" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{title}</div>
          {onAction && (
            <Button size="sm" variant="outline" onClick={onAction}>
              <span className="mr-2">Add</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
      </div>
    </div>
  )
}
