import { create } from 'zustand'
import type {
  ShaderConfig,
  WaterConfig,
  ShadowConfig,
  SkyConfig,
  LightingConfig,
  PostProcessingConfig,
} from '../types/config'
import { defaultConfig } from './defaults'
import { presets } from './presets'

export interface ShaderStore {
  config: ShaderConfig
  setWater: (water: Partial<WaterConfig>) => void
  setShadow: (shadow: Partial<ShadowConfig>) => void
  setSky: (sky: Partial<SkyConfig>) => void
  setLighting: (lighting: Partial<LightingConfig>) => void
  setPostProcessing: (pp: Partial<PostProcessingConfig>) => void
  setConfig: (config: ShaderConfig) => void
  loadPreset: (index: number) => void
}

export const useStore = create<ShaderStore>((set) => ({
  config: { ...defaultConfig },
  setWater: (water) =>
    set((s) => ({ config: { ...s.config, water: { ...s.config.water, ...water } } })),
  setShadow: (shadow) =>
    set((s) => ({ config: { ...s.config, shadow: { ...s.config.shadow, ...shadow } } })),
  setSky: (sky) =>
    set((s) => ({ config: { ...s.config, sky: { ...s.config.sky, ...sky } } })),
  setLighting: (lighting) =>
    set((s) => ({ config: { ...s.config, lighting: { ...s.config.lighting, ...lighting } } })),
  setPostProcessing: (pp) =>
    set((s) => ({ config: { ...s.config, postProcessing: { ...s.config.postProcessing, ...pp } } })),
  setConfig: (config) => set({ config }),
  loadPreset: (index) => {
    const preset = presets[index]
    if (preset) set({ config: structuredClone(preset.config) })
  },
}))
