import { useState, type ReactNode } from 'react'

interface SectionProps {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export function Section({ title, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={wrapStyle}>
      <button onClick={() => setOpen(!open)} style={headerStyle}>
        <span style={arrowStyle}>{open ? '▼' : '▶'}</span>
        <span>{title}</span>
      </button>
      {open && <div style={bodyStyle}>{children}</div>}
    </div>
  )
}

const wrapStyle: React.CSSProperties = {
  borderBottom: '1px solid #2a2a2a',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  width: '100%',
  padding: '8px 0',
  background: 'none',
  border: 'none',
  color: '#ddd',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'left',
}

const arrowStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#888',
  width: 14,
}

const bodyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  paddingBottom: 8,
}
