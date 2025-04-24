const db = require('../database/conexion')


const TipoConsulta = {};


// Listar tipos de consulta
TipoConsulta.listarTipoConsulta = (callback) => {
    const sql = `SELECT * FROM tipo_consulta`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al listar los tipos de consulta:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};



module.exports = TipoConsulta;