var express = require('express');
var router = express.Router();
let message= "";
let type = "";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login', message, type });
});

module.exports = router;