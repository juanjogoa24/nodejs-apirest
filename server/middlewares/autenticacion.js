const jwt = require('jsonwebtoken');

//==============
// verificar token
//================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();
    })

};

//==============
// verificar ROLE
//================

let verificaRole = (req, res, next) => {

    let usuario = req.usuario;
    console.log("usuario:", usuario);
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Error, el usuario no tiene Rol de Admin'
            }
        })
    }

    next();


};


module.exports = {
    verificaToken,
    verificaRole
}