export interface WaterConfig {
  colorTint: [number, number, number]
  waveAmplitude: number
  waveSpeed: number
  reflections: boolean
}

export interface ShadowConfig {
  quality: number
  softness: number
  distance: number
}

export interface SkyConfig {
  cloudDensity: number
  cloudSpeed: number
  sunGlow: number
  moonGlow: number
}

export interface LightingConfig {
  aoStrength: number
  torchColor: [number, number, number]
  torchIntensity: number
  timeTint: number
}

export interface PostProcessingConfig {
  bloom: number
  vignette: number
  saturation: number
  contrast: number
  colorGrading: number
}

export interface ShaderConfig {
  water: WaterConfig
  shadow: ShadowConfig
  sky: SkyConfig
  lighting: LightingConfig
  postProcessing: PostProcessingConfig
}
