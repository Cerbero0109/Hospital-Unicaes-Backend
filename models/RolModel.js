const db = require('../database/conexion')


const Rol = {};


// Listar roles
Rol.listarRoles = (callback) => {
    const sql = `SELECT * FROM rol WHERE estado = 'activo' `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al listar los roles:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};


Rol.insertarRol = (rolData, callback) => {
    const sql = `CALL sp_InsertarRol(?, ?)`;

    const {
        nombre_rol,
        cargo
    } = rolData;

    db.query(sql, [
       nombre_rol, cargo
    ], (err, result) => {
        if (err) {
            console.error("Error al insertar el rol:", err);
            return callback(err, null);
        }

        return callback(null, result);
    });
};


Rol.actualizarRol = (id, rolData, callback) => {
    const sql = `CALL sp_ActualizarRol(?, ?, ?)`;

    const {
        nombre_rol,
        cargo
    } = rolData;

    db.query(sql, [
        id, nombre_rol, cargo
    ], (err, result) => {
        if (err) {
            console.error("Error al actualizar el rol:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

// Cambiar estado de un rol, metodo DELETE pero solo cambio de estado,  no elimina registros (no es recomendado)
Rol.cambiarEstadoRol = (id, nuevoEstado, callback) => {
    const sql = `UPDATE rol SET estado = ? WHERE id_rol = ?`;

    db.query(sql, [nuevoEstado, id], (err, result) => {
        if (err) {
            console.error("Error al cambiar estado del rol:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

module.exports = Rol;
