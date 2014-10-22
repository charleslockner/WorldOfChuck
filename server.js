
// Load the necessary libraries.
var config = require("./config");
var sys = require( "sys" );
var http = require("http");
var path = require("path"); 
var fs = require("fs");
var qs = require('querystring');
var _ = require("underscore");


function handlePost(req, res) {
   var body = '';

   req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // if (body.length > 1e6)
      //     req.connection.destroy();
   });

   req.on('end', function() {
      var post = qs.parse(body);

      console.log(post);
   });
}

var privateFiles = [];

var validExtensions = {
   ".html" : "text/html",        
   ".js": "application/javascript", 
   ".css": "text/css",
   ".txt": "text/plain",
   ".jpg": "image/jpeg",
   ".gif": "image/gif",
   ".png": "image/png",
   ".ico": "image/ico",
   ".json": "text/json",
   ".glsl": "textshader"
};

function fillPrivateFiles() {
   fs.readdir(".", function (err, files) {
      if (err)
         console.log("Error reading directory: " + err);
      privateFiles = files;
   });
}


function serveFile(req, res) {
   var filename = req.url || "index.html";
   var isAccessable;

   if (filename == "/" || filename == "/index.html") {
      filename = "/index.html";
      isAccessable = true;
   } else
      isAccessable = !(_.include(privateFiles, filename.substr(1)));

   var ext = path.extname(filename);
   var localPath = __dirname;
   var isValidExt = validExtensions[ext];
 
   if (isValidExt) {
      localPath += filename;
      fs.exists(localPath, function(exists) {
         if (exists && isAccessable) {
            // console.log("Serving file: " + localPath);
            getFile(localPath, res, validExtensions[ext]);
         } else {
            console.log("File not found: " + localPath);
            res.writeHead(404);
            res.end("HOLY CRAP, NO FILES ARE HERE!\n");
         }
      });
   }
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

// Create our HTTP server.
var server = http.createServer( function( req, res ) {
   if (req.method == 'POST')
      handlePost(req, res);
   else
      serveFile(req, res);
});

fillPrivateFiles();
server.listen( config.getPort(), config.getAddress() );
console.log("Serving files at " + config.getAddress() + " (Port " + config.getPort() + ")");
 
