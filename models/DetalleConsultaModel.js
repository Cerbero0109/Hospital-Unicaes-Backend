const db = require('../database/conexion')


const DetalleConsulta = {};


// Listar consultas (activas)
DetalleConsulta.listarDetallesConsultasActivas = (callback) => {
    const sql = `SELECT * FROM detalle_consulta WHERE estado = 'activo'`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al listar el detalle de las consultas activas:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};


DetalleConsulta.listarDetalleConsultasById = (id, callback) => {

    const sql = `CALL sp_ListarDetalleConsultaById(?)`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error al listar los detalles del usuario seleccionado:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });

}

//hacer la consulta aqui? para imprimir el pdf

DetalleConsulta.listarDetalleConsultasByIdDetallePDF = (id, callback) => {
    //const sql = `CALL sp_ListarConsultaById`;
    const sql = `SELECT CONCAT(p.nombre_paciente, ' ', p.apellido_paciente) AS nombre_paciente, p.n_expediente, c.fecha_consulta AS fecha, tc.nombre_tipo_consulta AS tipo_consulta, c.estado_paciente, c.motivo_consulta AS motivo_enfermeria, ec.nombre_estado_consulta AS estado_consulta, dc.motivo_consulta AS motivo_consulta_detalle, dc.presente_enfermedad, dc.antecedentes, dc.presion_arterial, dc.frecuencia_cardiaca, dc.saturacion_oxigeno, dc.temperatura, dc.peso, dc.altura, dc.diagnostico, dc.observaciones, dc.examen_fisico FROM detalle_consulta dc LEFT JOIN consulta c ON dc.id_consulta = c.id_consulta LEFT JOIN paciente p ON c.id_paciente = p.id_paciente LEFT JOIN tipo_consulta tc ON c.id_tipo_consulta = tc.id_tipo_consulta LEFT JOIN estado_consulta ec ON dc.id_estado_consulta = ec.id_estado_consulta LEFT JOIN usuario u ON c.id_usuario = u.id_usuario WHERE c.id_usuario = (?) ORDER BY dc.id_detalle_consulta DESC LIMIT 1;
`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Model: Error al listar los detalles del usuario seleccionado:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });

}


DetalleConsulta.insertarDetalleConsulta = (consultaDetalleData, callback) => {
    const sql = `CALL sp_InsertarDetalleConsulta(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const {
        id_estado_consulta,
        motivo_consulta,
        presente_enfermedad,
        antecedentes,
        presion_arterial,
        frecuencia_cardiaca,
        saturacion_oxigeno,
        temperatura,
        peso,
        altura,
        diagnostico,
        observaciones,
        examen_fisico,
        id_consulta
    } = consultaDetalleData;

    db.query(sql, [
        id_estado_consulta,
        motivo_consulta,
        presente_enfermedad,
        antecedentes,
        presion_arterial,
        frecuencia_cardiaca,
        saturacion_oxigeno,
        temperatura,
        peso,
        altura,
        diagnostico,
        observaciones,
        examen_fisico,
        id_consulta
    ], (err, result) => {
        if (err) {
            console.error("Error al insertar el detalle de la consulta:", err);
            return callback(err, null);
        }

        return callback(null, result);
    });
};



DetalleConsulta.actualizarDetalleConsulta = (id, consultaDetalleData, callback) => {
    const sql = `CALL sp_ActualizarDetalleConsulta(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const {
        id_estado_consulta,
        motivo_consulta,
        presente_enfermedad,
        antecedentes,
        presion_arterial,
        frecuencia_cardiaca,
        saturacion_oxigeno,
        temperatura,
        peso,
        altura,
        diagnostico,
        observaciones,
        examen_fisico,
        id_consulta
    } = consultaDetalleData;

    db.query(sql, [
        id,
        id_estado_consulta,
        motivo_consulta,
        presente_enfermedad,
        antecedentes,
        presion_arterial,
        frecuencia_cardiaca,
        saturacion_oxigeno,
        temperatura,
        peso,
        altura,
        diagnostico,
        observaciones,
        examen_fisico,
        id_consulta
    ], (err, result) => {
        if (err) {
            console.error("Error al actualizar el detalle de la consulta:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};




// Cambiar estado del detalle de la consulta, metodo DELETE pero solo cambio de estado,  no elimina registros (no es recomendado)
DetalleConsulta.cambiarEstadoDetalleConsulta = (id, nuevoEstado, callback) => {
    const sql = `UPDATE detalle_consulta SET estado = ? WHERE id_consulta = ?`;

    db.query(sql, [nuevoEstado, id], (err, result) => {
        if (err) {
            console.error("Error al cambiar estado del detalle de la consulta:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

module.exports = DetalleConsulta;
