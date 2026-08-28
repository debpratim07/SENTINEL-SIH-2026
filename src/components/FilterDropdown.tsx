import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface FilterOption {
  value: string
  label: string
}

interface Props {
  label: string
  allLabel: string
  options: FilterOption[]
  value: string
  onChange: (v: string) => void
  // optional overrides to match parent toolbar's button style
  fontSize?: number
  paddingX?: number
  paddingY?: number
  iconLeft?: React.ReactNode
  dropdownMinWidth?: number
}

function DropdownOption({
  value, label, current, onSelect,
}: { value: string; label: string; current: string; onSelect: (v: string) => void }) {
  const selected = current === value
  return (
    <button
      role="option"
      aria-selected={selected}
      onClick={() => onSelect(value)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '7px 13px',
        fontSize: 13,
        textAlign: 'left',
        background: selected ? 'rgba(244,111,41,0.07)' : 'transparent',
        color: selected ? '#F46F29' : 'var(--c-text)',
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
        fontFamily: 'var(--font-ui)',
        border: 'none',
        outline: 'none',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'var(--c-page)' }}
      onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {label}
      {selected && <Check size={11} strokeWidth={2.5} style={{ color: '#F46F29', flexShrink: 0, marginLeft: 8 }} />}
    </button>
  )
}

export function FilterDropdown({
  label, allLabel, options, value, onChange,
  fontSize = 13, paddingX = 11, paddingY = 7,
  iconLeft, dropdownMinWidth = 170,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = !!value

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selectedLabel = options.find((o) => o.value === value)?.label

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: `${paddingY}px ${paddingX}px`,
          borderRadius: 9,
          fontSize,
          fontWeight: active ? 600 : 400,
          background: active ? 'rgba(244,111,41,0.08)' : 'var(--c-card)',
          border: `1px solid ${active ? 'rgba(244,111,41,0.35)' : 'var(--c-border)'}`,
          color: active ? '#F46F29' : 'var(--c-muted)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-ui)',
          outline: 'none',
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {iconLeft}
        {active ? selectedLabel : label}
        <ChevronDown
          size={11}
          strokeWidth={2.5}
          style={{ transition: 'transform 150ms', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            minWidth: dropdownMinWidth,
            background: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            borderRadius: 10,
            boxShadow: '0 8px 28px rgba(0,0,0,0.13)',
            zIndex: 200,
            padding: '3px 0',
          }}
        >
          <DropdownOption value="" label={allLabel} current={value} onSelect={(v) => { onChange(v); setOpen(false) }} />
          {options.map((o) => (
            <DropdownOption key={o.value} value={o.value} label={o.label} current={value} onSelect={(v) => { onChange(v); setOpen(false) }} />
          ))}
        </div>
      )}
    </div>
  )
}
