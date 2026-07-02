#version 150 compatibility

/*
 * final.vsh — Pass-through vertex shader for the final pass.
 */

void main() {
    gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
}
