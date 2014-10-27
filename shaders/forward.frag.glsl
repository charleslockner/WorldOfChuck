precision mediump float;

uniform sampler2D uSampler;

varying vec3 vWorldNormal;
varying highp vec2 vTextureCoord;


void main(void) {
   vec3 texColor, diffuse, lightDir, worldNormal;

   lightDir = normalize(vec3(-1.0, -1.0, -1.0));
   worldNormal = normalize(vWorldNormal);

   texColor = vec3(texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)));

   diffuse = dot(worldNormal, -lightDir) * texColor;


   gl_FragColor = vec4(diffuse, 1.0);
}



  // gl_FragColor = vec4((texColor[0] + vWorldNormal[0])/2.0, (texColor[1] + vWorldNormal[1])/2.0, (texColor[2] + vWorldNormal[2])/2.0, 1.0);




// struct Material {
//    vec3 aColor;
//    vec3 dColor;
//    vec3 sColor;
//    float shine;
// };

// uniform Material uMat;
// uniform vec3 uLightColor;
// uniform vec3 uSunDir;

// varying vec3 vNormal;
// varying vec3 view;
// varying vec3 reflection;

// void main() {
//    vec3 diffuse, specular, ambient, rColor, nNormal, nSunDir;
//    float specDot, diffDot;

//    nNormal = normalize(vNormal);
//    nSunDir = normalize(uSunDir);

//    diffuse = dot(nNormal, -nSunDir) * uMat.dColor;
   
//    specDot = max(dot(view, reflection)/(length(view)*length(reflection)), 0.0);
//    specular = pow(specDot, uMat.shine) * uMat.sColor;

//    ambient = uMat.aColor;

//    rColor = uLightColor * (diffuse + specular + ambient);

//    gl_FragColor = vec4(diffuse, 0.0);
// }
