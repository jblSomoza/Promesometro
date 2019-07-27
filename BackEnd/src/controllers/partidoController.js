'use strict'

var Partido = require('../models/partido');
var path = require('path');
var fs = require('fs');


function addPartido(req, res) {
    var partido = new Partido();
    var params = req.body;

    if (req.user.rol == 'ADMIN') {

        if (params.nombre && params.descripcion) {
            partido.nombre = params.nombre.toUpperCase();
            partido.descripcion = params.descripcion;
            partido.image = null;

            Partido.findOne({ nombre: partido.nombre }, (err, buscado) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' })
                if (buscado) {
                    res.status(200).send({
                        message: 'ya existe'
                    })
                } else {

                    partido.save((err, partidoGuardado) => {
                        if (err) return res.status(500).send({ message: 'Error en el partido' })
                        if (!partidoGuardado) return res.status(500).send({ message: 'Error al agregar el partido' })

                        return res.status(200).send({ partido: partidoGuardado });
                    })

                }
            })

        } else {
            res.status(200).send({
                message: 'llenar todos los campos'
            })
        }

    } else {
        res.status(200).send({
            message: 'solo admin puede crear partidos'
        })
    }
}

function subirImagen(req, res) {
    var partidoId = req.params.id;

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
            Partido.findByIdAndUpdate(partidoId, { image: file_name }, { new: true }, (err, partidoActualizado) => {
                if (err) return res.status(500).send({ message: ' no se a podido actualizar el usuario' })

                if (!partidoActualizado) return res.status(404).send({ message: 'error en los datos del usuario, no se pudo actualizar' })

                return res.status(200).send({ partido: partidoActualizado });
            })
        } else {
            return removeFilesOfUploads(res, file_path, 'extension no valida')
        }

    }
}

function editPartido(req, res) {
    var partidoId = req.params.id;
    var params = req.body;

    Partido.findByIdAndUpdate(partidoId, params, { new: true }, (err, actualizado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });

        if (!actualizado) return res.status(404).send({ message: 'no se a podido actualizar los datos del partido' })

        return res.status(200).send({ partidoPolitico: actualizado });
    })
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


function getPartidos(req, res) {

    Partido.find().exec((err, partidos) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!partidos) return res.status(404).send({ message: 'Error al listar los partidos' })
        return res.status(200).send({ listaPartidos: partidos })
    })

}

module.exports = {
    addPartido,
    subirImagen,
    obtenerImagen,
    getPartidos,
    editPartido
}