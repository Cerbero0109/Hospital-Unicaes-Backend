const db = require('../database/conexion')


const HistorialMedico = {};


// Listar roles
HistorialMedico.listarHistorialMedico = (callback) => {
    const sql = `SELECT * FROM historial_medico WHERE estado = 'activo' `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al listar los historiales medicos:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};


HistorialMedico.insertarHistorialMedico = (HistorialMedicoData, callback) => {
    const sql = `CALL sp_InsertarHistorialMedico(?, ?, ?)`;

    const {
        descripcion_his_medico,
        fecha,
        id_detalle_consulta
    } = HistorialMedicoData;

    db.query(sql, [
        descripcion_his_medico,
        fecha,
        id_detalle_consulta
    ], (err, result) => {
        if (err) {
            console.error("Error al insertar el historial medico:", err);
            return callback(err, null);
        }

        return callback(null, result);
    });
};


HistorialMedico.actualizarHistorialMedico = (id, HistorialMedicoData, callback) => {
    const sql = `CALL sp_ActualizarHistorialMedico(?, ?, ?, ?)`;

    const {
        descripcion_his_medico,
        fecha,
        id_detalle_consulta
    } = HistorialMedicoData;

    db.query(sql, [
        id,
        descripcion_his_medico,
        fecha,
        id_detalle_consulta
    ], (err, result) => {
        if (err) {
            console.error("Error al actualizar el historial medico:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

// Cambiar estado del historial medico, metodo DELETE pero solo cambio de estado,  no elimina registros (no es recomendado)
HistorialMedico.cambiarEstadoHistorialMedico = (id, nuevoEstado, callback) => {
    const sql = `UPDATE historial_medico SET estado = ? WHERE id_historial_medico = ?`;

    db.query(sql, [nuevoEstado, id], (err, result) => {
        if (err) {
            console.error("Error al cambiar estado del historial medico:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

module.exports = HistorialMedico;
