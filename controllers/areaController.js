const Area = require('../models/AreaModel');


// Metodo Read: Listar areas (activas)
exports.listarArea = (req, res) => {
    Area.listarArea((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar las areas", error: err });
        }

        res.status(200).json(results);
    });
};

//listar area by id
exports.listarAreaById = (req, res) => {
    const id = req.params.id;

    Area.listarAreaById(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Controller Error al listar la especialidad, seleccionada",
                error: err,
            });
        }
        res.status(200).json(result);
    });
};

//Metodo Insert
exports.insertarArea = (req, res) => {
    const areaData = req.body;

    Area.insertarArea(areaData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al registrar la area", error: err });
        }

        res.status(200).json({ message: "Area registrada" });
    });
};



//Metodo Update
exports.actualizarArea = (req, res) => {
    const areaData = req.body;
    const id = req.params.id;

    Area.actualizarArea(id, areaData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al actualizar la area", error: err });
        }
        res.status(200).json({ message: "Area actualizada" });
    });
};


// Cambiar estado de la area, metodo DELETE
exports.cambiarEstadoArea = (req, res) => {
    const id = req.params.id; // Extrayendo el id de la URL
    Area.cambiarEstadoArea(id, (err) => {
        if (err) {
            return res.status(500).json({ message: "Error al cambiar estado de la area", error: err });
        }

        res.status(200).json({ message: "Estado del area actualizada" });
    });
};