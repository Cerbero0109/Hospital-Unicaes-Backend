const TipoConsulta = require('../models/TipoConsultaModel');



// Metodo Read: Listar tipos de consulta
exports.listarTipoConsulta = (req, res) => {
    TipoConsulta.listarTipoConsulta((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los tipos de consulta", error: err });
        }

        res.status(200).json(results);
    });
};