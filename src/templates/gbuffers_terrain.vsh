#version 150 compatibility

/*
 * gbuffers_terrain.vsh — Pass-through vertex shader for terrain.
 * Minimal implementation — just passes through vertex data.
 */

out vec2 texcoord;
out vec2 lightcoord;
out vec4 vertexColor;
out vec3 normal;

void main() {
    gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
    texcoord    = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;
    lightcoord  = (gl_TextureMatrix[1] * gl_MultiTexCoord1).xy;
    vertexColor = gl_Color;
    normal      = normalize(gl_NormalMatrix * gl_Normal);
}
