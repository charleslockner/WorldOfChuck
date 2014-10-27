#include "Shader.h"
#include "Defines.h"

void SetShader(GLuint shaderName) {
   static GLuint currShader = 0;

   if (shaderName != currShader) {
      glUseProgram(shaderName);
      currShader = shaderName;
   }
}

void ShaderHandler::installShader(std::string tag, std::string vert, std::string frag, int cullType) {
   if (shaderTable.find(tag) == shaderTable.end()) {
      Shader newShader;
      newShader.install(vert, frag, cullType);
      shaderTable.insert(ShaderMap::value_type(tag, newShader));
   } else {
      shaderTable.find(tag)->second.install(vert, frag, cullType);
   }
}

Shader * ShaderHandler::getShader(std::string tag) {
   return &(shaderTable.find(tag)->second);
}

void Shader::install(std::string vertname, std::string fragname, int cullType) {
   GLuint VS, FS; 
   GLint vCompiled, fCompiled, linked; 
   
   VS = glCreateShader(GL_VERTEX_SHADER);
   FS = glCreateShader(GL_FRAGMENT_SHADER);
   
   const GLchar *vShaderName = textFileRead((char *)vertname.c_str());
   const GLchar *fShaderName = textFileRead((char *)fragname.c_str());
   
   glShaderSource(VS, 1, &vShaderName, NULL);
   glShaderSource(FS, 1, &fShaderName, NULL);
   
   printf("Compiling shader %s:\n", (char *)vertname.c_str());
   glCompileShader(VS);
   printOpenGLError();
   glGetShaderiv(VS, GL_COMPILE_STATUS, &vCompiled);
   printShaderInfoLog(VS);

   printf("Compiling shader %s:\n", (char *)fragname.c_str());
   glCompileShader(FS);
   printOpenGLError();
   glGetShaderiv(FS, GL_COMPILE_STATUS, &fCompiled);
   printShaderInfoLog(FS);
   
   GLuint prog = glCreateProgram();

   if (!vCompiled || !fCompiled || !prog) {
      printf("Error compiling a shader: %s or %s\n", vertname.c_str(), fragname.c_str());
      return;
   }
   
   glAttachShader(prog, VS);
   glAttachShader(prog, FS);
   
   glLinkProgram(prog);
  
   printOpenGLError();
   glGetProgramiv(prog, GL_LINK_STATUS, &linked);
   printProgramInfoLog(prog);
   
   h_aPosition = safe_glGetAttribLocation(prog, "aPosition");
   h_aNormal = safe_glGetAttribLocation(prog, "aNormal");
   h_aTexCoord = safe_glGetAttribLocation(prog, "aTexCoord");
   h_aTangent = safe_glGetAttribLocation(prog, "aTangent");
   h_aBitangent = safe_glGetAttribLocation(prog, "aBitangent");
   h_aBoneIndex = safe_glGetAttribLocation(prog, "aBoneIndices");
   h_aBoneWeight = safe_glGetAttribLocation(prog, "aBoneWeights");
   h_uTexUnit = safe_glGetUniformLocation(prog, "uTexUnit");
   h_uUseTex = safe_glGetUniformLocation(prog, "uUseTex");
   h_uShadowMap = safe_glGetUniformLocation(prog, "uShadowMap");
   h_uShadowMapSize = safe_glGetUniformLocation(prog, "uShadowMapSize");
   h_uPixelSize = safe_glGetUniformLocation(prog, "uPixelSize");
   h_uModelM = safe_glGetUniformLocation(prog, "uModelM");
   h_uViewM = safe_glGetUniformLocation(prog, "uViewM");
   h_uDepthPV = safe_glGetUniformLocation(prog, "uDepthPV");
   h_uProjM = safe_glGetUniformLocation(prog, "uProjM");
   h_uLightPos = safe_glGetUniformLocation(prog, "uLightPos");
   h_uLightColor = safe_glGetUniformLocation(prog, "uLightColor");
   h_uSunDir = safe_glGetUniformLocation(prog, "uSunDir");
   h_uCamPos = safe_glGetUniformLocation(prog, "uCamPos");
   h_uMatAmb = safe_glGetUniformLocation(prog, "uMat.aColor");
   h_uMatDif = safe_glGetUniformLocation(prog, "uMat.dColor");
   h_uMatSpec = safe_glGetUniformLocation(prog, "uMat.sColor");
   h_uMatShine = safe_glGetUniformLocation(prog, "uMat.shine");
   h_uBoneM = safe_glGetUniformLocation(prog, "uBoneM");
   h_uColorMod = safe_glGetUniformLocation(prog, "uRedHighlight");
   h_uUseNormalMap = safe_glGetUniformLocation(prog, "uUseNormalMap");
   h_uNormalMap = safe_glGetUniformLocation(prog, "uNormalMap");
   h_uOutlineColor = safe_glGetUniformLocation(prog, "uOutlineColor");
   h_uHasAnims = safe_glGetUniformLocation(prog, "uHasAnims");
   h_uWonkyShadows = safe_glGetUniformLocation(prog, "uWonkyShadows");
   h_uUseShadows = safe_glGetUniformLocation(prog, "uUseShadows");

   printf("sucessfully installed shader %d\n", prog);
   ShadeNum shadeNum;
   shadeNum.num = prog;
   shadeNum.cullType = cullType;
   shadeNums.push_back(shadeNum);
}

