'use client'

import React from 'react'
import { Button } from '@play-money/ui/button'
import { cn } from '@play-money/ui/utils'
import { SearchIcon } from 'lucide-react'
import { GlobalSearchMenu } from './GlobalSearchMenu'

interface GlobalSearchTriggerLinkProps {
  className?: string
  children?: React.ReactNode
}

export function GlobalSearchTriggerLink({ className, children }: GlobalSearchTriggerLinkProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <Button 
        className={cn('flex h-8 w-8 items-center justify-center hover:text-primary', className)} 
        variant="ghost" 
        size="icon"
        onClick={() => setOpen(true)}
      >
        {children || <SearchIcon className="h-5 w-5" />}
      </Button>

      <GlobalSearchMenu open={open} onOpenChange={setOpen} />
    </>
  )
}
