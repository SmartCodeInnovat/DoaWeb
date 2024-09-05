var express = require('express');
const nodemailer = require("nodemailer");
var pasth = require('path');
var bcrypt = require('bcrypt');
var router = express.Router();
var db = require("../src/models/dao/eventosDAO");
var collection = require("../src/models/dao/usersDAO");
var donation = require("../src/models/dao/doacaoDAO");
const fetch = require('node-fetch');
const cors = require('cors');
const { stringify } = require('querystring');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
let message = "";
let type = "";
const session = require('express-session');
const passport = require('passport');
const { promises } = require('dns');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const segredo = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/cadastro", async (req, res) => {
  const data = {
    name: req.body.username,
    email: req.body.email,
    password: req.body.password
  }
  const existingUser = await collection.findOne({ email: data.email });
  if (existingUser) {
    setTimeout(() => { message = "" }, 1000);
    console.log(message);
    message = "Este email já está sendo utilizado!"
    type = "danger";
    res.render("cadastro", { title: "Express", message: message, type: type });
    setTimeout(() => { message = "" }, 2000);
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;
    const userdata = await collection.insertMany(data);
    var eventos = await db.getEventos();
    res.render("evento", { title: "Express", evento: eventos });
  }
});

router.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ email: req.body.email });
    if (!check) {
      message = "Seu e-mail está incorreto!";
      type = "danger";
      res.render("login", { title: "Express", message: message, type: type });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
    if (isPasswordMatch) {
      var eventos = await db.getEventos();
      res.redirect("/evento");
      //res.render("evento", { title: "Express", evento: eventos });

    } else {
      message = "Sua senha está incorreta!";
      type = "danger";
      res.render("login", { title: "Express", message: message, type: type });
    }
  } catch {

  }

});

router.post("/recuperarSenha", async (req, res) => {
  const userEmail = req.body.email;
  const existingEmail = await collection.findOne({ email: userEmail });

   if(existingEmail){
    const userName = existingEmail.name.split(/\s+/)[0];
    const token = jwt.sign({ id: existingEmail._id }, segredo, { expiresIn: '24h' });
    const resectURL = `http://localhost:3000/recuperarSenha/${token}`;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: "julia.dantas62@aluno.ifce.edu.br",
        pass: "Julia2410",
      },
    });
      const info = {
        from: "Smart Code", // sender address
        to:  `${userEmail}`, // list of receivers
        subject: 'Redefinição de Senha - DoaWeb', // Subject lin
        html: `<p>Olá ${userName},</p>
              <p>Recebemos uma solicitação para redefinir a senha da sua conta no DoaWeb. Se você fez essa solicitação, siga o link abaixo para criar uma nova senha.</p>
              <p><a href="${resectURL}">Redefinir Senha</a></p>
              <p>O link acima é válido por 24 horas. Se você não tiver solicitado a redefinição de senha, por favor, ignore este e-mail. Sua senha permanecerá inalterada.</p>
              <p>Se precisar de mais ajuda, você pode entrar em contato com nosso suporte pelo e-mail <a href="mailto:suporte@doaweb.com">suporte@doaweb.com</a> ou acessar nossa Central de Ajuda em <a href="https://www.doaweb.com/ajuda">https://www.doaweb.com/ajuda</a>.</p>
              <p>Atenciosamente,<br>Equipe DoaWeb</p>`,    
      };
      new Promise((resolve, reject) =>{
      transporter.sendMail(info)
      .then(res =>{
        transporter.close();
        return resolve(res);
      })
      setTimeout(() => { message = "" }, 1000);
      message = "O e-mail já foi enviado!"
      type = "insurace";
      res.render("recuperarSenha", { title: "Express", message: message, type: type });
      setTimeout(() => { message = "" }, 2000);
      }).catch(error =>{
        console.log(error);
        transporter.close();
        return reject(error);
      })
    }else{
    setTimeout(() => { message = "" }, 1000);
    message = "Este email não está cadastrado!"
    type = "danger";
    res.render("recuperarSenha", { title: "Express", message: message, type: type });
    setTimeout(() => { message = "" }, 2000);
   }
});

router.get("/recuperarSenha/:token", async (req, res) => {
  setTimeout(() => { message = "" }, 1000);
  const token = req.params.token;
  res.render('senhaNova', { title: 'Nova Senha',message, type,token:token });
  setTimeout(() => { message = "" }, 2000);
});

router.post("/recuperarSenha/:token", async (req, res) => {
  setTimeout(() => { message = "" }, 1000);
  const token = req.params.token;
  const newPassword = req.body.novasenha;
  try {
    const decoded = jwt.verify(token, segredo);
    const userId = decoded.id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const UpdateUser= await collection.updateOne(
    {_id: userId },          // Filtro para encontrar o documento
    { $set: { password: hashedPassword } }  // Atualiza o campo senha
)
    res.redirect('/login');
  } catch (error) {
    console.error('Erro na redefinição de senha:', error);
    res.status(400).send('Token inválido ou expirado.');
  }
});

