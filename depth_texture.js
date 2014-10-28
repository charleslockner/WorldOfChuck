   var depthTextureExtension = gl.getExtension("WEBGL_depth_texture");
   if (!depthTextureExtension) {
       alert("depth textures not supported");
   }

   // create a depth texture.
   var depthTex = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D, depthTex);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, 16, 16, 0,
                 gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

   // Create a framebuffer and attach the textures.
   var fb = gl.createFramebuffer();
   gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                           gl.TEXTURE_2D, depthTex, 0);
   gl.bindTexture(gl.TEXTURE_2D, null);
   console.log(gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE);

   // use the default texture to render with while we render to the depth texture.
   gl.bindTexture(gl.TEXTURE_2D, null);

   // Render to the depth texture
   gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
   gl.clear(gl.DEPTH_BUFFER_BIT);
   gl.drawArrays(gl.TRIANGLES, 0, 6);

   // Now draw with the texture to the canvas
   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   gl.bindTexture(gl.TEXTURE_2D, depthTex);
   gl.drawArrays(gl.TRIANGLES, 0, 6);