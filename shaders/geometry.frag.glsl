#extension GL_EXT_draw_buffers : require

precision highp float;

void main(void) {
   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

	gl_FragData[0] = vec4(0.25);
	gl_FragData[1] = vec4(0.5);
	gl_FragData[2] = vec4(0.75);
	gl_FragData[3] = vec4(1.0);
}