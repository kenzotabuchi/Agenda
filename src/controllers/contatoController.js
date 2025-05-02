const Contato = require('../models/contatoModel');

exports.index = (req, res) => {
    // console.log(req.session.user);
    res.render('contato', {
        contato: {}
    });
};

exports.register = async (req, res) => {
    try {
        const contato = new Contato(req.body);
        await contato.register();
        console.log('contato criado:', contato.contato);

        if (contato.errors.length > 0 || !contato.contato) {
            req.flash('errors', contato.errors);
            req.session.save(function() {
                res.redirect('/contato/index');
            })
            return;
        }

        req.flash('success', 'Contato adicionado com sucesso!');
        req.session.save(function() {
            res.redirect('/contato/index');
        });
        return;
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
}

exports.editIndex = async function(req, res) {
    if (!req.params.id) return res.render('404');
    const contato = await Contato.buscaPorId(req.params.id);
    if (!contato) return res.render('404');
    res.render('contato', {
        contato
    });
}

exports.edit = async function(req, res) {
    try {
        if (!req.params.id) return res.render('404');
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);

        if (contato.errors.length > 0 || !contato.contato) {
            req.flash('errors', contato.errors);
            req.session.save(function() {
                res.redirect('/contato/index');
            })
            return;
        }

        req.flash('success', 'Contato editado com sucesso!');
        req.session.save(function() {
            res.redirect(`/contato/index/${contato.contato._id}`);
        });
        return;
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
}

exports.delete = async function(req, res) {
    try {
        if (!req.params.id) return res.render('404');
        const contato = await Contato.delete(req.params.id);
        if (!contato) return res.render('404');
        req.flash('success', 'Contato deletado com sucesso.');
        req.session.save(function() {
            res.redirect('/');
        });
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};