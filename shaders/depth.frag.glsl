precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    gl_FragColor = vec4(color.r, 0, 0, 1);
}