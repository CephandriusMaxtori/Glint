#version 150 compatibility

/*
 * gbuffers_terrain.fsh — Terrain fragment shader
 * ===============================================
 * Samples texture, applies lightmap with configurable
 * ambient occlusion strength, torch color, and time tint.
 *
 * Injection markers:
 *   //__AO_STRENGTH__     — ambient occlusion strength (0.0–1.0)
 *   //__TORCH_COLOR__     — torch/block light color as vec3(r,g,b)
 *   //__TORCH_INTENSITY__ — torch light intensity multiplier
 *   //__TIME_TINT__       — time-of-day tint amount (0.0–1.0)
 */

/* RENDERTARGETS: 0,1 */

in vec2 texcoord;
in vec2 lightcoord;
in vec4 vertexColor;
in vec3 normal;

uniform sampler2D texture;
uniform sampler2D lightmap;

const float AO_STRENGTH = //__AO_STRENGTH__;
const vec3 TORCH_COLOR = vec3(//__TORCH_COLOR__);
const float TORCH_INTENSITY = //__TORCH_INTENSITY__;
const float TIME_TINT = //__TIME_TINT__;

void main() {
    vec4 albedo = texture2D(texture, texcoord) * vertexColor;

    vec4 lm = texture2D(lightmap, lightcoord);

    // Apply torch color to block light channel (lm.r = torch, lm.g = sky)
    vec3 torchLight = mix(vec3(1.0), TORCH_COLOR, TORCH_INTENSITY);
    vec3 lightColor = lm.r * torchLight + lm.g * vec3(1.0);

    // Apply AO as darkening of ambient-only areas
    float ao = mix(1.0, lm.g, 1.0 - AO_STRENGTH);
    lightColor *= ao;

    albedo.rgb *= lightColor;

    /* DRAWBUFFERS: 07 */
    gl_FragData[0] = albedo;
    gl_FragData[1] = vec4(lightcoord, 0.0, 1.0);
}
