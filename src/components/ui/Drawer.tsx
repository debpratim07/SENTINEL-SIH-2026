import { useEffect, useState } from 'react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  width?: number
  children: React.ReactNode
  'aria-label'?: string
}

export default function Drawer({
  open,
  onClose,
  width = 620,
  children,
  'aria-label': ariaLabel,
}: DrawerProps) {
  const [mounted, setMounted] = useState(open)

  useEffect(() => {
    if (open) {
      setMounted(true)
    } else {
      const t = setTimeout(() => setMounted(false), 330)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  if (!mounted) return null

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(0,0,0,0.38)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          opacity: open ? 1 : 0,
          transition: 'opacity 250ms ease',
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width,
          maxWidth: '100vw',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--c-card)',
          borderLeft: '1px solid var(--c-border)',
          boxShadow: '-4px 0 40px rgba(0,0,0,0.18)',
          transform: open ? 'translateX(0)' : `translateX(${width}px)`,
          transition: 'transform 320ms cubic-bezier(0.32, 0.72, 0, 1)',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </>
  )
}