void ShaderHandler::sendGenerals(glm::mat4 proj, glm::mat4 view, glm::vec3 camPos, 
 glm::vec3 sunColor, glm::vec3 sunDir) {
   // SHADOW MAP CALCULATIONS
   // so here, I need to find out the four points of the view fustrum
   // I'll do that by sending points into the inverse matrix
   /* glm::mat4 pvInv = glm::inverse(proj * view); */
   /* glm::vec4 vfPoints[8]; */
   /* // this should cover all the points. we don't really need to visualize where */
   /* // they are, we just need all of them. */
   /* vfPoints[0] = pvInv * glm::vec4(-1.0f, -1.0f, -1.0f, 1.0f); */
   /* vfPoints[1] = pvInv * glm::vec4(-1.0f, -1.0f,  1.0f, 1.0f); */
   /* vfPoints[2] = pvInv * glm::vec4(-1.0f,  1.0f, -1.0f, 1.0f); */
   /* vfPoints[3] = pvInv * glm::vec4(-1.0f,  1.0f,  1.0f, 1.0f); */
   /* vfPoints[4] = pvInv * glm::vec4( 1.0f, -1.0f, -1.0f, 1.0f); */
   /* vfPoints[5] = pvInv * glm::vec4( 1.0f, -1.0f,  1.0f, 1.0f); */
   /* vfPoints[6] = pvInv * glm::vec4( 1.0f,  1.0f, -1.0f, 1.0f); */
   /* vfPoints[7] = pvInv * glm::vec4( 1.0f,  1.0f,  1.0f, 1.0f); */
   /* glm::vec4 vmax, vmin = vmax = vfPoints[0] / vfPoints[0].w; */

   /* for (int i = 1; i < 8; ++i) { */
   /*    vfPoints[i] = vfPoints[i] / vfPoints[i].w; */
   /*    vmax.x = qmax(vmax.x, vfPoints[i].x); */
   /*    vmin.x = qmin(vmin.x, vfPoints[i].x); */
   /*    vmax.y = qmax(vmax.y, vfPoints[i].y); */
   /*    vmin.x = qmin(vmin.y, vfPoints[i].y); */
   /*    vmax.z = qmax(vmax.z, vfPoints[i].z); */
   /*    vmin.x = qmin(vmin.z, vfPoints[i].z); */
   /* } */

   glm::mat4 depthViewMatrix = glm::lookAt(
      camPos - sunDir * 3000.0f,
      camPos,
      glm::vec3(0,1.0f,0)
   );

   /* vmax = depthViewMatrix * vmax; */
   /* vmin = depthViewMatrix * vmin; */

   /* printf("vmin: <%f, %f, %f> \t vmax: <%f, %f, %f>\n", */
   /*    vmin.x, vmin.y, vmin.z, vmax.x, vmax.y, vmax.z); */

   // figure out good near and far planes
   // THIS SHIT IS RETARDED
   // TODO: MAKE FUCKING MATH WORK
   /* glm::mat4 depthProjectionMatrix = glm::ortho<float>( */
   /*    vmin.x, */
   /*    vmax.x, */
   /*    vmin.y, */
   /*    vmax.y, */
   /*    -3000, */
   /*    6000 */
   /*    /1* vmin.z, *1/ */
   /*    /1* vmax.z *1/ */
   /* ); */
   /* glm::mat4 depthProjectionMatrix = glm::ortho<float>( */
   /*    -3000.0f, */
   /*     3000.0f, */
   /*    -1750.0f, */
   /*     2900.0f, */
   /*    -6000.0f, */
   /*     9000.0f */
   /* ); */
   glm::mat4 depthProjectionMatrix = glm::ortho<float>(
      -800.0f,
       800.0f,
      -800.0f,
       800.0f,
      -6000.0f,
       9000.0f
   );
   glm::mat4 depthPV = depthProjectionMatrix * depthViewMatrix;

   for (ShaderMap::iterator iter = shaderTable.begin(); iter != shaderTable.end(); iter++) {
      for (std::list<ShadeNum>::iterator numIter = iter->second.shadeNums.begin(); 
       numIter != iter->second.shadeNums.end(); numIter++) {
         SetShader(numIter->num);
         safe_glUniformMatrix4fv(iter->second.h_uProjM, glm::value_ptr(proj));
         safe_glUniformMatrix4fv(iter->second.h_uViewM, glm::value_ptr(view));
         safe_glUniformMatrix4fv(iter->second.h_uDepthPV, glm::value_ptr(depthPV));
         safe_glUniform3f(iter->second.h_uCamPos, camPos.x, camPos.y, camPos.z);
         safe_glUniform3f(iter->second.h_uLightColor, sunColor.x, sunColor.y, sunColor.z);
         safe_glUniform3f(iter->second.h_uSunDir, sunDir.x, sunDir.y, sunDir.z);
         #ifndef __APPLE__
         glUniform2f(iter->second.h_uPixelSize, 1.0f / (float)WIN_WIDTH, 1.0f / (float)WIN_HEIGHT);
         glUniform2f(iter->second.h_uShadowMapSize, SHADOW_RES, SHADOW_RES);
         #endif
      }
   }
}

