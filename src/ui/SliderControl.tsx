interface SliderControlProps {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}

export function SliderControl({ label, min, max, step, value, onChange }: SliderControlProps) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <div style={rowStyle}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={valStyle}>{Number(value).toFixed(2)}</span>
      </div>
    </label>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  fontSize: 13,
  color: '#ccc',
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

const valStyle: React.CSSProperties = {
  minWidth: 36,
  textAlign: 'right',
  fontSize: 12,
  fontFamily: 'monospace',
  color: '#888',
}
