#version 300 es
precision highp float;

in vec3 aPosition;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

void main() {
    gl_Position = projectionMatrix * viewMatrix * vec4(aPosition, 1.0);
}
