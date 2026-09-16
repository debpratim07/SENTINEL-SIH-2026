import { useEffect, useRef, useState } from 'react'
import { useDialogFocus } from '../../hooks/useDialogFocus'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  'aria-label'?: string
  zIndex?: number
}

export default function Modal({
  open,
  onClose,
  children,
  'aria-label': ariaLabel,
  zIndex = 60,
}: ModalProps) {
  const [mounted, setMounted] = useState(open)
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(panel, open, mounted, onClose)

  useEffect(() => {
    if (open) {
      setMounted(true)
    } else {
      const t = setTimeout(() => setMounted(false), 220)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!mounted) return null

  return (
    <div
      className="responsive-modal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        opacity: open ? 1 : 0,
        transition: 'opacity 200ms ease',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Content */}
      <div
        className="responsive-modal-content"
        ref={panel}
        tabIndex={-1}
        data-open={open}
        inert={!open}
        aria-hidden={!open}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: zIndex + 1,
          transform: open ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)',
          transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
