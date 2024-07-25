var express = require('express');
var router = express.Router();
let message= "";
let type = "";


/* GET home page. */
router.get('/', function(req, res, next) {
  setTimeout(() => {message = ""},2000);
  console.log("Minha mensagem" + message);
  res.render('cadastro', { title: 'Cadastro', message, type });
});

module.exports = router;