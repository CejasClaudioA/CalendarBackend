/*
    Rutas de usuarios /Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const auth = require('../controllers/auth.controllers');
const validarCampos = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post('/register',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de al menos 6 caracteres').isLength({ min: 6 }),
        validarCampos.validarCampos

    ],
    auth.register);

router.post('/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de al menos 6 caracteres').isLength({ min: 6 }),
        validarCampos.validarCampos
    ],
    auth.login);

router.get('/renew', validarJWT, auth.renew);

module.exports = router;
