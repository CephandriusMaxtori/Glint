import type { Program } from './types'

function hashSource(src: string): number {
  let h = 0
  for (let i = 0; i < src.length; i++) {
    h = ((h << 5) - h + src.charCodeAt(i)) | 0
  }
  return h
}

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`Shader compile error (${type === gl.VERTEX_SHADER ? 'vert' : 'frag'}):`, gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function createProgram(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string): Program | null {
  const hash = hashSource(vertSrc) ^ (hashSource(fragSrc) * 31)

  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc)
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc)
  if (!vert || !frag) return null

  const prog = gl.createProgram()
  if (!prog) return null

  gl.attachShader(prog, vert)
  gl.attachShader(prog, frag)
  gl.linkProgram(prog)

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(prog))
    gl.deleteProgram(prog)
    return null
  }

  gl.deleteShader(vert)
  gl.deleteShader(frag)

  const numUniforms = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS)
  const uniforms: Record<string, WebGLUniformLocation | null> = {}
  for (let i = 0; i < numUniforms; i++) {
    const info = gl.getActiveUniform(prog, i)
    if (info) {
      uniforms[info.name] = gl.getUniformLocation(prog, info.name)
    }
  }

  return { id: prog, hash, uniforms }
}

export class ShaderCache {
  private cache = new Map<number, Program>()

  getOrCreate(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string): Program | null {
    const hash = hashSource(vertSrc) ^ (hashSource(fragSrc) * 31)
    const existing = this.cache.get(hash)
    if (existing) return existing

    const prog = createProgram(gl, vertSrc, fragSrc)
    if (prog) this.cache.set(hash, prog)
    return prog
  }

  clear(): void {
    this.cache.clear()
  }
}