router.get("/evento/mes/:nome", async (req, res, next) => {
  const nome = req.params.nome;
  try {
    const doc = await db.findMes(nome);
    res.render('evento', { title: 'Evento', evento: doc });
  } catch (err) {
    next(err);
  }
});

router.get("/evento/local/:nome", async (req, res, next) => {
  const nome = req.params.nome;
  try {
    const doc = await db.findLocal(nome);
    res.render('evento', { title: 'Evento', evento: doc });
  } catch (err) {
    next(err);
  }
});

router.get("/evento/acao/:nome", async (req, res, next) => {
  const nome = req.params.nome;
  try {
    const doc = await db.findAcao(nome);
    res.render('evento', { title: 'Evento', evento: doc });
  } catch (err) {
    next(err);
  }
});

router.get("/descricao/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const doc = await db.findOne(id);
    res.render('descricao', { title: 'Descricao', evento: doc });
  } catch (err) {
    next(err);
  }
});

router.get('/pagamento/:id', async function(req, res, next) {
  const id = req.params.id;
  try {
    const doc = await db.findOne(id);
    setTimeout(() => {message = ""},2000);
    res.render('pagamento', { title: 'Pagamento', message, type, evento: doc  });
    }

   catch (err) {
    next(err);
  }

});

router.post("/pagamento/:id", async (req, res) => {
  //Acessando o evento para o qual vai haver a doação
  const id = req.params.id;
  const doc = await db.findOne(id);

  //Formatando o CPF para a API
  var cpf = req.body.cpf;
  var cpf2 = cpf.replace('.', '');
  var cpf2 = cpf2.replace('.', '');
  var cpf3 = cpf2.replace('-', '');

  //Formatando o valor
  var value = req.body.am;
  var value1 = value.replace('R', '');
  var value2 = value1.replace('$', '');
  var value3 = value2.replace(",",".")
  var valorNumber = parseFloat(value3);

  //Dados que serão enviados ao Banco
  const data = {
    name: req.body.fullname,
    cpf: req.body.cpf,
    method: req.body.payment,
    value: req.body.am,
    date: req.body.data,
    event: [
            doc.nome,
            doc._id
    ]
  }

  //Verificando se é a primeira vez doando
  const existingDoacao = await donation.findOne({ cpf: data.cpf });

  if(existingDoacao){
    if(req.body.situation === "first-time"){
      message = "Esta não é a sua primeira vez doando!";
      type = "danger";
      res.render("pagamento", { title: "Express", message: message, type: type, evento:doc });
    }
    else{
      //Procurando Cliente
      let reqs = await fetch("https://sandbox.asaas.com/api/v3/customers?cpfCnpj=" + cpf3, {
        method: "GET",
        headers: {
          'accept': 'application/json',
          'access_token': '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwODE0NzU6OiRhYWNoX2YxYWVmMzc3LTZlZDgtNGY1Mi1iMDc5LWNkMjVhMzE5NWE1OQ==',
  
        }
      });
      let ressNotFirstTime = await reqs.json();
      const dataExisting = {
        name: existingDoacao.name,
        cpf: req.body.cpf,
        method: req.body.payment,
        value: req.body.am,
        date: req.body.data,
        event: [
                doc.nome,
                doc._id
        ]
      }
      const donationdata = await donation.insertMany(dataExisting);

      //Se a opção de pagamento for boleto
      if (req.body.payment === "boleto") {
        let reqsPayment = await fetch("https://sandbox.asaas.com/api/v3/payments", {
          method: "POST",
          headers: {
            'accept': 'application/json',
            'access_token': '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwODE0NzU6OiRhYWNoX2YxYWVmMzc3LTZlZDgtNGY1Mi1iMDc5LWNkMjVhMzE5NWE1OQ==',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            "billingType": "BOLETO",
            "customer": ressNotFirstTime.data[0].id,
            "value": valorNumber,
            "dueDate": req.body.data
          })
        })
        let ressPayment = await reqsPayment.json();
        res.redirect(ressPayment.bankSlipUrl);
      } 
   //Se a opção de pagamento for Cartão de Crédito
   else if (req.body.payment === "credit-card") {
    let reqsPayment = await fetch("https://sandbox.asaas.com/api/v3/payments", {
      method: "POST",
      headers: {
        'accept': 'application/json',
        'access_token': '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwODE0NzU6OiRhYWNoX2YxYWVmMzc3LTZlZDgtNGY1Mi1iMDc5LWNkMjVhMzE5NWE1OQ==',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        "billingType": "CREDIT_CARD",
        "customer": ressNotFirstTime.data[0].id,
        "value": valorNumber,
        "dueDate": req.body.data
      })
    })
    let ressPayment = await reqsPayment.json();
    res.redirect(ressPayment.invoiceUrl);
  } 

 //Se a opção for PIX
 else {
  let reqsPayment = await fetch("https://sandbox.asaas.com/api/v3/payments", {
    method: "POST",
    headers: {
      'accept': 'application/json',
      'access_token': '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwODE0NzU6OiRhYWNoX2YxYWVmMzc3LTZlZDgtNGY1Mi1iMDc5LWNkMjVhMzE5NWE1OQ==',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      "billingType": "PIX",
      "customer": ressNotFirstTime.data[0].id,
      "value": valorNumber,
      "dueDate": req.body.data
    })
  })
  let ressPayment = await reqsPayment.json();
  res.redirect(ressPayment.invoiceUrl);
}
}
    }
  
  else{
//Se for a primeira vez doando
if (req.body.situation === "first-time") {
  //Criando o cliente
  let reqs = await fetch("https://sandbox.asaas.com/api/v3/customers", {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'access_token': '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwODE0NzU6OiRhYWNoX2YxYWVmMzc3LTZlZDgtNGY1Mi1iMDc5LWNkMjVhMzE5NWE1OQ==',
      'content-type': 'application/json'
    },
    body: JSON.stringify(
      {
        "name": req.body.fullname,
        "cpfCnpj": cpf3
      }
    )
  });
  let ress = await reqs.json();
  const donationdata = await donation.insertMany(data);

  //Se a opção de pagamento for boleto
  if (req.body.payment === "boleto") {
    let reqs2 = await fetch("https://sandbox.asaas.com/api/v3/payments", {
      method: "POST",
      headers: {
        'accept': 'application/json',
        'access_token': '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwODE0NzU6OiRhYWNoX2YxYWVmMzc3LTZlZDgtNGY1Mi1iMDc5LWNkMjVhMzE5NWE1OQ==',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        "billingType": "BOLETO",
        "customer": ress.id,
        "value": valorNumber,
        "dueDate": req.body.data
      })
    })
    let ress2 = await reqs2.json();
    res.redirect(ress2.bankSlipUrl);
  } 
  //Se a opção de pagamento for Cartão de Crédito
  else if (req.body.payment === "credit-card") {
    let reqs2 = await fetch("https://sandbox.asaas.com/api/v3/payments", {
      method: "POST",
      headers: {
        'accept': 'application/json',
        'access_token': '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwODE0NzU6OiRhYWNoX2YxYWVmMzc3LTZlZDgtNGY1Mi1iMDc5LWNkMjVhMzE5NWE1OQ==',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        "billingType": "CREDIT_CARD",
        "customer": ress.id,
        "value": valorNumber,
        "dueDate": req.body.data
      })
    })
    let ress2 = await reqs2.json();
    res.redirect(ress2.invoiceUrl);
  } 
  //Se a opção for PIX
  else {
    let reqs2 = await fetch("https://sandbox.asaas.com/api/v3/payments", {
      method: "POST",
      headers: {
        'accept': 'application/json',
        'access_token': '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwODE0NzU6OiRhYWNoX2YxYWVmMzc3LTZlZDgtNGY1Mi1iMDc5LWNkMjVhMzE5NWE1OQ==',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        "billingType": "PIX",
        "customer": ress.id,
        "value": valorNumber,
        "dueDate": req.body.data
      })
    })
    let ress2 = await reqs2.json();
    res.redirect(ress2.invoiceUrl);
  } 

    }else{
      message = "Esta é a sua primeira vez doando!";
      type = "danger";
      res.render("pagamento", { title: "Express", message: message, type: type, evento:doc });
    }

  }
})

/* Configuração de sessão para passport
app.use(session({
    secret: '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',
    resave: false,
    saveUninitialized: true
}));

// Inicialização do passport e sessão
app.use(passport.initialize());
app.use(passport.session());

// Configuração da estratégia do Google OAuth
passport.use(new GoogleStrategy({
    clientID: '896375909767-p9d843nkn6dbgj60car1hbqv44t95evh.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback' // URL de callback após login no Google
  },
  function(accessToken, refreshToken, profile, done) {
    // Função de verificação do usuário, geralmente você autentica o usuário aqui
    // Pode ser necessário implementar esta função de acordo com sua lógica de usuário
    return done(null, profile);
  }
));

// Serialização e desserialização de usuário para sessão
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Rota de autenticação com o Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rota de callback do Google após login
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Redirecionar para a página desejada após o login bem-sucedido
    res.redirect('/evento');
  });

// Outras rotas do seu aplicativo
app.get('/', (req, res) => {
  res.send('Página inicial');
});

// Porta em que o servidor irá escutar
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta ${PORT}");
});*/
 
module.exports = router;
