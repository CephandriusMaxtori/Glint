#version 150 compatibility

/*
 * shadow.vsh — Pass-through vertex shader for shadow pass.
 */

void main() {
    gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
}
