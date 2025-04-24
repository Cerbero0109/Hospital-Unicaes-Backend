const HistorialMedico = require('../models/HistorialMedicoModel');


// Metodo Read: Listar roles (activos)
exports.listarHistorialMedico = (req, res) => {
    HistorialMedico.listarHistorialMedico((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los historiales medicos", error: err });
        }

        res.status(200).json(results);
    });
};


//Metodo Insert
exports.insertarHistorialMedico = (req, res) => {
    const HistorialMedicoData = req.body;

    HistorialMedico.insertarHistorialMedico(HistorialMedicoData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al registrar el historial medico", error: err });
        }

        res.status(200).json({ message: "Historial medico registrado" });
    });
};



//Metodo Update
exports.actualizarHistorialMedico = (req, res) => {
    const HistorialMedicoData = req.body;
    const id = req.params.id;

    HistorialMedico.actualizarHistorialMedico(id, HistorialMedicoData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al actualizar el historial medico", error: err });
        }
        res.status(200).json({ message: "Historial Medico actualizado" });
    });
};


// Cambiar estado del rol, metodo DELETE
exports.cambiarEstadoHistorialMedico = (req, res) => {
    const { id, estado } = req.body;

    HistorialMedico.cambiarEstadoHistorialMedico(id, estado, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al cambiar estado del historial medico", error: err });
        }

        res.status(200).json({ message: "Estado del historial medico actualizado" });
    });
};