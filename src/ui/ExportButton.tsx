import { useState } from 'react'
import { exportShaderpack } from '../generator/exportZip'
import { useStore } from '../config/store'

export function ExportButton() {
  const [busy, setBusy] = useState(false)
  const config = useStore((s) => s.config)

  async function handleExport(): Promise<void> {
    setBusy(true)
    try {
      await exportShaderpack(config)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button onClick={handleExport} disabled={busy} style={btnStyle}>
      {busy ? 'Generating...' : 'Export Shaderpack (.zip)'}
    </button>
  )
}

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 16px',
  fontSize: 14,
  fontWeight: 600,
  color: '#fff',
  background: '#2d7d46',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  marginTop: 12,
}
