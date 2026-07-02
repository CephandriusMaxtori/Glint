export function generateGrassTop(): HTMLCanvasElement {
  const s = 16
  const c = document.createElement('canvas'); c.width = s; c.height = s
  const ctx = c.getContext('2d')!
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const n = () => (Math.random() - 0.5) * 18
    const r = 100 + n(), g = 160 + n(), b = 70 + n()
    ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
    ctx.fillRect(x, y, 1, 1)
  }
  return c
}

export function generateGrassSide(): HTMLCanvasElement {
  const s = 16; const c = document.createElement('canvas'); c.width = s; c.height = s
  const ctx = c.getContext('2d')!
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const n = () => (Math.random() - 0.5) * 16
    const isGrass = y < 4
    const r = isGrass ? 100 + n() : 130 + n()
    const g = isGrass ? 160 + n() : 100 + n()
    const b = isGrass ? 70 + n() : 70 + n()
    ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
    ctx.fillRect(x, y, 1, 1)
  }
  return c
}

export function generateDirt(): HTMLCanvasElement {
  const s = 16; const c = document.createElement('canvas'); c.width = s; c.height = s
  const ctx = c.getContext('2d')!
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const n = () => (Math.random() - 0.5) * 20
    ctx.fillStyle = `rgb(${(130+n())|0},${(100+n())|0},${(70+n())|0})`
    ctx.fillRect(x, y, 1, 1)
  }
  return c
}

export function generateStone(): HTMLCanvasElement {
  const s = 16; const c = document.createElement('canvas'); c.width = s; c.height = s
  const ctx = c.getContext('2d')!
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const n = () => (Math.random() - 0.5) * 25
    const dark = Math.random() < 0.08 ? -40 : 0
    const r = 130 + n() + dark; const g = 130 + n() + dark; const b = 130 + n() + dark
    ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
    ctx.fillRect(x, y, 1, 1)
  }
  return c
}

export function generatePlanks(): HTMLCanvasElement {
  const s = 16; const c = document.createElement('canvas'); c.width = s; c.height = s
  const ctx = c.getContext('2d')!
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const n = () => (Math.random() - 0.5) * 15
    const isLine = y % 4 < 2
    const base = isLine ? 140 : 175
    const r = base + n(); const g = (isLine ? 120 : 150) + n(); const b = (isLine ? 80 : 100) + n()
    ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
    ctx.fillRect(x, y, 1, 1)
  }
  return c
}

export function generateWaterTexture(): HTMLCanvasElement {
  const s = 16; const c = document.createElement('canvas'); c.width = s; c.height = s
  const ctx = c.getContext('2d')!
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const n = () => (Math.random() - 0.5) * 15
    const isWave = y % 3 === 0
    const r = 50 + n() + (isWave ? 20 : 0)
    const g = 100 + n() + (isWave ? 25 : 0)
    const b = 180 + n() + (isWave ? 20 : 0)
    ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
    ctx.fillRect(x, y, 1, 1)
  }
  return c
}