void Shader::render(
      glm::mat4 ModelM,
      Material * material,
      Mesh * mesh,
      glm::mat4 * boneTransforms,
      Texture texture,
      bool useTexture,
      Texture normalMap,
      bool useNormalMap,
      bool useShadowMap,
      glm::vec3 outlineColor,
      bool wonkyShadows
   ) {
   /* printf("SHADERS: "); */
   for (std::list<ShadeNum>::iterator numIter = shadeNums.begin();
    numIter != shadeNums.end(); numIter++) {
      /* printf("%d ", numIter->num); */
      glCullFace(numIter->cullType);
      SetShader(numIter->num);
      Texture shadowMap = game->getShadowMap();

      // set up the texture
      if (useTexture) {
         glActiveTexture(GL_TEXTURE0 + texture.activeTex);
         glBindTexture(GL_TEXTURE_2D, texture.texId);
      }

      if (useNormalMap) {
         glActiveTexture(GL_TEXTURE0 + normalMap.activeTex);
         glBindTexture(GL_TEXTURE_2D, normalMap.texId);
      }

      if (useShadowMap) {
         glActiveTexture(GL_TEXTURE0 + shadowMap.activeTex);
         glBindTexture(GL_TEXTURE_2D, shadowMap.texId);
      }

      // set up the model matrix
      safe_glUniformMatrix4fv(h_uModelM, glm::value_ptr(ModelM));
      
      // set up the material
      if (material)
         material->attach(h_uMatAmb, h_uMatDif, h_uMatSpec, h_uMatShine);

      glUniform3fv(h_uOutlineColor, 1, glm::value_ptr(outlineColor));

      // set up vbo
      safe_glEnableVertexAttribArray(h_aPosition);
      glBindBuffer(GL_ARRAY_BUFFER, mesh->vbo);
      safe_glVertexAttribPointer(h_aPosition, 3, GL_FLOAT, GL_FALSE, 0, 0);

      // set up nbo
      safe_glEnableVertexAttribArray(h_aNormal);
      glBindBuffer(GL_ARRAY_BUFFER, mesh->nbo);
      safe_glVertexAttribPointer(h_aNormal, 3, GL_FLOAT, GL_FALSE, 0, 0);

      // set up tangent
      safe_glEnableVertexAttribArray(h_aTangent);
      glBindBuffer(GL_ARRAY_BUFFER, mesh->tabo);
      safe_glVertexAttribPointer(h_aTangent, 3, GL_FLOAT, GL_FALSE, 0, 0);

      // set up bitangent
      safe_glEnableVertexAttribArray(h_aBitangent);
      glBindBuffer(GL_ARRAY_BUFFER, mesh->btbo);
      safe_glVertexAttribPointer(h_aBitangent, 3, GL_FLOAT, GL_FALSE, 0, 0);

      // set up uvbo
      safe_glEnableVertexAttribArray(h_aTexCoord);
      glBindBuffer(GL_ARRAY_BUFFER, mesh->uvbo);
      safe_glVertexAttribPointer(h_aTexCoord, 2, GL_FLOAT, GL_FALSE, 0, 0);

      if (useTexture) {
         safe_glUniform1i(h_uTexUnit, texture.activeTex);
      } else {
         safe_glUniform1i(h_uTexUnit, 0);
      }
      safe_glUniform1i(h_uUseTex, (int)useTexture);

      if (useNormalMap) {
         safe_glUniform1i(h_uNormalMap, normalMap.activeTex);
      } else {
         safe_glUniform1i(h_uNormalMap, 0);
      }
      safe_glUniform1i(h_uUseNormalMap, (int)useNormalMap);

      if (useShadowMap) {
         safe_glUniform1i(h_uShadowMap, shadowMap.activeTex);
         safe_glUniform1i(h_uWonkyShadows, (int)wonkyShadows);
      } else {
         safe_glUniform1i(h_uShadowMap, 0);
         safe_glUniform1i(h_uWonkyShadows, (int)0);
      }
      safe_glUniform1i(h_uUseShadows, (int)useShadowMap);

      // Animation stuff
      if (boneTransforms) {
         safe_glUniform1i(h_uHasAnims, 1);
         // bone matrices
         glUniformMatrix4fv(h_uBoneM, MAX_BONES, GL_FALSE, (GLfloat*)(&(*boneTransforms)[0]));
      
         // bone indices
         safe_glEnableVertexAttribArray(h_aBoneIndex);
         glBindBuffer(GL_ARRAY_BUFFER, mesh->bibo);
         safe_glVertexAttribPointer(h_aBoneIndex, MAX_WEIGHTS, GL_UNSIGNED_INT, GL_FALSE, 0, 0);
         
         // bone weights
         safe_glEnableVertexAttribArray(h_aBoneWeight);
         glBindBuffer(GL_ARRAY_BUFFER, mesh->bwbo);
         safe_glVertexAttribPointer(h_aBoneWeight, MAX_WEIGHTS, GL_FLOAT, GL_FALSE, 0, 0);
      }
      else
         safe_glUniform1i(h_uHasAnims, 0);
      
      // set up ibo
      glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh->ibo);

      // Draw This icicle clam!!!
      glDrawElements(GL_TRIANGLES, mesh->numFaces * 3, GL_UNSIGNED_INT, 0);

      if (useTexture)
        glDisable(GL_TEXTURE_2D);

      safe_glDisableVertexAttribArray(h_aTexCoord);
      safe_glDisableVertexAttribArray(h_aNormal);
      safe_glDisableVertexAttribArray(h_aPosition);
   }
   /* printf("\n"); */
}

