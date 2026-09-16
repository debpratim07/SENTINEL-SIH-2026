import { useEffect, useRef, type RefObject } from 'react'
import { visibleFocusable } from '../lib/industrial-motion'

export function useDialogFocus(ref: RefObject<HTMLDivElement | null>, open: boolean, mounted: boolean, onClose: () => void) {
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const panel = ref.current
    if (!open || !mounted || !panel) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const controls = () => visibleFocusable(Array.from(panel.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], [tabindex]')).map(element => ({
      element, disabled: element.matches(':disabled'), visible: element.getClientRects().length > 0, tabIndex: element.tabIndex,
    })))
    const topDialog = () => Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][data-open="true"]')).sort((a,b) => Number(getComputedStyle(a).zIndex) - Number(getComputedStyle(b).zIndex)).at(-1) === panel
    // Allow the mounted overlay to enter layout before choosing the first control.
    const frame = requestAnimationFrame(() => { if (topDialog()) (controls()[0]?.element ?? panel).focus() })
    const keydown = (event: KeyboardEvent) => {
      if (!topDialog()) return
      if (event.key === 'Escape') { event.preventDefault(); close.current(); return }
      if (event.key !== 'Tab') return
      const items = controls()
      const first = items[0]?.element, last = items.at(-1)?.element
      if (!first || !last) { event.preventDefault(); panel.focus(); return }
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', keydown)
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus()
    }
  }, [open, mounted, ref])
}
