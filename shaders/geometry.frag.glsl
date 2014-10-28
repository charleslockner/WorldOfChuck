#extension GL_EXT_draw_buffers : require

precision highp float;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying highp vec2 vTextureCoord;

void main(void) {
   // gl_FragColor = vec4(vWorldNormal, 1.0);

   gl_FragData[0] = vec4(vWorldNormal, 1.0);
   gl_FragData[1] = vec4(vWorldNormal/2.0, 1.0);
   gl_FragData[2] = vec4(vWorldNormal/4.0, 1.0);
   gl_FragData[3] = vec4(vWorldNormal/8.0, 1.0);
}



