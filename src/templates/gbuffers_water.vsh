#version 150 compatibility

/*
 * gbuffers_water.vsh — Water vertex shader
 * =========================================
 *
 * Injection markers (replaced by the shader generator):
 *   //__WAVE_UNIFORMS__       — uniform declarations for wave parameters
 *   //__WAVE_DISPLACEMENT__   — wave displacement logic applied to position.y
 *
 * Example injected values:
 *   uniform float waveAmplitude;
 *   uniform float waveSpeed;
 *   → float wave = sin(position.x * 2.0 + position.z * 1.5 + frameTimeCounter * waveSpeed) * waveAmplitude;
 *   → position.y += wave;
 */

out vec2 texcoord;
out vec2 lightcoord;
out vec4 vertexColor;
out vec3 eyeNormal;

//__WAVE_UNIFORMS__

void main() {
    vec4 position = gl_Vertex;

    //__WAVE_DISPLACEMENT__

    gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * position;
    texcoord    = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;
    lightcoord  = (gl_TextureMatrix[1] * gl_MultiTexCoord1).xy;
    vertexColor = gl_Color;
    eyeNormal   = normalize(gl_NormalMatrix * gl_Normal);
}
