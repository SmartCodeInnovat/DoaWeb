var express = require('express');
var router = express.Router();
let message= "";
let type = "";


/* GET home page. */
router.get('/', function(req, res, next) {
  setTimeout(() => {message = ""},2000);
  res.render('pagamento', { title: 'Pagamento', message, type });
});


module.exports = router;