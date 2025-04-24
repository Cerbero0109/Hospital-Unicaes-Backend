const DetalleConsulta = require('../models/DetalleConsultaModel');


// Metodo Read: Listar consultas (activos)
exports.listarDetallesConsultasActivas = (req, res) => {
    DetalleConsulta.listarDetallesConsultasActivas((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar el detalle de las consultas", error: err });
        }

        res.status(200).json(results);
    });
};

exports.listarDetalleConsultasById = (req, res) => {
    const id = req.params.id;

    DetalleConsulta.listarDetalleConsultasById(id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar el detalle seleccionado", error: err });
        }
        res.status(200).json(result[0]);
    });
};

////////////////////////////////////7
exports.listarDetalleConsultasByIdDetallePDF = (req, res) => {
    const id = req.params.id;

    DetalleConsulta.listarDetalleConsultasByIdDetallePDF(id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Controller: Error al listar el detalle seleccionado", error: err });
        }
        res.status(200).json(result[0]);
    });
};


//Metodo Insert
exports.insertarDetalleConsulta = (req, res) => {
    const detalleconsultaData = req.body;

    DetalleConsulta.insertarDetalleConsulta(detalleconsultaData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al registrar el detalle de la consulta", error: err });
        }

        res.status(200).json({ message: "Detalle de la consulta registrada" });
    });
};



//Metodo Update
exports.actualizarDetalleConsulta = (req, res) => {
    const detalleconsultaData = req.body;
    const id = req.params.id;

    DetalleConsulta.actualizarDetalleConsulta(id, detalleconsultaData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al actualizar el detalle de la consulta", error: err });
        }
        res.status(200).json({ message: "Detalle de la consulta actualizada" });
    });
};


// Cambiar estado del detalle de la consulta, metodo DELETE
exports.cambiarEstadoDetalleConsulta = (req, res) => {
    const { id, estado } = req.body;

    DetalleConsulta.cambiarEstadoDetalleConsulta(id, estado, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al cambiar estado del detalle de la consulta", error: err });
        }

        res.status(200).json({ message: "Estado del detalle de la consulta actualizada" });
    });
};