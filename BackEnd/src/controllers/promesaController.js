'use strict'

var Promesa = require('../models/promesa');
var path = require('path');
var fs = require('fs');


function addPromesa(req, res) {
    var promesa = new Promesa();
    var candidatoId = req.params.id;
    var params = req.body;

    if (req.user.rol == 'ADMIN') {

        if (params.titulo && params.descripcion) {
            promesa.titulo = params.titulo;
            promesa.descripcion = params.descripcion;
            promesa.idCandidato = candidatoId;
            promesa.putnos = params.puntos;


            candidato.save((err, Guardado) => {
                if (err) return res.status(500).send({ message: 'Error en la persona' })
                if (!Guardado) return res.status(500).send({ message: 'Error al agregar al persona' })

                return res.status(200).send({ promesa: Guardado });
            })

        }

    } else {
        res.status(200).send({
            message: 'solo admin puede hacer una promesa'
        })
    }
}


function getPromesas(req, res) {
    var candidatoId = req.params.id;

    Promesa.find({ idCandidato: candidatoId }).exec((err, promesas) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!promesas) return res.status(404).send({ message: 'Error al listar las promesas' })
        return res.status(200).send({ listaPromesas: promesas })
    })

}

module.exports = {
    addCandidato,
    getCandidatos,
    addPromesa,
    getPromesas
}