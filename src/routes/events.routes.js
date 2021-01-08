const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const validarCampos = require('../middlewares/validar-campos');
const evento = require('../controllers/event.controller');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');
router.use(validarJWT);

router.get('/', evento.getEventos);
router.post('/', [
    check('title', "El titulo es obligatorio").not().isEmpty(),
    check('start', "La fecha de inicio es obligatoria").custom(isDate),
    validarCampos.validarCampos
], evento.crearEvento);
router.put('/:id', evento.actualizarEvento);
router.delete('/:id', evento.eliminarEvento);

module.exports = router;