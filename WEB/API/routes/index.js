var express = require('express');
var router = express.Router();
var udp = require('dgram');

const server = udp.createSocket('udp4');
server.bind(50000);
server.on('listening', function(){
  console.log('Server Listening');
});
server.on('message', function(msg){
  console.log('Message!');
  console.log(msg);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req,res,next) {
  console.log('DATA POST');
  console.log(req.body.power);
  res.json('Ok');
});

module.exports = router;
