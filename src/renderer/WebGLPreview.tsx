import { useEffect, useRef } from 'react'
import { useStore } from '../config/store'
import { fillTemplate, type TemplateMarkers } from '../generator/templateEngine'
import { configToMarkers } from '../generator/exportZip'
import { ShaderCache } from './ShaderCompiler'
import { createCamera } from './Camera'
import { buildBlock, buildWaterPlane } from './MeshBuilder'
import { generateGrassTop, generateGrassSide, generateDirt, generateStone, generatePlanks, generateWaterTexture } from './textures'

// Preview shader templates
import waterVert from './glsl/gbuffers_water.vert?raw'
import waterFrag from './glsl/gbuffers_water.frag?raw'
import terrainVert from './glsl/gbuffers_terrain.vert?raw'
import terrainFrag from './glsl/gbuffers_terrain.frag?raw'
import finalVert from './glsl/final.vert?raw'
import finalFrag from './glsl/final.frag?raw'

const STRIDE = 14 * 4 // 14 floats per vertex
const POS_OFF = 0
const UV_OFF = 12
const LIGHT_OFF = 20
const COLOR_OFF = 28
const NORMAL_OFF = 44

function setupAttributes(gl: WebGL2RenderingContext, vao: WebGLVertexArrayObject, buf: WebGLBuffer): void {
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)

  gl.enableVertexAttribArray(0) // aPosition
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, STRIDE, POS_OFF)
  gl.enableVertexAttribArray(1) // aTexcoord
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, STRIDE, UV_OFF)
  gl.enableVertexAttribArray(2) // aLightcoord
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, STRIDE, LIGHT_OFF)
  gl.enableVertexAttribArray(3) // aColor
  gl.vertexAttribPointer(3, 4, gl.FLOAT, false, STRIDE, COLOR_OFF)
  gl.enableVertexAttribArray(4) // aNormal
  gl.vertexAttribPointer(4, 3, gl.FLOAT, false, STRIDE, NORMAL_OFF)

  gl.bindVertexArray(null)
}

function setupQuad(gl: WebGL2RenderingContext): { vao: WebGLVertexArrayObject; buf: WebGLBuffer } {
  const vao = gl.createVertexArray()!
  const buf = gl.createBuffer()!
  const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0)
  gl.bindVertexArray(null)
  return { vao, buf }
}

interface BlockGroup {
  vao: WebGLVertexArrayObject
  vbuf: WebGLBuffer
  ibuf: WebGLBuffer
  indexCount: number
  texture: WebGLTexture | null
}

type TexGen = () => HTMLCanvasElement

const TEX_GENERATORS: Record<string, TexGen> = {
  grassTop: generateGrassTop,
  grassSide: generateGrassSide,
  dirt: generateDirt,
  stone: generateStone,
  planks: generatePlanks,
  water: generateWaterTexture,
}

function uploadTexture(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement): WebGLTexture {
  const t = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, t)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  return t
}

function buildLightmap(gl: WebGL2RenderingContext): WebGLTexture {
  const c = document.createElement('canvas')
  c.width = 16; c.height = 16
  const ctx = c.getContext('2d')!
  const d = ctx.createImageData(16, 16)
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const i = (y * 16 + x) * 4
      const sky = x / 15, block = y / 15
      const bri = 0.3 + 0.7 * Math.max(sky * 0.7 + block * 0.3, block * 0.5)
      d.data[i] = Math.min(255, bri * (200 + 55 * sky))
      d.data[i + 1] = Math.min(255, bri * (180 + 75 * sky))
      d.data[i + 2] = Math.min(255, bri * (150 + 105 * sky))
      d.data[i + 3] = 255
    }
  }
  ctx.putImageData(d, 0, 0)
  return uploadTexture(gl, c)
}

function createFBO(gl: WebGL2RenderingContext, w: number, h: number): { fbo: WebGLFramebuffer; tex0: WebGLTexture; tex1: WebGLTexture } {
  function makeTex(): WebGLTexture {
    const t = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return t
  }
  const tex0 = makeTex(), tex1 = makeTex()
  const fbo = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex0, 0)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, tex1, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return { fbo, tex0, tex1 }
}

