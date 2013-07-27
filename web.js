var express = require('express');
var fs = require('fs');
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
    var d;
    fs.readFileSync('index.html',function(err,data){
	if(err) throw err;
	d = data;
    });

  response.send(d);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
