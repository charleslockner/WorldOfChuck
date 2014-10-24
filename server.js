
// Load the lib files
var sys = require( "sys" );
var http = require("http");
var path = require("path"); 
var fs = require("fs");
var qs = require("querystring");
var _ = require("underscore");

// Load the src files
var config = require("./config");
var terrain = require("./server/terrain_handler.js");
var tileWidth = 1000, tileHeight = 1800, subdivs = 6;

// Create our HTTP server.
var server = http.createServer( function( req, res ) {
   if (req.method == 'GET')
      handleGet(req, res);
   else if (req.method == 'POST')
      handlePost(req, res);
});

// Start it up!
server.listen( config.getPort(), config.getAddress() );
console.log("Serving files at " + config.getAddress() + " (Port " + config.getPort() + ")");

var generateWorld = function() {
   console.log("Generating world");
   for (var x = -2; x <= 2; x++)
      for (var y = -2; y <= 2; y++) {
         terrain.createTile(x, y, tileWidth, tileHeight, subdivs, function(JSONTile, nX, nY) {
            console.log("Created tile: [" + nX + "][" + nY + "]");
         });
      }
}

// generateWorld();

function handleGet(req, res) {
   var filename = req.url;
   if (filename == "/")
      filename = "/index.html";

   var localPath = __dirname + filename;
   var siteDirname = path.dirname(filename);
   var isTerrain = siteDirname == "/assets/models/terrain";

   fs.exists(localPath, function(exists) {
      if (exists) {
         console.log("Serving: " + filename);
         serveFile(localPath, res);
      } else if (isTerrain) {
         console.log("Generating new tile." + filename);
         var coords = filename.split(path.sep).pop().split(".");
         terrain.createTile(coords[0], coords[1], tileWidth, tileHeight, subdivs, function(JSONTile, nX, nY) {
            console.log("Created tile: [" + nX + "][" + nY + "]");
            serveNewTile(localPath, res, JSONTile);
         });

      } else {
         console.log("Couldn't find: " + filename);
         serveNotFound(localPath, res);
      }
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

function serveNewTile(localPath, res, JSONTile) {
   var mimeType = extToMime[path.extname(localPath)]; 
   var JSONString = JSON.stringify(JSONTile);

   res.setHeader("Content-Length", JSONString.length);
   res.setHeader("Content-Type", mimeType);
   res.statusCode = 200;
   res.end(JSONString);
}

function serveFile(localPath, res) {
   var mimeType = extToMime[path.extname(localPath)]; 

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

function serveNotFound(localPath, res) {
   console.log("File not found: " + localPath);
   res.writeHead(404);
   res.end("Get a move on! There's nothing here! (404)\n");
}

function handlePost(req, res) {
   var body = '';

   req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      if (body.length > 1000000)
          req.connection.destroy();
   });

   req.on('end', function() {
      var post = qs.parse(body);

      console.log("got post");
   });
}
