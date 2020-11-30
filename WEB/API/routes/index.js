const { response } = require('express');
var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var ENV = require('./env.json');

const HOST = ENV.HOST;
const USER=ENV.USER;
const PASSWORD=ENV.PASSWORD;
const DATA=ENV.DATA;

const MysqlConnection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATA,
});

//EMPANADA DE ARROZ, NO HACE REJECT EN FALLO DE QUERY
function onInsertion(power, freqs, coord) {
  return new Promise((resolve, reject) => {
    var index = 0;
    var fail = false;
    power.map((power) => {
      const InsertQuery = 'INSERT INTO espectro (freq,power,lat,lng) VALUES('.concat(freqs[index].toString(),",",power.toString(),",",coord.lat,",",coord.lng,")");
      console.log(InsertQuery);
      MysqlConnection.query(InsertQuery, function(error) {
        if (error){
          fail = true; 
        }
      });
      index = index + 1;
    });
    if (fail) {
      return reject('Query Error');
    } else {
      return resolve('Query Succesfull');
    }
  }); 
}

function onFilter(range, dbrange) {
  return new Promise((resolve, reject) => {
    console.log(range);
    const FilterQuery = 'SELECT freq,power,lat,lng FROM espectro WHERE freq > '.concat((range.min).toString(),' AND freq < ', (range.max).toString(),' AND power > ',(dbrange).toString());
    console.log(FilterQuery);
    MysqlConnection.query(FilterQuery, function(error, result) {
      if(error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/INSERT', function(req,res) {
  console.log('POST: INSERT');
  const body = req.body;
  async function callInsertion() {
    await onInsertion(body.power, body.frequencies, body.coordinates)
    .then((response) => {
      try {
        res.json(response);
      } catch(res_error) {
        console.log(res_error);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
  callInsertion();
});

router.post('/FILTER', function(req, res) {
  console.log('POST: FILTER');
  const range = req.body.range;
  const dbrange = req.body.dbrange;
  async function callfilter() {
    await onFilter(range, dbrange)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  callfilter();
});

module.exports = router;
