#extension GL_EXT_draw_buffers : require

precision highp float;

uniform sampler2D uSampler;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying highp vec2 vTextureCoord;

void main(void) {
   vec3 textureColor;

   textureColor = vec3(texture2D(uSampler, vTextureCoord));

   gl_FragData[0] = vec4(vWorldPosition, 1.0);
   gl_FragData[1] = vec4(vWorldNormal, 1.0);
   gl_FragData[2] = vec4(textureColor, 1.0);
}



