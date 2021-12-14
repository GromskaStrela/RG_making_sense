const vertex = `
#version 300 es
precision mediump float;

in vec2 aPosition;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragment = `#version 300 es

in vec4 vColor;

void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

export const shaders = {
    test: { vertex, fragment }
};