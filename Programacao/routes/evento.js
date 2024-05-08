var express = require('express');
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url ="mongodb+srv://juliadantas24:josebaruk@cluster0.5vizxvz.mongodb.net/?retryWrites=true&w=marjority&appName=Cluster0";
var db = require("../src/models/dao/eventosDAO");

/* GET home page. */
router.get("/", async function (req, res, next) {
  var eventos = await db.getEventos();
  console.log(eventos);
  res.render("evento", { title: "Express", evento: eventos });
});

module.exports = router;




