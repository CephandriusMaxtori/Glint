#version 150 compatibility

/*
 * shadow.fsh — Shadow pass fragment shader
 * =========================================
 * Renders depth from light's perspective with configurable
 * quality and softness settings.
 *
 * Injection markers:
 *   //__SHADOW_QUALITY__  — shadow map resolution multiplier (0.0–1.0)
 *   //__SHADOW_SOFTNESS__ — shadow edge softness (0.0–1.0)
 *   //__SHADOW_DISTANCE__ — shadow render distance multiplier (0.0–1.0)
 */

/* RENDERTARGETS: 0 */

const float SHADOW_QUALITY = //__SHADOW_QUALITY__;
const float SHADOW_SOFTNESS = //__SHADOW_SOFTNESS__;
const float SHADOW_DISTANCE = //__SHADOW_DISTANCE__;

void main() {
    float depth = gl_FragCoord.z;

    // Softness: bias based on slope
    float bias = 0.001 + SHADOW_SOFTNESS * 0.005;

    gl_FragDepth = depth - bias;

    /* DRAWBUFFERS: 0 */
    gl_FragData[0] = vec4(depth);
}
