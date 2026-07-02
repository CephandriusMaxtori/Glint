export interface Vertex {
  pos: [number, number, number]
  uv: [number, number]
  light: [number, number]
  color: [number, number, number, number]
  normal: [number, number, number]
}

export interface Mesh {
  vao: WebGLVertexArrayObject
  vertexCount: number
  mode: number
  topology: 'triangles' | 'triangle_fan'
}

export interface Program {
  id: WebGLProgram
  hash: number
  uniforms: Record<string, WebGLUniformLocation | null>
}

export interface Pass {
  name: string
  vertSrc: string
  fragSrc: string
  outputs: string[]
  clearColor?: [number, number, number, number]
}

export interface RenderTarget {
  texture: WebGLTexture
  fbo: WebGLFramebuffer
  width: number
  height: number
}

export interface SceneMeshes {
  terrain: Mesh[]
  water: Mesh
  sky: Mesh | null
}
