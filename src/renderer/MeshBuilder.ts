// Block face normals and vertex layout
const FACES = [
  { dir: [0, 1, 0], verts: (x: number, y: number, z: number, s: number): [number, number, number][] => [  // top
    [x,   y+s, z],   [x+s, y+s, z],   [x+s, y+s, z+s], [x,   y+s, z+s]
  ]},
  { dir: [0, -1, 0], verts: (x: number, y: number, z: number, s: number): [number, number, number][] => [ // bottom
    [x,   y, z+s], [x+s, y, z+s], [x+s, y, z],   [x,   y, z]
  ]},
  { dir: [0, 0, 1], verts: (x: number, y: number, z: number, s: number): [number, number, number][] => [  // front
    [x,   y,   z+s], [x+s, y,   z+s], [x+s, y+s, z+s], [x,   y+s, z+s]
  ]},
  { dir: [0, 0, -1], verts: (x: number, y: number, z: number, s: number): [number, number, number][] => [ // back
    [x+s, y,   z], [x,   y,   z], [x,   y+s, z], [x+s, y+s, z]
  ]},
  { dir: [1, 0, 0], verts: (x: number, y: number, z: number, s: number): [number, number, number][] => [  // right
    [x+s, y,   z],   [x+s, y,   z+s], [x+s, y+s, z+s], [x+s, y+s, z]
  ]},
  { dir: [-1, 0, 0], verts: (x: number, y: number, z: number, s: number): [number, number, number][] => [ // left
    [x, y,   z+s], [x, y,   z], [x, y+s, z], [x, y+s, z+s]
  ]},
]

export interface BlockMeshData {
  vertices: Float32Array
  indices: Uint16Array
}

export function buildBlock(
  bx: number, by: number, bz: number,
  size: number,
  faceTexLayers: number[], // 6 entries, one per face, -1 = skip
  lightTop: number = 1, lightSide: number = 0.6, lightBottom: number = 0.2,
): BlockMeshData {
  const verts: number[] = []
  const inds: number[] = []
  let base = 0

  for (let f = 0; f < 6; f++) {
    const layer = faceTexLayers[f]
    if (layer < 0) continue

    const face = FACES[f]
    const positions = face.verts(bx, by, bz, size)
    const [nx, ny, nz] = face.dir
    const lightVal = f === 1 ? lightBottom : (f === 0 ? lightTop : lightSide)

    for (let v = 0; v < 4; v++) {
      const [px, py, pz] = positions[v]
      const u = v === 1 || v === 2 ? 1 : 0
      const vt = v === 2 || v === 3 ? 1 : 0
      verts.push(px, py, pz)                // pos 3
      verts.push(u, vt)                     // uv 2
      verts.push(lightVal, lightVal)         // lightcoord 2
      verts.push(1, 1, 1, 1)                // color 4
      verts.push(nx, ny, nz)                // normal 3
      // layer index as float for texture array (but we'll use separate textures)
    }

    inds.push(base, base + 1, base + 2, base, base + 2, base + 3)
    base += 4
  }

  return { vertices: new Float32Array(verts), indices: new Uint16Array(inds) }
}

export function buildWaterPlane(subdiv: number, size: number): { vertices: Float32Array; indices: Uint16Array } {
  const verts: number[] = []
  const inds: number[] = []
  const half = size / 2

  for (let iz = 0; iz <= subdiv; iz++) {
    for (let ix = 0; ix <= subdiv; ix++) {
      const x = -half + (ix / subdiv) * size
      const z = -half + (iz / subdiv) * size
      const u = ix / subdiv
      const v = iz / subdiv
      verts.push(x, 0, z)       // pos
      verts.push(u, v)          // uv
      verts.push(1, 0.5)        // lightcoord
      verts.push(1, 1, 1, 1)    // color
      verts.push(0, 1, 0)       // normal
    }
  }

  for (let iz = 0; iz < subdiv; iz++) {
    for (let ix = 0; ix < subdiv; ix++) {
      const a = iz * (subdiv + 1) + ix
      const b = a + 1
      const c = (iz + 1) * (subdiv + 1) + ix
      const d = c + 1
      inds.push(a, b, c, b, d, c)
    }
  }

  return { vertices: new Float32Array(verts), indices: new Uint16Array(inds) }
}
