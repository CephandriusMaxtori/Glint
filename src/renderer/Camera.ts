import { mat4, perspective, lookAt, type Mat4, type Vec3 } from './Matrices'

export interface CameraData {
  projectionMatrix: Mat4
  viewMatrix: Mat4
  modelViewMatrix: Mat4
  normalMatrix: Float32Array
  position: Vec3
  target: Vec3
  update: (aspect: number) => void
}

export function createCamera(): CameraData {
  const projectionMatrix = mat4()
  const viewMatrix = mat4()
  const modelViewMatrix = mat4()
  const normalMatrix = new Float32Array(9)

  const position: Vec3 = [6, 5, 7]
  const target: Vec3 = [0, 0.5, 0]
  const up: Vec3 = [0, 1, 0]

  function update(aspect: number): void {
    perspective(projectionMatrix, Math.PI / 3.5, aspect, 0.1, 100)
    lookAt(viewMatrix, position, target, up)

    // modelView = view (no model transform for world-space)
    modelViewMatrix.set(viewMatrix)

    // normalMatrix = transpose(inverse(upper-left 3x3 of modelView))
    const m = modelViewMatrix
    const a00 = m[0], a01 = m[1], a02 = m[2]
    const a10 = m[4], a11 = m[5], a12 = m[6]
    const a20 = m[8], a21 = m[9], a22 = m[10]

    const det = a00 * (a11 * a22 - a12 * a21) - a01 * (a10 * a22 - a12 * a20) + a02 * (a10 * a21 - a11 * a20)
    if (det) {
      const invDet = 1 / det
      // Compute inverse of 3x3
      const b00 = (a11 * a22 - a12 * a21) * invDet
      const b01 = (a02 * a21 - a01 * a22) * invDet
      const b02 = (a01 * a12 - a02 * a11) * invDet
      const b10 = (a12 * a20 - a10 * a22) * invDet
      const b11 = (a00 * a22 - a02 * a20) * invDet
      const b12 = (a02 * a10 - a00 * a12) * invDet
      const b20 = (a10 * a21 - a11 * a20) * invDet
      const b21 = (a01 * a20 - a00 * a21) * invDet
      const b22 = (a00 * a11 - a01 * a10) * invDet
      // Transpose (swap indices for row/col)
      normalMatrix[0] = b00; normalMatrix[1] = b10; normalMatrix[2] = b20
      normalMatrix[3] = b01; normalMatrix[4] = b11; normalMatrix[5] = b21
      normalMatrix[6] = b02; normalMatrix[7] = b12; normalMatrix[8] = b22
    }
  }

  return { projectionMatrix, viewMatrix, modelViewMatrix, normalMatrix, position, target, update }
}
