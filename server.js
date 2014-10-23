
// Load the necessary libraries.
var config = require("./config");
var sys = require( "sys" );
var http = require("http");
var path = require("path"); 
var fs = require("fs");
var qs = require('querystring');
var _ = require("underscore");

// Create our HTTP server.
var server = http.createServer( function( req, res ) {
   if (req.method == 'POST')
      handlePost(req, res);
   else
      serveFile(req, res);
});

server.listen( config.getPort(), config.getAddress() );
console.log("Serving files at " + config.getAddress() + " (Port " + config.getPort() + ")");
 


function handlePost(req, res) {
   var body = '';

   req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      if (body.length > 1e6)
          req.connection.destroy();
   });

   req.on('end', function() {
      var post = qs.parse(body);

      console.log(post);
   });
}

var extToMime = {
   ".html" : "text/html",        
   ".js": "application/javascript", 
   ".css": "text/css",
   ".txt": "text/plain",
   ".jpg": "image/jpeg",
   ".gif": "image/gif",
   ".png": "image/png",
   ".ico": "image/ico",
   ".json": "text/json",
   ".glsl": "application/x-glsl"
};

function serveFile(req, res) {
   var filename = req.url || "index.html";
   if (filename == "/" || filename == "/index.html")
      filename = "/index.html";

   var ext = path.extname(filename); 
   var localPath = __dirname + filename;
   fs.exists(localPath, function(exists) {
      if (exists) {
         console.log("Serving file: " + filename);
         getFile(localPath, res, extToMime[ext]);
      } else {
         console.log("File not found: " + filename);
         res.writeHead(404);
         res.end("Get a move on! There's nothing here! (404)\n");
      }
   });
}

function getFile(localPath, res, mimeType) {
   fs.readFile(localPath, function(err, contents) {
      if(!err) {
         res.setHeader("Content-Length", contents.length);
         res.setHeader("Content-Type", mimeType);
         res.statusCode = 200;
         res.end(contents);
      } else {
         res.writeHead(500);
         res.end();
      }
   });
}
