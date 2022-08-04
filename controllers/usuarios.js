const { response } = require("express")

const Usuario = require('../models/usuario')

const getUsuarios = async(req, res= response)=>{
    const desde = Number(req.query.desde) || 0;
    const usuarios = await Usuario.find({_id:{$ne:req.uid}}).sort('-online').skip(desde).limit(10);

    //const usuarios = await Usuario.find().sort('-online').skip(desde).limit(10);


    return res.status(200).json({
        'ok':true,
        usuarios
    })
}

module.exports = {getUsuarios}