const db = require('../database/conexion')


const EstadoConsulta = {};


// Listar estado de consulta
EstadoConsulta.listarEstadoConsulta = (callback) => {
    const sql = `SELECT * FROM estado_consulta`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al listar los estados de consulta:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};



module.exports = EstadoConsulta;