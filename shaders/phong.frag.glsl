#extension GL_EXT_draw_buffers : require

precision mediump float;
varying vec3 vWorldNormal;

void main(void) {
	gl_FragColor = vec4(vWorldNormal, 1.0);
}




// ================== c++ notes ========================

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjM;
uniform mat4 uViewM;
uniform mat4 uModelM;

uniform vec3 uCamPos;
uniform vec3 uSunDir;

varying vec3 vColor;
varying vec3 vNormal;

varying vec3 view;
varying vec3 reflection;

void main() {
   vec3 diffuse, specular, ambient, camDiff, pos;
   float camDist;

   vNormal = vec3(uModelM * normalize(vec4(aNormal, 0.0)));
   pos = vec3(uModelM * vec4(aPosition, 1.0));

   view = normalize(uCamPos - pos);
   reflection = uSunDir - 2.0 * dot(uSunDir, vNormal) * vNormal;

   gl_Position = uProjM * uViewM * vec4(pos, 1.0);
}



struct Material {
   vec3 aColor;
   vec3 dColor;
   vec3 sColor;
   float shine;
};

uniform Material uMat;
uniform vec3 uLightColor;
uniform vec3 uSunDir;

varying vec3 vNormal;
varying vec3 view;
varying vec3 reflection;

void main() {
   vec3 diffuse, specular, ambient, rColor, nNormal, nSunDir, shadeLow, shadeMed, shadeHigh;
   float specDot, diffDot;

   nNormal = normalize(vNormal);
   nSunDir = normalize(uSunDir);

   diffuse = dot(nNormal, -nSunDir) * uMat.dColor;
   
   shadeLow = vec3(0.2, 0.2, 0.2);
   shadeMed = vec3(0.6, 0.6, 0.6);
   shadeHigh = vec3(1.0, 1.0, 1.0);
   diffDot = max(0.0, dot(nNormal, nSunDir));
   
   if (diffDot < 0.20)
      diffuse = uMat.dColor * shadeHigh;
   else if (diffDot < 0.80)
      diffuse = uMat.dColor * shadeMed;
   else
      diffuse = uMat.dColor * shadeLow;
   
   specDot = max(dot(view, reflection)/(length(view)*length(reflection)), 0.0);
   specular = pow(specDot, uMat.shine) * uMat.sColor;
   ambient = uMat.aColor;

   rColor = uLightColor * (diffuse + specular + ambient);

   gl_FragColor = vec4(diffuse, 0.0);
}