const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const auth = {}


auth.register = async (req, res) => {

    const { email, password } = req.body;

    try {

        let usuario = await User.findOne({ email: email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya se encuentra registrado'
            });
        }

        usuario = new User(req.body);

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        //Generar JWT
        const token = await generarJWT(usuario._id, usuario.name);

        res.status(201).json({
            ok: true,
            _id: usuario._id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comunicarse con el administrador.'
        });
    }
}

auth.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await User.findOne({ email: email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no se encuentra registrado.'
            });
        }
        //Confirmar passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña Incorrecta.'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario._id, usuario.name);


        res.json({
            ok: true,
            _id: usuario._id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comunicarse con el administrador.'
        });
    }


}

auth.renew = async (req, res) => {

    const { uid, name } = req;

    //Generar JWT
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = auth;