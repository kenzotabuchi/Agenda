const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const loginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
});

const loginModel = mongoose.model('Login', loginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valida();
        if (this.errors.length > 0) return;
        this.user = await loginModel.findOne({email: this.body.email});

        if (!this.user) {
            this.errors.push('Usuário não existe.');
            return;
        }
        if (this.errors.length > 0) return;

        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida.');
            this.user = null;
            return;
        }
    }

    async register() {
        this.valida();
        if (this.errors.length > 0) return;
        await this.userExists();
        if (this.errors.length > 0) return;
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        this.user = await loginModel.create(this.body);
    }

    valida() {
        // Validações
        this.cleanUp(); // Limpa o body
        
        // Email
        if (!validator.isEmail(this.body.email)) {
            this.errors.push('Email inválido.');
        }

        // Senha
        if (this.body.password.length < 8 || this.body.password.length > 50) {
            this.errors.push('A senha deve ter entre 8 e 50 caracteres.');
        }


    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password,
        };
    }

    async userExists() {
        this.user = await loginModel.findOne({email: this.body.email});
        if (this.user) {
            this.errors.push('Usuário já existe');
            return;
        }
    }
}

module.exports = Login;