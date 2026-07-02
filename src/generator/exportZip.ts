import JSZip from 'jszip'
import { fillTemplate, type TemplateMarkers } from './templateEngine'
import type { ShaderConfig } from '../types/config'

import waterVsh from '../templates/gbuffers_water.vsh?raw'
import waterFsh from '../templates/gbuffers_water.fsh?raw'
import terrainVsh from '../templates/gbuffers_terrain.vsh?raw'
import terrainFsh from '../templates/gbuffers_terrain.fsh?raw'
import compositeVsh from '../templates/composite.vsh?raw'
import compositeFsh from '../templates/composite.fsh?raw'
import finalVsh from '../templates/final.vsh?raw'
import finalFsh from '../templates/final.fsh?raw'
import shadowVsh from '../templates/shadow.vsh?raw'
import shadowFsh from '../templates/shadow.fsh?raw'
import shadersProperties from '../templates/shaders.properties?raw'

interface TemplateEntry {
  filename: string
  source: string
}

export function configToMarkers(config: ShaderConfig): TemplateMarkers {
  const [wr, wg, wb] = config.water.colorTint
  const waveAmp = (config.water.waveAmplitude * 0.1).toFixed(4)
  const waveSpd = config.water.waveSpeed.toFixed(2)
  const [tr, tg, tb] = config.lighting.torchColor

  const waveDisp = [
    `float wave = sin(position.x * 2.0 + position.z * 1.5 + frameTimeCounter * ${waveSpd}) * ${waveAmp};`,
    'position.y += wave;',
  ].join('\n    ')

  const reflCode = config.water.reflections
    ? [
        '#ifdef REFLECTIONS_ENABLED',
        '    vec4 reflection = texture2D(colortex1, texcoord);',
        '    albedo.rgb = mix(albedo.rgb, reflection.rgb, 0.3);',
        '#endif',
      ].join('\n    ')
    : ''

  return {
    '//__WAVE_UNIFORMS__': 'uniform float frameTimeCounter;\n',
    '//__WAVE_DISPLACEMENT__': waveDisp,
    '//__WATER_COLOR_TINT__': `const vec3 waterTint = vec3(${wr.toFixed(3)}, ${wg.toFixed(3)}, ${wb.toFixed(3)});`,
    '//__WATER_REFLECTIONS__': config.water.reflections ? '#define REFLECTIONS_ENABLED' : '',
    '//__REFLECTION_CODE__': reflCode,
    '//__AO_STRENGTH__': config.lighting.aoStrength.toFixed(3),
    '//__TORCH_COLOR__': `${tr.toFixed(3)}, ${tg.toFixed(3)}, ${tb.toFixed(3)}`,
    '//__TORCH_INTENSITY__': config.lighting.torchIntensity.toFixed(3),
    '//__TIME_TINT__': config.lighting.timeTint.toFixed(3),
    '//__SATURATION__': config.postProcessing.saturation.toFixed(3),
    '//__CONTRAST__': config.postProcessing.contrast.toFixed(3),
    '//__VIGNETTE_STRENGTH__': config.postProcessing.vignette.toFixed(3),
    '//__BLOOM_STRENGTH__': config.postProcessing.bloom.toFixed(3),
    '//__COLOR_GRADING__': config.postProcessing.colorGrading.toFixed(3),
    '//__GAMMA__': '2.2',
    '//__SHADOW_QUALITY__': config.shadow.quality.toFixed(3),
    '//__SHADOW_SOFTNESS__': config.shadow.softness.toFixed(3),
    '//__SHADOW_DISTANCE__': config.shadow.distance.toFixed(3),
    '//__SHADERPACK_NAME__': 'Minecraft Shader Generator',
  }
}

const TEMPLATES: TemplateEntry[] = [
  { filename: 'shaders/gbuffers_water.vsh', source: waterVsh },
  { filename: 'shaders/gbuffers_water.fsh', source: waterFsh },
  { filename: 'shaders/gbuffers_terrain.vsh', source: terrainVsh },
  { filename: 'shaders/gbuffers_terrain.fsh', source: terrainFsh },
  { filename: 'shaders/composite.vsh', source: compositeVsh },
  { filename: 'shaders/composite.fsh', source: compositeFsh },
  { filename: 'shaders/final.vsh', source: finalVsh },
  { filename: 'shaders/final.fsh', source: finalFsh },
  { filename: 'shaders/shadow.vsh', source: shadowVsh },
  { filename: 'shaders/shadow.fsh', source: shadowFsh },
  { filename: 'shaders/shaders.properties', source: shadersProperties },
]

export async function exportShaderpack(config: ShaderConfig): Promise<void> {
  const zip = new JSZip()
  const markers = configToMarkers(config)

  for (const entry of TEMPLATES) {
    zip.file(entry.filename, fillTemplate(entry.source, markers))
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'shaderpack.zip'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
