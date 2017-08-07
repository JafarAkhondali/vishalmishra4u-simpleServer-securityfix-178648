const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const mimeType = {
  "html" : "text/html",
  "jpeg" : "image/jpeg",
  "jpg" : "image/jpg",
  "png" : "image/png",
  "css" : "text/css",
  "js" : "text/javascript"
};

http.createServer(function(req, res){
  var uri = url.parse(req.url).pathname;
  var fileName = path.join(process.cwd(),  decodeURI(uri));
  console.log('Loading ' + uri);
  var stats;

  try{
    var stats = fs.lstatSync(fileName);
  }
  catch(err){
    res.writeHead(404, {'Content-type' : 'text/plain'});
    res.write('404 Not found\n');
    res.end();
    return;
  }

  if(stats.isFile()){
    var mimeType = path.extname(fileName).split(".").reverse()[0];
    res.writeHead(200,{'Content-type' : mimeType});

    var fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);
  }else if(stats.isDirectory()){
    res.writeHead(302, {
      'Location' : 'index.html'
    });
    res.end();
  }
  else{
    res.writeHead(500, {'Content-type' : 'text/plain'});
    res.write('500 Internal server error\n');
    res.end();
  }

}).listen(1337);