void Shader::render_particles(Material * material, GLuint posbuffer, /*GLuint movbuffer,*/ int NumPoints){  
   
   SetShader(shadeNums.front().num);
   glEnable(GL_TEXTURE_2D);

   // set up vbo
   safe_glEnableVertexAttribArray(h_aPosition);
   glBindBuffer(GL_ARRAY_BUFFER, posbuffer);
   safe_glVertexAttribPointer(h_aPosition, 3, GL_FLOAT, GL_FALSE, 0, 0);
   
   /*
   safe_glEnableVertexAttribArray(h_aPosition);
   glBindBuffer(GL_ARRAY_BUFFER, movbuffer);
   safe_glVertexAttribPointer(h_aPosition, 3, GL_FLOAT, GL_FALSE, 0, 0);
   */
   
   glDrawElements(GL_POINTS, NumPoints, GL_UNSIGNED_INT, 0);

   safe_glDisableVertexAttribArray(h_aPosition);
   
   glUseProgram(0);
}

/*
// Render Particles. Enabling point re-sizing in vertex shader 
glEnable (GL_PROGRAM_POINT_SIZE);
glEnable (GL_BLEND);
glActiveTexture (GL_TEXTURE0);
glBindTexture (GL_TEXTURE_2D, tex);
glUseProgram (shader_programme);

// update time in shaders 
glUniform1f (elapsed_system_time_loc, (GLfloat)current_seconds);

glBindVertexArray (vao);
// draw points 0-3 from the currently bound VAO with current in-use shader
glDrawArrays (GL_POINTS, 0, PARTICLE_COUNT);
glDisable (GL_BLEND);
glDisable (GL_PROGRAM_POINT_SIZE);
*/