export function WebGLPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false })!
    if (!gl) return

    // --- Init ---
    const shaderCache = new ShaderCache()
    const camera = createCamera()

    // Textures
    const texCache: Record<string, WebGLTexture> = {}
    for (const [name, gen] of Object.entries(TEX_GENERATORS)) {
      texCache[name] = uploadTexture(gl, gen())
    }
    const lightmapTex = buildLightmap(gl)

    // FBO
    let fb = createFBO(gl, canvas.clientWidth || 640, canvas.clientHeight || 480)
    let quad = setupQuad(gl)

    // Build scene geometry
    function buildScene(): { groups: BlockGroup[]; waterGroup: BlockGroup } {
      const groups: BlockGroup[] = []

      function addGroup(vertices: Float32Array, indices: Uint16Array, tex: WebGLTexture | null): BlockGroup {
        const vao = gl.createVertexArray()!
        const vbuf = gl.createBuffer()!
        const ibuf = gl.createBuffer()!
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuf)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
        setupAttributes(gl, vao, vbuf)
        return { vao, vbuf, ibuf, indexCount: indices.length, texture: tex }
      }

      // Ground (5x5 dirt)
      const allVerts: number[] = []
      const allIndices: number[] = []
      let base = 0
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          const b = buildBlock(x, -0.5, z, 1, [2, 2, 2, 2, 2, 2])
          for (let i = 0; i < b.vertices.length; i++) allVerts.push(b.vertices[i])
          for (let i = 0; i < b.indices.length; i++) allIndices.push(b.indices[i] + base)
          base += b.vertices.length / 14
        }
      }
      groups.push(addGroup(new Float32Array(allVerts), new Uint16Array(allIndices), texCache.dirt))

      // Grass block (per-face)
      const grass = buildBlock(-2, 0.5, 1.5, 1, [0, 0, 0, 2, 0, 0])
      groups.push(addGroup(grass.vertices, grass.indices, texCache.grassSide))

      // Stone
      const stone = buildBlock(2, 0.5, 1, 1, [3, 3, 3, 3, 3, 3])
      groups.push(addGroup(stone.vertices, stone.indices, texCache.stone))

      // Planks
      const planks = buildBlock(0, 0.5, -2, 1, [4, 4, 4, 4, 4, 4])
      groups.push(addGroup(planks.vertices, planks.indices, texCache.planks))

      // Extra dirt
      const dirt2 = buildBlock(1.5, 0.5, 2.5, 1, [2, 2, 2, 2, 2, 2])
      groups.push(addGroup(dirt2.vertices, dirt2.indices, texCache.dirt))

      // Water
      const water = buildWaterPlane(48, 5)
      const waterGroup = addGroup(water.vertices, water.indices, texCache.water)

      return { groups, waterGroup }
    }

    let scene = buildScene()
    let lastMarkersHash = 0

    // Shader source fill
    function fillShaders(markers: TemplateMarkers): { terrain: { vert: string; frag: string }; water: { vert: string; frag: string }; final: { vert: string; frag: string } } | null {
      try {
        return {
          terrain: { vert: fillTemplate(terrainVert, markers), frag: fillTemplate(terrainFrag, markers) },
          water: { vert: fillTemplate(waterVert, markers), frag: fillTemplate(waterFrag, markers) },
          final: { vert: fillTemplate(finalVert, markers), frag: fillTemplate(finalFrag, markers) },
        }
      } catch { return null }
    }

    // Get or create programs
    const initialMarkers = configToMarkers(useStore.getState().config)
    let progTerrain = shaderCache.getOrCreate(gl, fillTemplate(terrainVert, initialMarkers), fillTemplate(terrainFrag, initialMarkers))!
    let progWater = shaderCache.getOrCreate(gl, fillTemplate(waterVert, initialMarkers), fillTemplate(waterFrag, initialMarkers))!
    let progFinal = shaderCache.getOrCreate(gl, fillTemplate(finalVert, initialMarkers), fillTemplate(finalFrag, initialMarkers))!

    let time = 0
    let animId = 0

    function render(): void {
      animId = requestAnimationFrame(render)
      time += 0.016

      // Check config changes
      const config = useStore.getState().config
      const markers = configToMarkers(config)

      // Compute hash of all marker values to detect changes
      let hash = 0
      for (const v of Object.values(markers)) {
        hash = ((hash << 5) - hash + v.length) | 0
      }
      if (hash !== lastMarkersHash) {
        lastMarkersHash = hash
        const filled = fillShaders(markers)
        if (filled) {
          const newT = shaderCache.getOrCreate(gl, filled.terrain.vert, filled.terrain.frag)
          const newW = shaderCache.getOrCreate(gl, filled.water.vert, filled.water.frag)
          const newF = shaderCache.getOrCreate(gl, filled.final.vert, filled.final.frag)
          if (newT) progTerrain = newT
          if (newW) progWater = newW
          if (newF) progFinal = newF
        }
      }

      // Resize
      const w = canvas.clientWidth, h = canvas.clientHeight
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h
        gl.viewport(0, 0, w, h)
        fb = createFBO(gl, w, h)
        quad = setupQuad(gl)
        scene = buildScene()
      }

      // Camera
      camera.update(w / h)

      // --- Gbuffers pass ---
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb.fbo)
      gl.viewport(0, 0, w, h)
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1])
      gl.clearColor(0.5, 0.65, 0.8, 1)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.enable(gl.DEPTH_TEST)
      gl.disable(gl.BLEND)

      // Terrain blocks
      gl.useProgram(progTerrain.id)
      gl.uniformMatrix4fv(progTerrain.uniforms['viewMatrix'], false, camera.viewMatrix)
      gl.uniformMatrix4fv(progTerrain.uniforms['projectionMatrix'], false, camera.projectionMatrix)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, lightmapTex)
      gl.uniform1i(progTerrain.uniforms['lightmap'], 1)

      for (const g of scene.groups) {
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, g.texture)
        gl.uniform1i(progTerrain.uniforms['texture'], 0)
        gl.bindVertexArray(g.vao)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g.ibuf)
        gl.drawElements(gl.TRIANGLES, g.indexCount, gl.UNSIGNED_SHORT, 0)
      }

      // Water
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.useProgram(progWater.id)
      gl.uniformMatrix4fv(progWater.uniforms['viewMatrix'], false, camera.viewMatrix)
      gl.uniformMatrix4fv(progWater.uniforms['projectionMatrix'], false, camera.projectionMatrix)
      gl.uniform1f(progWater.uniforms['frameTimeCounter'], time)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, scene.waterGroup.texture)
      gl.uniform1i(progWater.uniforms['texture'], 0)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, lightmapTex)
      gl.uniform1i(progWater.uniforms['lightmap'], 1)
      gl.bindVertexArray(scene.waterGroup.vao)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, scene.waterGroup.ibuf)
      gl.drawElements(gl.TRIANGLES, scene.waterGroup.indexCount, gl.UNSIGNED_SHORT, 0)

      // --- Final pass (to screen) ---
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, w, h)
      gl.disable(gl.DEPTH_TEST)
      gl.disable(gl.BLEND)
      gl.useProgram(progFinal.id)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, fb.tex0)
      gl.uniform1i(progFinal.uniforms['colortex0'], 0)
      gl.bindVertexArray(quad.vao)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      shaderCache.clear()
    }
  }, [])

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
}
