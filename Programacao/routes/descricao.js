var express = require('express');
var router = express.Router();
/* const MongoClient = require("mongodb").MongoClient;
const url ="mongodb+srv://juliadantas24:josebaruk@cluster0.5vizxvz.mongodb.net/?retryWrites=true&w=marjority&appName=Cluster0"; */
var db = require("../src/models/dao/eventosDAO");

/* GET home page. */
/* router.get('/', function(req, res, next) {
  console.log(doc)
  res.render('descricao', { title: 'Descricao', doc });
}); */

module.exports = router;