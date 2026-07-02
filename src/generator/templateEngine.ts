export interface TemplateMarkers {
  [key: string]: string
}

export function fillTemplate(template: string, markers: TemplateMarkers): string {
  let result = template
  for (const [key, value] of Object.entries(markers)) {
    result = result.replaceAll(key, value)
  }
  return result
}
