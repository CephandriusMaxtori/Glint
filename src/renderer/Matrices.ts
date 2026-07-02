export type Mat4 = Float32Array
export type Vec3 = [number, number, number]

export function mat4(): Mat4 {
  const m = new Float32Array(16)
  m[0] = m[5] = m[10] = m[15] = 1
  return m
}

export function perspective(out: Mat4, fovY: number, aspect: number, near: number, far: number): void {
  const f = 1 / Math.tan(fovY / 2)
  const nf = 1 / (near - far)
  out.fill(0)
  out[0] = f / aspect
  out[5] = f
  out[10] = (far + near) * nf
  out[11] = -1
  out[14] = 2 * far * near * nf
}

export function lookAt(out: Mat4, eye: Vec3, center: Vec3, up: Vec3): void {
  let x0, x1, x2, y0, y1, y2, z0, z1, z2, len

  z0 = eye[0] - center[0]; z1 = eye[1] - center[1]; z2 = eye[2] - center[2]
  len = 1 / Math.hypot(z0, z1, z2)
  z0 *= len; z1 *= len; z2 *= len

  x0 = up[1] * z2 - up[2] * z1
  x1 = up[2] * z0 - up[0] * z2
  x2 = up[0] * z1 - up[1] * z0
  len = 1 / Math.hypot(x0, x1, x2)
  x0 *= len; x1 *= len; x2 *= len

  y0 = z1 * x2 - z2 * x1
  y1 = z2 * x0 - z0 * x2
  y2 = z0 * x1 - z1 * x0

  out[0] = x0; out[1] = y0; out[2] = z0; out[3] = 0
  out[4] = x1; out[5] = y1; out[6] = z1; out[7] = 0
  out[8] = x2; out[9] = y2; out[10] = z2; out[11] = 0
  out[12] = -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2])
  out[13] = -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2])
  out[14] = -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2])
  out[15] = 1
}

export function multiply(a: Mat4, b: Mat4, out: Mat4): void {
  for (let i = 0; i < 4; i++) {
    const ai0 = a[i], ai1 = a[i + 4], ai2 = a[i + 8], ai3 = a[i + 12]
    out[i]      = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3]
    out[i + 4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7]
    out[i + 8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11]
    out[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15]
  }
}

export function inverse(m: Mat4, out: Mat4): void {
  const [
    a00, a01, a02, a03, a10, a11, a12, a13,
    a20, a21, a22, a23, a30, a31, a32, a33,
  ] = m

  const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10
  const b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11
  const b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12
  const b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30
  const b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31
  const b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32

  const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
  if (!det) return
  const invDet = 1 / det

  out[0]  = ( a11 * b11 - a12 * b10 + a13 * b09) * invDet
  out[1]  = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet
  out[2]  = ( a31 * b05 - a32 * b04 + a33 * b03) * invDet
  out[3]  = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet
  out[4]  = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet
  out[5]  = ( a00 * b11 - a02 * b08 + a03 * b07) * invDet
  out[6]  = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet
  out[7]  = ( a20 * b05 - a22 * b02 + a23 * b01) * invDet
  out[8]  = ( a10 * b10 - a11 * b08 + a13 * b06) * invDet
  out[9]  = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet
  out[10] = ( a30 * b04 - a31 * b02 + a33 * b00) * invDet
  out[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet
  out[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet
  out[13] = ( a00 * b09 - a01 * b07 + a02 * b06) * invDet
  out[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet
  out[15] = ( a20 * b03 - a21 * b01 + a22 * b00) * invDet
}

export function transpose(m: Mat4, out: Mat4): void {
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
      out[i * 4 + j] = m[j * 4 + i]
}
