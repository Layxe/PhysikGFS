/**
 * Created by Alexander on 03.07.2017.
 */

const express = require('express');
const app     = express();

app.use('/src',express.static('src'));

app.get('/', function(req,res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function() {
  console.log('server started!');
});