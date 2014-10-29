precision mediump float;

uniform sampler2D uPositionTex;
uniform sampler2D uNormalTex;
uniform sampler2D uColorTex;

uniform vec3 uLights[12]; // max 3 lights each with position, direction, color, <strength, atten, radius>
uniform vec3 uCameraPosition;

varying vec2 vTextureCoord;

void main() {
   vec3 lightPosition, lightDirection, lightColor, lightAttr;
   vec3 position, texColor, normal, reflection, view;
   vec3 ambient, diffuse, specular, rColor;
   float specDot, lightStrength, lightAttenuation, lightRadius, lightDistance, illumination;
   float shine;

   position = vec3(texture2D(uPositionTex, vTextureCoord))*100.0;
   normal = normalize(vec3(texture2D(uNormalTex, vTextureCoord)));
   texColor = vec3(texture2D(uColorTex, vTextureCoord));

   view = normalize(position - uCameraPosition);
   shine = 500.0;

   ambient = texColor * 0.25;
   rColor = vec3(0.0);

   // loop through each light
   for (int i = 0; i < 3; i++) {
      lightPosition = uLights[4*i];
      lightDirection = uLights[4*i+1];
      lightColor = uLights[4*i+2];
      lightAttr = uLights[4*i+3];

      lightStrength = lightAttr.x;
      lightAttenuation = lightAttr.y;
      lightRadius = lightAttr.z;

      lightDirection = normalize(position - lightPosition);
      reflection = normalize(2.0 * normal * dot(normal, lightDirection) - lightDirection);
      lightDistance = length(position - lightPosition);
      illumination = lightStrength / (1.0 + 2.0*lightDistance + lightDistance*lightDistance);

      diffuse = texColor * dot(normal, -lightDirection);
      specular = texColor * pow(max(0.0, dot(reflection, view)), shine);
      rColor += illumination * lightColor * (specular + diffuse + ambient);
   }
   
   gl_FragColor = vec4(rColor, 1.0);
}