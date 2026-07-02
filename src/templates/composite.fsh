#version 150 compatibility

/*
 * composite.fsh — Post-processing pass
 * ======================================
 * Applies saturation, contrast, vignette, and bloom effects.
 *
 * Injection markers:
 *   //__SATURATION__       — saturation multiplier (default 1.0)
 *   //__CONTRAST__         — contrast multiplier (default 1.0)
 *   //__VIGNETTE_STRENGTH__ — vignette strength (default 0.0)
 *   //__BLOOM_STRENGTH__   — bloom strength (default 0.0)
 */

/* RENDERTARGETS: 0 */

uniform sampler2D colortex0;
uniform sampler2D colortex1;

in vec2 texcoord;

const float SATURATION = //__SATURATION__;
const float CONTRAST = //__CONTRAST__;
const float VIGNETTE_STRENGTH = //__VIGNETTE_STRENGTH__;
const float BLOOM_STRENGTH = //__BLOOM_STRENGTH__;

vec3 applySaturation(vec3 c, float s) {
    float luma = dot(c, vec3(0.299, 0.587, 0.114));
    return mix(vec3(luma), c, s);
}

vec3 applyContrast(vec3 c, float contrast) {
    return (c - 0.5) * contrast + 0.5;
}

float vignette(vec2 uv, float strength) {
    vec2 d = uv - 0.5;
    return 1.0 - dot(d, d) * strength * 1.5;
}

void main() {
    vec4 color = texture2D(colortex0, texcoord);

    color.rgb = applyContrast(color.rgb, CONTRAST);
    color.rgb = applySaturation(color.rgb, SATURATION);
    color.rgb *= vignette(texcoord, VIGNETTE_STRENGTH);

    /* DRAWBUFFERS: 0 */
    gl_FragData[0] = color;
}
