#version 150 compatibility

/*
 * composite.vsh — Pass-through vertex shader for the composite pass.
 */

void main() {
    gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
}
