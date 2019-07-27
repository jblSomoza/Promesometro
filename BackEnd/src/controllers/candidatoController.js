'use strict'

var Candidato = require('../models/candidatos');
var Promesa = require('../models/promesa');
var path = require('path');
var fs = require('fs');


function addCandidato(req, res) {
    var candidato = new Candidato();
    var partidoId = req.params.id;
    var params = req.body;

    if (req.user.rol == 'ADMIN') {

        if (params.nombre && params.descripcion && params.cargo) {
            candidato.nombre = params.nombre;
            candidato.descripcion = params.descripcion;
            candidato.idPartido = partidoId;
            candidato.cargo = params.cargo;
            candidato.image = null;

            Candidato.findOne({ nombre: candidato.nombre }, (err, buscado) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' })
                if (buscado) {
                    res.status(200).send({
                        message: 'Este candidato ya fue inscrito'
                    })
                } else {

                    candidato.save((err, candidatoGuardado) => {
                        if (err) return res.status(500).send({ message: 'Error en el candidato' })
                        if (!candidatoGuardado) return res.status(500).send({ message: 'Error al agregar al candidato' })

                        return res.status(200).send({ candidato: candidatoGuardado });
                    })

                }
            })

        } else {
            res.status(200).send({
                message: 'Rellene todos los datos necesarios'
            })
        }

    } else {
        res.status(200).send({
            message: 'solo admin puede crear candidato'
        })
    }
}

function getCandidatos(req, res) {
    var partidoId = req.params.id;

    Candidato.find({ idPartido: partidoId }).exec((err, candidatos) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!candidatos) return res.status(404).send({ message: 'Error al listar los candidatos' })
        return res.status(200).send({ listaCandidatos: candidatos })
    })

}

function addPromesa(req, res) {
    var promesa = new Promesa();
    var candidatoId = req.params.id;
    var params = req.body;
    var num1;
    var num2;

    if (req.user.rol == 'ADMIN') {

        if (params.titulo && params.descripcion) {
            promesa.titulo = params.titulo;
            promesa.descripcion = params.descripcion;
            promesa.idCandidato = candidatoId;
            promesa.si = 0;
            promesa.no = 0;
            promesa.promedio1 = 0;
            promesa.promedio2 = 0;
            promesa.usuarios = [];
            promesa.save((err, Guardado) => {
                if (err) return res.status(500).send({ message: 'Error en el candidato' })
                if (!Guardado) return res.status(500).send({ message: 'Error al agregar al candidato' })

                return res.status(200).send({ promesa: Guardado });
            })

        }

    } else {
        res.status(200).send({
            message: 'solo admin puede crear promesas'
        })
    }
}

function votar(req, res) {
    var promesa = new Promesa();
    var promesaId = req.params.id;
    var params = req.body;
    var num1, num2, num3;
    var votoUsuario = true;
    promesa.si = params.si;
    promesa.no = params.no;
    Promesa.findById(promesaId, (err, results) => {
        if (err) return res.status(404).send({ message: "error en la peticion 1" });
        if (!results) return res.status(500).send({ message: "no se pudo listar II" });


        for (let x = 0; x < results.usuarios.length; x++) {
            if (results.usuarios[x] === req.user.sub) {
                votoUsuario = false;
                return res.status(200).send({ message: "Ya voto" });
            }
        }
        if (votoUsuario == true) {
            Promesa.findByIdAndUpdate(promesaId, {
                $inc: { si: params.si, no: params.no }
            }, { new: true }, (err, result) => {
                if (err) return res.status(404).send({ message: "error en la peticion III ", err });
                if (!result) return res.status(500).send({ message: "error al listar la encuesta IV" });

                num1 = result.si + result.no;
                num2 = (result.si * 1) / num1;
                promesa.promedio1 = num2;

                num3 = (result.no * 1) / num1;
                promesa.promedio1 = num3;



                Promesa.findByIdAndUpdate(promesaId, {
                    promedio1: num2,
                    promedio2: num3
                }, { new: true }, (err, statu) => {
                    if (err) return res.status(404).send({ message: "no se pudo realizar la petivion V" });
                    if (!statu) return res.status(500).send({ message: "error promesa" });
                    statu.usuarios.push(req.user.sub);
                    statu.save();
                    return res.status(200).send({ statu })
                });
            })
        }
    })


}

function subirImagen(req, res) {
    var candidatoId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[3];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);

        var file_ext = ext_split[1];
        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Candidato.findByIdAndUpdate(candidatoId, { image: file_name }, { new: true }, (err, candidatoActualizado) => {
                if (err) return res.status(500).send({ message: ' no se a podido actualizar el usuario' })

                if (!candidatoActualizado) return res.status(404).send({ message: 'error en los datos del usuario, no se pudo actualizar' })

                return res.status(200).send({ candidato: candidatoActualizado });
            })
        } else {
            return removeFilesOfUploads(res, file_path, 'extension no valida')
        }

    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message })
    })
}

function obtenerImagen(req, res) {
    var image_file = req.params.nombreImagen;
    var path_file = './src/uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    });
}



function getPromesas(req, res) {
    var candidatoId = req.params.id;

    Promesa.find({ idCandidato: candidatoId }).exec((err, promesas) => {
        if (err) return res.status(500).send({ message: 'err en la peticion' })
        if (!promesas) return res.status(404).send({ message: 'err al listar las promesas' })
        return res.status(200).send({ listaPromesas: promesas })
    })

}








function darOpinion(req, res) {
    var body = req.body;
    var opinion = body.opinion.toLowerCase();
    var email = body.email;
    var promesaId = req.params.id;
    
    //email, opinion, id
    var yaOpino = false;
    var votoFinal = 'votos.' + opinion

    if (opinion === "si" || opinion === "no") {
        Promesa.findById(promesaId, (err, encontrado) => {
            if (err) return res.status(500).send({ message: 'error en la peticion (107)' });

            if (!encontrado) return res.status(500).send({ message: "error al listar la promesa" });

            for (let x = 0; x < encontrado.yaVotaron.length; x++) {
                if (encontrado.yaVotaron[x] === email) {
                    yaOpino = true;
                    return res.status(500).send({ message: "el usuario ya opino en esta encuesta" })
                }
            }

            if (yaOpino === false) {
                Promesa.findByIdAndUpdate(promesaId, { $inc: { [votoFinal]: 1 } }, { new: true }, (err, actualizado) => {
                    if (err) return res.status(404).send({ message: "error promesaController linea 122" })
                    if (!actualizado) return res.status(500).send({ message: "error al opinar en la promesa" })
                    //actualizado.opinion.usuariosO.push(req.user.sub);
                    //actualizado.save();
                    actualizado.aprobacion = actualizado.votos.si / (actualizado.votos.si + actualizado.votos.no);
                    actualizado.yaVotaron.push(email);
                    actualizado.save();
                    return res.status(200).send({ promesa: actualizado })
                })

                /*Promesa.findById(promesaId, (err, encontrado) => {
                    if (err) return res.status(500).send({ message: 'error en la peticion (131)' });

                    if (!encontrado) return res.status(500).send({ message: "error al listar la promesa" });

                    encontrado.aprobacion = 
                })*/
            }
        })
    } else {
        return res.status(500).send({ message: 'solo puede utilizar si y no' })
    }

}






module.exports = {
    addCandidato,
    getCandidatos,

    subirImagen,
    obtenerImagen,

    addPromesa,
    getPromesas,
    votar
}