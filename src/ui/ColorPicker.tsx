interface ColorPickerProps {
  label: string
  value: [number, number, number]
  onChange: (rgb: [number, number, number]) => void
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <input
        type="color"
        value={rgbToHex(value[0], value[1], value[2])}
        onChange={(e) => onChange(hexToRgb(e.target.value))}
        style={{ width: 40, height: 28, padding: 0, border: 'none', cursor: 'pointer' }}
      />
    </label>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8,
  fontSize: 13,
  color: '#ccc',
}
