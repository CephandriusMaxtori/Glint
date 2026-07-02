#version 150 compatibility

/*
 * final.fsh — Final output pass
 * ==============================
 * Applies gamma correction and color grading (LUT-style tint).
 *
 * Injection markers:
 *   //__COLOR_GRADING__ — color grading amount (0.0–1.0, default 0.0)
 *   //__GAMMA__         — gamma value (default 2.2)
 */

/* RENDERTARGETS: 0 */

uniform sampler2D colortex0;

in vec2 texcoord;

const float COLOR_GRADING = //__COLOR_GRADING__;
const float GAMMA = //__GAMMA__;

void main() {
    vec4 color = texture2D(colortex0, texcoord);

    // Gamma correction
    color.rgb = pow(color.rgb, vec3(1.0 / GAMMA));

    // Simple color grade — shift midtones toward warm or cool
    vec3 grade = vec3(1.0);
    grade.rb += (COLOR_GRADING - 0.5) * 0.15;
    color.rgb *= grade;

    /* DRAWBUFFERS: 0 */
    gl_FragData[0] = color;
}
