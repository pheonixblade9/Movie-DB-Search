/* global __dirname */
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ strict: false }));

express.static('/public')

app.get('/favorites', function (req, res) {
  var data = fs.readFileSync('./data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.post('/favorites', function (req, res) {
  //if there is no body in the request, error
  if (!req.body) {
    res.send("Error");
    return;
  }

  //make sure the file exists and has an array before we try to write to it
  fs.readFile('./data.json', function (err, data) {
    //TODO: add more error checking for empty files
    if (!data)
      data = [];
    else
      data = JSON.parse(data);
  
    //only write to the array if it's not already in favorites
    if (data.indexOf(req.body) !== -1) {
      res.send(req.body + " is already a favorite!");
    }
    else {
      data.push(req.body);
      fs.writeFile("./data.json", JSON.stringify(data));
      res.setHeader("Content-Type", "application/json");
      res.send("Favorited " + req.body);
    }
  })
});

//start listening for requests on port 3000
app.listen(3000, function () {
  console.log("Listening on port 3000");
});