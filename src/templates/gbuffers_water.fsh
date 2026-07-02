#version 150 compatibility

/*
 * gbuffers_water.fsh — Water fragment shader
 * ===========================================
 *
 * Injection markers (replaced by the shader generator):
 *   //__WATER_COLOR_TINT__     — e.g. "const vec3 waterTint = vec3(0.2, 0.5, 0.8);"
 *   //__WATER_REFLECTIONS__    — e.g. "#define REFLECTIONS_ENABLED"  (or blank)
 *   //__REFLECTION_CODE__      — actual reflection blend code (or blank)
 *
 * This shader receives the water surface fragment data, applies color
 * tinting, lightmap modulation, and optional reflection blending.
 */

/* RENDERTARGETS: 0,1 */

in vec2 texcoord;
in vec2 lightcoord;
in vec4 vertexColor;
in vec3 eyeNormal;

uniform sampler2D texture;
uniform sampler2D lightmap;

//__WATER_COLOR_TINT__

//__WATER_REFLECTIONS__

#ifdef REFLECTIONS_ENABLED
uniform sampler2D colortex1;
#endif

void main() {
    vec4 albedo = texture2D(texture, texcoord) * vertexColor;

    albedo.rgb *= waterTint;

    vec4 lm = texture2D(lightmap, lightcoord);
    albedo.rgb *= lm.rgb;

    //__REFLECTION_CODE__

    /* DRAWBUFFERS: 07 */
    gl_FragData[0] = albedo;
    gl_FragData[1] = vec4(lightcoord, 0.0, 1.0);
}
