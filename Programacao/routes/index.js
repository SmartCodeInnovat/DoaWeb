var express = require('express');
var router = express.Router();
var db = require("../src/models/dao/eventosDAO");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/descricao/:id", async  (req, res, next) => {
  const id= req.params.id;
  try {
    const doc = await db.findOne(id);
    res.render('descricao', { title: 'Descricao', evento:doc });
  } catch (err) {
    next(err);
  }
});

router.get("/evento/mes/:nome", async  (req, res, next) => { 
  const nome= req.params.nome;
  try {
    const doc = await db.findMes(nome);
    res.render('evento', { title: 'Evento', evento:doc });
  } catch (err) {
    next(err);
  }
});

router.get("/evento/local/:nome", async  (req, res, next) => { 
  const nome= req.params.nome;
  try {
    const doc = await db.findLocal(nome);
    res.render('evento', { title: 'Evento', evento:doc });
  } catch (err) {
    next(err);
  }
});

router.get("/evento/acao/:nome", async  (req, res, next) => { 
  const nome= req.params.nome;
  try {
    const doc = await db.findAcao(nome);
    res.render('evento', { title: 'Evento', evento:doc });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
