#version 300 es
precision highp float;

layout(location = 0) out vec4 fragColor0;

const float SHADOW_QUALITY = //__SHADOW_QUALITY__;
const float SHADOW_SOFTNESS = //__SHADOW_SOFTNESS__;
const float SHADOW_DISTANCE = //__SHADOW_DISTANCE__;

void main() {
    float depth = gl_FragCoord.z;
    float bias = 0.001 + SHADOW_SOFTNESS * 0.005;
    gl_FragDepth = depth - bias;
    fragColor0 = vec4(depth);
}
