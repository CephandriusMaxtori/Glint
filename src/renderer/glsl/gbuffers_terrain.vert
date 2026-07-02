#version 300 es
precision highp float;

in vec3 aPosition;
in vec2 aTexcoord;
in vec2 aLightcoord;
in vec4 aColor;
in vec3 aNormal;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

out vec2 texcoord;
out vec2 lightcoord;
out vec4 vertexColor;
out vec3 eyeNormal;

void main() {
    gl_Position = projectionMatrix * viewMatrix * vec4(aPosition, 1.0);
    texcoord = aTexcoord;
    lightcoord = aLightcoord;
    vertexColor = aColor;
    eyeNormal = normalize(mat3(viewMatrix) * aNormal);
}
