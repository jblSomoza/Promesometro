'use strict'

const mongoose = require("mongoose");
const app = require("./app");
var User = require('./models/user');
var bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/IN6BM', { useNewUrlParser: true }).then(() => {
    console.log('Se encuentra conectado a la Base de Datos');

    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'), () => {
        console.log(`El servidor esta corriendo en el puerto: '${app.get('port')}'`);
        usuarioDefecto();
    });
}).catch(err => console.log(err));

function usuarioDefecto(req, res) {
    var user = new User();
    user.usuario = 'ADMIN';
    user.email = 'ADMIN';
    user.password = 'ADMIN';
    user.rol = 'ADMIN';
    User.find({
        $or: [
            { email: user.email.toLowerCase() },
            { email: user.email.toUpperCase() },
        ]
    }).exec((err, users) => {
        if (users && users.length >= 1) {} else {
            bcrypt.hash(user.password, null, null, (err, hash) => {
                user.password = hash;

                user.save((err, usuarioGuardado) => {

                })
            })
        }
    })

}