import type { ShaderConfig } from '../types/config'

export const defaultConfig: ShaderConfig = {
  water: {
    colorTint: [0.2, 0.5, 0.8],
    waveAmplitude: 0.5,
    waveSpeed: 0.5,
    reflections: true,
  },
  shadow: {
    quality: 0.5,
    softness: 0.3,
    distance: 0.5,
  },
  sky: {
    cloudDensity: 0.5,
    cloudSpeed: 0.5,
    sunGlow: 0.5,
    moonGlow: 0.3,
  },
  lighting: {
    aoStrength: 0.5,
    torchColor: [1.0, 0.7, 0.3],
    torchIntensity: 0.5,
    timeTint: 0.5,
  },
  postProcessing: {
    bloom: 0.0,
    vignette: 0.0,
    saturation: 1.0,
    contrast: 1.0,
    colorGrading: 0.0,
  },
}
