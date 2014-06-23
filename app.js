//////////////////////
//Static Node Server//
//////////////////////

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 3000;

var contentTypes = {
    '.html': 'text/html',
    '.css': "text/css",
    '.js': 'application/javascript'
};

var app = http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), '/public', uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    // figure out MIME type by file ext
    var contentType = contentTypes[path.extname(filename)];

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {       
        response.writeHead(500, {"Content-Type": contentType});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200, {"Content-Type": contentType});
      response.write(file); // add "binary" here?
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at => http://localhost:" + port);


///////////////
//Socket.io //
//////////////

var io = require('socket.io')(app);

io.on('connection', function (socket) {
  
  // Send data to client with socket.emit
  socket.emit('from server', { server: 'hello client' });

  // Receive data from client with socket.on
  socket.on('from client', function (data) { console.log(data);});

});


