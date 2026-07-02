#version 300 es
precision highp float;

in vec2 texcoord;
in vec2 lightcoord;
in vec4 vertexColor;
in vec3 eyeNormal;

uniform sampler2D tex;
uniform sampler2D lightmap;

layout(location = 0) out vec4 fragColor0;
layout(location = 1) out vec4 fragColor1;

//__WATER_COLOR_TINT__
//__WATER_REFLECTIONS__

#ifdef REFLECTIONS_ENABLED
uniform sampler2D colortex1;
#endif

void main() {
    vec4 albedo = texture(tex, texcoord) * vertexColor;
    albedo.rgb *= waterTint;

    vec4 lm = texture(lightmap, lightcoord);
    albedo.rgb *= lm.rgb;

    //__REFLECTION_CODE__

    fragColor0 = albedo;
    fragColor1 = vec4(lightcoord, 0.0, 1.0);
}
