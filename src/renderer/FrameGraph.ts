export interface FramebufferSet {
  colortex0: WebGLFramebuffer
  colortex1: WebGLFramebuffer
  tex0: WebGLTexture
  tex1: WebGLTexture
}

export function createFramebuffers(gl: WebGL2RenderingContext, w: number, h: number): FramebufferSet {
  function makeTex(): WebGLTexture {
    const t = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.FLOAT, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return t
  }

  const tex0 = makeTex()
  const tex1 = makeTex()

  function makeFbo(tex: WebGLTexture): WebGLFramebuffer {
    const fbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
    return fbo
  }

  const colortex0 = makeFbo(tex0)
  const colortex1 = makeFbo(tex1)

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  return { colortex0, colortex1, tex0, tex1 }
}

export function resizeFramebuffers(gl: WebGL2RenderingContext, fb: FramebufferSet, w: number, h: number): void {
  function resizeTex(tex: WebGLTexture) {
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.FLOAT, null)
  }
  resizeTex(fb.tex0)
  resizeTex(fb.tex1)
}
