var express = require('express');
var bodyParser = require('body-parser');
var Speakeasy = require('speakeasy')

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router.post('/secret', function(req, res, next) {
    // var secret = Speakeasy.generateSecret({length:20});
    // res.send({"secret" : secret.base32});
    res.send('vhvhv')
  });

module.exports = router;