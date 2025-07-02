// server.js
// where your node app starts

// init project
var express = require('express');
var https = require('https');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('data'));
app.use(bodyParser.json());


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.get('/slides', function (request, response) {
  response.sendFile(__dirname + '/views/slides.html');
});


// Callback endpoint to receive username and access_token from Beeminder upon 
// successful authorization
app.get("/connect", (request, response) => {
  console.log(request);
  if(typeof request.query.error != 'undefined') {
    
  }
  console.log(request.params);
  
  response.send('');
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

function getGoal(user,goal,token) {
  var options = {
    host: 'www.beeminder.com',
    port: 443,
    path: '/api/v1/users/'+user+'/goals/'+goal+'.json?datapoints=true&auth_token='+token,
    method: 'GET',
    body: '',
  }
  console.log(options)
  var req = https.request(options, (res) => {
    var data = ''
    res.on('data', (chunk) => {
      data = data + chunk
    }).on('end', () => {
      data = JSON.parse(data)
      console.log(data)
      if (typeof data.errors != 'undefined' ) {} else {}
    })      
  })
}

function sampleget(user,goal,token) {
  var baseurl = "https://www.beeminder.com/api/v1"
  https.get('https://encrypted.google.com/', (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

  }).on('error', (e) => {
    console.error(e);
  });
}
