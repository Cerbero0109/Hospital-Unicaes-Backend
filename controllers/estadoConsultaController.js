const EstadoConsulta = require('../models/EstadoConsultaModel');



// Metodo Read: Listar estados de consulta
exports.listarEstadoConsulta = (req, res) => {
    EstadoConsulta.listarEstadoConsulta((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los estados de consulta", error: err });
        }

        res.status(200).json(results);
    });
};