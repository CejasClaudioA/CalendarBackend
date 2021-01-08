const event = {}
const Evento = require('../models/events.model');

event.getEventos = async (req, res) => {

    const eventos = await Evento.find().populate('user', 'name');

    res.status(200).json({
        ok: true,
        eventos
    });
}

event.crearEvento = async (req, res) => {

    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();

        return res.status(200).json({
            ok: true,
            evento: eventoGuardado
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Comunicarse con el administrador.'
        });
    }

}

event.actualizarEvento = async (req, res) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    try {

        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'El evento con ese id no existe!'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permiso para modificar este evento.'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findOneAndUpdate(eventoId, nuevoEvento, { new: true });

        res.status(404).json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Comunicarse con el administrador.'
        });
    }
}

event.eliminarEvento = async (req, res) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    try {

        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'El evento con ese id no existe!'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permiso para eliminar este evento.'
            });
        }

        await Evento.findOneAndDelete(eventoId);

        res.status(404).json({
            ok: true,
            msg: 'Evento eliminado'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Comunicarse con el administrador.'
        });
    }

    res.status(200).json({
        ok: true,
        msg: 'ActualizarEvento',
        eventoId
    });
}

module.exports = event;