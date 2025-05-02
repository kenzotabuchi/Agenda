const Contato = require('../models/contatoModel');

exports.index =  async(req, res) => {
    try {
        const contatos = await Contato.buscaContatos();
        console.log('contatos:', contatos);
        res.render('index', {
            contatos
        });
        return;
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};