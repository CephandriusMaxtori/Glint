import { useStore } from '../config/store'
import { ColorPicker } from './ColorPicker'
import { SliderControl } from './SliderControl'
import { ToggleControl } from './ToggleControl'
import { Section } from './Section'
import { PresetSelector } from './PresetSelector'
import { ExportButton } from './ExportButton'

export function ControlsPanel() {
  const c = useStore((s) => s.config)

  return (
    <div style={panelStyle}>
      <h2 style={titleStyle}>Shader Generator</h2>
      <PresetSelector onSelect={(i) => useStore.getState().loadPreset(i)} />

      <Section title="Water">
        <ColorPicker label="Color Tint" value={c.water.colorTint} onChange={(v) => useStore.getState().setWater({ colorTint: v })} />
        <SliderControl label="Wave Amplitude" min={0} max={1} step={0.01} value={c.water.waveAmplitude} onChange={(v) => useStore.getState().setWater({ waveAmplitude: v })} />
        <SliderControl label="Wave Speed" min={0} max={1} step={0.01} value={c.water.waveSpeed} onChange={(v) => useStore.getState().setWater({ waveSpeed: v })} />
        <ToggleControl label="Reflections" value={c.water.reflections} onChange={(v) => useStore.getState().setWater({ reflections: v })} />
      </Section>

      <Section title="Shadow" defaultOpen={false}>
        <SliderControl label="Quality" min={0} max={1} step={0.01} value={c.shadow.quality} onChange={(v) => useStore.getState().setShadow({ quality: v })} />
        <SliderControl label="Softness" min={0} max={1} step={0.01} value={c.shadow.softness} onChange={(v) => useStore.getState().setShadow({ softness: v })} />
        <SliderControl label="Distance" min={0} max={1} step={0.01} value={c.shadow.distance} onChange={(v) => useStore.getState().setShadow({ distance: v })} />
      </Section>

      <Section title="Sky" defaultOpen={false}>
        <SliderControl label="Cloud Density" min={0} max={1} step={0.01} value={c.sky.cloudDensity} onChange={(v) => useStore.getState().setSky({ cloudDensity: v })} />
        <SliderControl label="Cloud Speed" min={0} max={1} step={0.01} value={c.sky.cloudSpeed} onChange={(v) => useStore.getState().setSky({ cloudSpeed: v })} />
        <SliderControl label="Sun Glow" min={0} max={1} step={0.01} value={c.sky.sunGlow} onChange={(v) => useStore.getState().setSky({ sunGlow: v })} />
        <SliderControl label="Moon Glow" min={0} max={1} step={0.01} value={c.sky.moonGlow} onChange={(v) => useStore.getState().setSky({ moonGlow: v })} />
      </Section>

      <Section title="Lighting" defaultOpen={false}>
        <SliderControl label="AO Strength" min={0} max={1} step={0.01} value={c.lighting.aoStrength} onChange={(v) => useStore.getState().setLighting({ aoStrength: v })} />
        <ColorPicker label="Torch Color" value={c.lighting.torchColor} onChange={(v) => useStore.getState().setLighting({ torchColor: v })} />
        <SliderControl label="Torch Intensity" min={0} max={1} step={0.01} value={c.lighting.torchIntensity} onChange={(v) => useStore.getState().setLighting({ torchIntensity: v })} />
        <SliderControl label="Time Tint" min={0} max={1} step={0.01} value={c.lighting.timeTint} onChange={(v) => useStore.getState().setLighting({ timeTint: v })} />
      </Section>

      <Section title="Post-Processing" defaultOpen={false}>
        <SliderControl label="Bloom" min={0} max={1} step={0.01} value={c.postProcessing.bloom} onChange={(v) => useStore.getState().setPostProcessing({ bloom: v })} />
        <SliderControl label="Vignette" min={0} max={1} step={0.01} value={c.postProcessing.vignette} onChange={(v) => useStore.getState().setPostProcessing({ vignette: v })} />
        <SliderControl label="Saturation" min={0} max={2} step={0.01} value={c.postProcessing.saturation} onChange={(v) => useStore.getState().setPostProcessing({ saturation: v })} />
        <SliderControl label="Contrast" min={0} max={2} step={0.01} value={c.postProcessing.contrast} onChange={(v) => useStore.getState().setPostProcessing({ contrast: v })} />
        <SliderControl label="Color Grading" min={0} max={1} step={0.01} value={c.postProcessing.colorGrading} onChange={(v) => useStore.getState().setPostProcessing({ colorGrading: v })} />
      </Section>

      <ExportButton />
    </div>
  )
}

const panelStyle: React.CSSProperties = {
  width: 320,
  padding: '12px 16px',
  background: '#1e1e1e',
  borderLeft: '1px solid #333',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  overflowY: 'auto',
  boxSizing: 'border-box',
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 600,
  color: '#eee',
  paddingBottom: 8,
}
