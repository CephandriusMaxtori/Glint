interface ToggleControlProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

export function ToggleControl({ label, value, onChange }: ToggleControlProps) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: 13,
  color: '#ccc',
  cursor: 'pointer',
}
