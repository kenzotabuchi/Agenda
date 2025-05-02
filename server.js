require('dotenv').config(); // carrega as variáveis de ambiente do arquivo .env

const express = require('express');
const app = express();
const mongoose = require('mongoose'); // importa o mongoose para conectar ao banco de dados
mongoose.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Conectei à base de dados');
        app.emit('pronto');
    })
    .catch(e => console.log(e));

const session = require('express-session'); // importa o express-session para gerenciar sessões
const mongoStore = require('connect-mongo'); // importa o connect-mongo para armazenar sessões
const flash = require('connect-flash'); // importa o connect-flash para mensagens temporárias
const routes = require('./routes');
const path = require('path');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');
const helmet = require('helmet'); // importa o helmet para segurança
const csrf = require('csurf'); // importa o csrf para proteção contra CSRF
app.use(helmet()); // ativa o helmet
app.use(express.urlencoded({ extended: true })); // utilize esse método para mostrar o body da requisição
app.use(express.static(path.resolve(__dirname, 'public'))); // define o caminho para os arquivos estáticos
const sessionOptions = session({
    secret: 'wqoubqgwo9375y292eiofafen0i2 4u92ug',
    store: mongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
});
app.use(sessionOptions); // ativa o session
app.use(flash()); // ativa o flash
app.use(csrf()); // ativa o csrf
app.use(middlewareGlobal); // utiliza o middleware
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);
app.set('views', path.resolve(__dirname, 'src', 'views')); // define o caminho para as views
app.set('view engine', 'ejs'); // define o template engine como ejs

// CRUD
// POST, GET, UPDATE, DELETE

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
});