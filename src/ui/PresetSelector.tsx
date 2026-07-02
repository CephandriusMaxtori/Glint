import { presets } from '../config/presets'

interface PresetSelectorProps {
  onSelect: (index: number) => void
}

export function PresetSelector({ onSelect }: PresetSelectorProps) {
  return (
    <div style={rowStyle}>
      <span style={{ fontSize: 13, color: '#ccc' }}>Preset:</span>
      <select
        onChange={(e) => onSelect(Number(e.target.value))}
        style={selectStyle}
        defaultValue=""
      >
        <option value="" disabled>
          Choose a preset...
        </option>
        {presets.map((p, i) => (
          <option key={p.name} value={i}>
            {p.name} — {p.description}
          </option>
        ))}
      </select>
    </div>
  )
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 12,
}

const selectStyle: React.CSSProperties = {
  flex: 1,
  padding: '4px 8px',
  fontSize: 13,
  background: '#2a2a2a',
  color: '#ddd',
  border: '1px solid #444',
  borderRadius: 4,
}
