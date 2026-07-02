import type { ShaderConfig } from '../types/config'

export interface Preset {
  name: string
  description: string
  config: ShaderConfig
}

export const presets: Preset[] = [
  {
    name: 'Vanilla+',
    description: 'Slightly enhanced vanilla look',
    config: {
      water: { colorTint: [0.2, 0.5, 0.8], waveAmplitude: 0.4, waveSpeed: 0.5, reflections: true },
      shadow: { quality: 0.5, softness: 0.3, distance: 0.5 },
      sky: { cloudDensity: 0.5, cloudSpeed: 0.5, sunGlow: 0.5, moonGlow: 0.3 },
      lighting: { aoStrength: 0.5, torchColor: [1.0, 0.7, 0.3], torchIntensity: 0.5, timeTint: 0.5 },
      postProcessing: { bloom: 0, vignette: 0, saturation: 1.0, contrast: 1.0, colorGrading: 0 },
    },
  },
  {
    name: 'Tropical',
    description: 'Bright cyan water with gentle waves',
    config: {
      water: { colorTint: [0.1, 0.7, 0.9], waveAmplitude: 0.2, waveSpeed: 0.3, reflections: true },
      shadow: { quality: 0.5, softness: 0.3, distance: 0.5 },
      sky: { cloudDensity: 0.4, cloudSpeed: 0.3, sunGlow: 0.7, moonGlow: 0.2 },
      lighting: { aoStrength: 0.3, torchColor: [1.0, 0.8, 0.4], torchIntensity: 0.6, timeTint: 0.4 },
      postProcessing: { bloom: 0.2, vignette: 0.1, saturation: 1.2, contrast: 1.0, colorGrading: 0.1 },
    },
  },
  {
    name: 'Murky Swamp',
    description: 'Dark green-brown water, still surface',
    config: {
      water: { colorTint: [0.2, 0.3, 0.1], waveAmplitude: 0.1, waveSpeed: 0.2, reflections: false },
      shadow: { quality: 0.6, softness: 0.5, distance: 0.4 },
      sky: { cloudDensity: 0.8, cloudSpeed: 0.2, sunGlow: 0.2, moonGlow: 0.4 },
      lighting: { aoStrength: 0.8, torchColor: [1.0, 0.5, 0.1], torchIntensity: 0.7, timeTint: 0.7 },
      postProcessing: { bloom: 0, vignette: 0.4, saturation: 0.7, contrast: 1.1, colorGrading: 0.4 },
    },
  },
]
