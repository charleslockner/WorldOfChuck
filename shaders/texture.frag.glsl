precision highp float;

uniform sampler2D uSampler;

varying highp vec2 vTextureCoord;

void main(void) {
   gl_FragColor = texture2D(uSampler, vTextureCoord);
}



