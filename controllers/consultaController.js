const Consulta = require('../models/ConsultaModel');


// Metodo Read: Listar consultas (activos)
exports.listarConsultasActivos = (req, res) => {
    Consulta.listarConsultasActivos((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar las consultas", error: err });
        }

        res.status(200).json(results);
    });
};


exports.listarConsultasById = (req, res) => {
    const id = req.params.id;

    Consulta.listarConsultasById(id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar la consulta, seleccionada", error: err });
        }
        res.status(200).json(result[0]); 
    });
};



//Metodo Insert
exports.insertarConsulta = (req, res) => {
    const consultaData = req.body;

    Consulta.insertarConsulta(consultaData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al registrar la consulta", error: err });
        }

        res.status(200).json({ message: "Consulta registrada" });
    });
};


//Metodo para cuando el medico tome la consulta
exports.tomarConsulta = (req, res) => {
    const consultaData = req.body;
    const id = req.params.id;

    Consulta.tomarConsulta(id, consultaData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al tomar la consulta", error: err });
        }
        res.status(200).json({ message: "Tomaste la consulta exitosamente" });
    });
};


//Metodo Update
exports.actualizarConsulta = (req, res) => {
    const consultaData = req.body;
    const id = req.params.id;

    Consulta.actualizarConsulta(id, consultaData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al actualizar la consulta", error: err });
        }
        res.status(200).json({ message: "Consulta actualizada" });
    });
};


// Cambiar estado de la consulta, metodo DELETE
exports.cambiarEstadoConsulta = (req, res) => {
    const { id, estado } = req.body;

    Consulta.cambiarEstadoConsulta(id, estado, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al cambiar estado de la consulta", error: err });
        }

        res.status(200).json({ message: "Estado de la consulta actualizada" });
    });
};