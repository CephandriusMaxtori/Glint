#version 300 es
precision highp float;

in vec2 texcoord;
in vec2 lightcoord;
in vec4 vertexColor;
in vec3 eyeNormal;

uniform sampler2D texture;
uniform sampler2D lightmap;

layout(location = 0) out vec4 fragColor0;
layout(location = 1) out vec4 fragColor1;

const float AO_STRENGTH = //__AO_STRENGTH__;
const vec3 TORCH_COLOR = vec3(//__TORCH_COLOR__);
const float TORCH_INTENSITY = //__TORCH_INTENSITY__;
const float TIME_TINT = //__TIME_TINT__;

void main() {
    vec4 albedo = texture(texture, texcoord) * vertexColor;
    vec4 lm = texture(lightmap, lightcoord);

    vec3 torchLight = mix(vec3(1.0), TORCH_COLOR, TORCH_INTENSITY);
    vec3 lightColor = lm.r * torchLight + lm.g * vec3(1.0);

    float ao = mix(1.0, lm.g, 1.0 - AO_STRENGTH);
    lightColor *= ao;

    albedo.rgb *= lightColor;

    fragColor0 = albedo;
    fragColor1 = vec4(lightcoord, 0.0, 1.0);
}
