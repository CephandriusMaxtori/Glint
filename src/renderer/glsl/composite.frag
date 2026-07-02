#version 300 es
precision highp float;

in vec2 texcoord;

uniform sampler2D colortex0;

layout(location = 0) out vec4 fragColor0;

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
    vec4 color = texture(colortex0, texcoord);
    color.rgb = applyContrast(color.rgb, CONTRAST);
    color.rgb = applySaturation(color.rgb, SATURATION);
    color.rgb *= vignette(texcoord, VIGNETTE_STRENGTH);
    fragColor0 = color;
}
