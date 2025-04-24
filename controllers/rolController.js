const Rol = require('../models/RolModel');


// Metodo Read: Listar roles (activos)
exports.listarRoles = (req, res) => {
    Rol.listarRoles((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los roles", error: err });
        }

        res.status(200).json(results);
    });
};


//Metodo Insert
exports.insertarRol = (req, res) => {
    const rolData = req.body;

    Rol.insertarRol(rolData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al registrar el rol", error: err });
        }

        res.status(200).json({ message: "Rol registrado" });
    });
};



//Metodo Update
exports.actualizarRol = (req, res) => {
    const rolData = req.body;
    const id = req.params.id;

    Rol.actualizarRol(id, rolData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al actualizar el rol", error: err });
        }
        res.status(200).json({ message: "Rol actualizado" });
    });
};


// Cambiar estado del rol, metodo DELETE
exports.cambiarEstadoRol = (req, res) => {
    const { id, estado } = req.body;

    Rol.cambiarEstadoRol(id, estado, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al cambiar estado del rol", error: err });
        }

        res.status(200).json({ message: "Estado del rol actualizado" });
    });
};