const db = require('../database/conexion')


const Examen = {};


// Listar Examenes Pendientes
Examen.listarExamenesPendientes = (callback) => {
    const sql = `SELECT e.id_examen,
                        p.id_paciente,
                        p.nombre_paciente, 
                        p.apellido_paciente,
                        u.nombre AS doctor_nombre, 
                        u.apellido AS doctor_apellido,
                        t.nombre AS examen_nombre, 
                        m.nombre_muestra,
                        e.fecha_solicitud
                FROM paciente p
                JOIN muestra m ON p.id_paciente=m.id_paciente
                JOIN examen e ON e.id_muestra = m.id_muestra
                JOIN usuario u ON e.id_usuario = u.id_usuario
                JOIN tipo_examen t ON e.id_tipo_examen= t.id_tipo_examen
                WHERE e.estado = 'pendiente';`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("model: Error al listar los examenes pendientes:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};


// Listar Pacientes con Examenes
Examen.PacientesConExamen = (callback) => {
    const sql = `SELECT 
                        p.id_paciente,
                        p.nombre_paciente, 
                        p.apellido_paciente, 
                        p.dui_paciente, 
                        p.sexo_paciente, 
                        p.telefono_paciente,
                        MAX(e.fecha_solicitud) AS ultima_fecha_solicitud
                    FROM paciente p
                    JOIN muestra m ON p.id_paciente = m.id_paciente
                    JOIN examen e ON e.id_muestra = m.id_muestra
                    WHERE p.estado = 'activo'
                    GROUP BY 
                        p.id_paciente, 
                        p.nombre_paciente, 
                        p.apellido_paciente, 
                        p.dui_paciente, 
                        p.sexo_paciente, 
                        p.telefono_paciente
                    ORDER BY ultima_fecha_solicitud DESC;`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("model: Error al listar los pacientes:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};



// Mostrar Historial de Examenes por Paciente
Examen.historialExamenesPorPaciente = (id_paciente, callback) => {
    const sql = `SELECT 
                    e.id_examen,
                    t.nombre AS nombre_examen,
                    e.fecha_solicitud,
                    e.estado
                FROM examen e
                JOIN tipo_examen t ON t.id_tipo_examen = e.id_tipo_examen  
                JOIN muestra m ON m.id_muestra = e.id_muestra
                WHERE m.id_paciente = ?;`;

    db.query(sql, [id_paciente], (err, results) => {
        if (err) {
            console.error("model: Error al listar los examenes:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};



// Mostrar Resultados de Examen por ID
Examen.mostrarResultadosExamen = (id_examen, callback) => {
    const sql = `SELECT 
                    p.nombre_paciente, 
                    p.apellido_paciente, 
                    t.nombre AS nombre_examen, 
                    m.nombre_muestra,
                    COALESCE(r.id_resultado, 'Esperando un ID') AS id_resultado,
                    COALESCE(r.nombre_parametro, 'Esperando resultados') AS nombre_parametro,
                    COALESCE(r.valor, 'Esperando valor') AS valor,
                    COALESCE(r.unidad, 'Esperando unidad') AS unidad,
                    COALESCE(r.rango_referencia, 'Esperando rango') AS rango_referencia
                FROM examen e
                JOIN tipo_examen t ON e.id_tipo_examen = t.id_tipo_examen
                JOIN muestra m ON e.id_muestra = m.id_muestra
                JOIN paciente p ON m.id_paciente = p.id_paciente
                LEFT JOIN resultados r ON r.id_examen = e.id_examen
                WHERE e.id_examen = ?;
                `;

    db.query(sql, [id_examen], (err, results) => {
        if (err) {
            console.error("model: Error al listar los resultados del examen:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};


//Listar Examenes Completados
Examen.listarExamenesCompletados = (callback) => {
    const sql = `SELECT e.id_examen,
                        p.id_paciente,
                        p.nombre_paciente, 
                        p.apellido_paciente,
                        u.nombre AS doctor_nombre, 
                        u.apellido AS doctor_apellido,
                        t.nombre AS examen_nombre, 
                        m.nombre_muestra,
                        e.fecha_solicitud
                        FROM paciente p
                        JOIN muestra m ON p.id_paciente=m.id_paciente
                        JOIN examen e ON e.id_muestra = m.id_muestra
                        JOIN usuario u ON e.id_usuario = u.id_usuario
                        JOIN tipo_examen t ON e.id_tipo_examen= t.id_tipo_examen
                        WHERE e.estado = 'completado';`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("model: Error al listar los examenes completados:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};

// Crear un nuevo resultado de examen
Examen.crearResultadoExamen = (id_examen, nuevoResultado, callback) => {
    const sql = `INSERT INTO resultados (id_examen, nombre_parametro, valor, unidad, rango_referencia)
                  VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [id_examen, nuevoResultado.nombre_parametro, nuevoResultado.valor, nuevoResultado.unidad, nuevoResultado.rango_referencia], (err, result) => {
        if (err) {
            console.error("model: Error al crear el resultado del examen:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

// Actualizar un resultado de examen existente
Examen.actualizarResultadoExamen = (id_resultado, resultadoActualizado, callback) => {
    const sql = `UPDATE resultados
                  SET nombre_parametro = ?,
                      valor = ?,
                      unidad = ?,
                      rango_referencia = ?
                  WHERE id_resultado = ?`;
    db.query(sql, [resultadoActualizado.nombre_parametro, resultadoActualizado.valor, resultadoActualizado.unidad, resultadoActualizado.rango_referencia, id_resultado], (err, result) => {
        if (err) {
            console.error("model: Error al actualizar el resultado del examen:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

// Actualizar el estado de un examen a inactivo
Examen.marcarExamenComoInactivo = (id_examen, callback) => {
    const sql = `UPDATE examen
                    SET estado = 'inactivo'
                    WHERE id_examen = ?`;
    db.query(sql, [id_examen], (err, result) => {
        if (err) {
            console.error("model: Error al actualizar el estado del examen a inactivo:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

// Actualizar el estado de un resultado de examen a inactivo
Examen.eliminarResultadoExamen = (id_resultado, callback) => {
    const sql = `DELETE FROM resultados 
                    WHERE id_resultado = ?`;
    db.query(sql, [id_resultado], (err, result) => {
        if (err) {
            console.error("model: Error al actualizar el estado del resultado del examen:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

// Marcar un examen como completado
Examen.marcarExamenComoCompletado = (id_examen, callback) => {
    const sql = `UPDATE examen SET estado = 'completado' WHERE id_examen = ?`;
    db.query(sql, [id_examen], (err, result) => {
        if (err) {
            console.error("model: Error al marcar el examen como completado:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};


//Actualizar el estado de un paciente a inactivo
Examen.marcarPacienteComoInactivo = (id_paciente, callback) => {
    const sql = `UPDATE paciente SET estado = 'inactivo' WHERE id_paciente = ?`;
    db.query(sql, [id_paciente], (err, result) => {
        if (err) {
            console.error("model: Error al marcar el paciente como inactivo:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

//Mostrar los últimos 5 exámenes para el dashboard
Examen.listarUltimosExamenes = (callback) => {
    const sql = `SELECT 
                        e.id_examen, 
                        p.nombre_paciente,
                        p.apellido_paciente , 
                        p.dui_paciente,
                        p.telefono_paciente,
                        t.nombre AS nombre_examen, 
                        e.estado 
                    FROM examen e
                    JOIN muestra m ON m.id_muestra = e.id_muestra
                    JOIN paciente p ON p.id_paciente = m.id_paciente
                    JOIN tipo_examen t ON e.id_tipo_examen = t.id_tipo_examen
                    ORDER BY e.fecha_solicitud DESC LIMIT 5;`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("model: Error al listar los examenes:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};


//Contar Examenes Pendientes
Examen.contarExamenesPendientes = (callback) => {
    const sql = `SELECT COUNT(*) AS total_examenes_pendientes
                FROM examen
                WHERE estado = 'pendiente';`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("model: Error al contar los examenes pendientes:", err);
            return callback(err, null);
        }
        return callback(null, results[0].total_examenes_pendientes);
    });
};


//Contar Examenes Completados
Examen.contarExamenesCompletados = (callback) => {
    const sql = `SELECT COUNT(*) AS total_examenes_completados
                FROM examen
                WHERE estado = 'completado';`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("model: Error al contar los examenes completados:", err);
            return callback(err, null);
        }
        return callback(null, results[0].total_examenes_completados);
    });
};

//Contar Pacientes con Examen
Examen.contarPacientesConExamen = (callback) => {
    const sql = `SELECT COUNT(DISTINCT p.id_paciente) AS total_pacientes_con_examen 
                 FROM paciente p 
                 JOIN muestra m ON p.id_paciente = m.id_paciente 
                 JOIN examen e ON e.id_muestra = m.id_muestra 
                 WHERE p.estado = 'activo';`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("model: Error al contar los pacientes con examen:", err);
            return callback(err, null);
        }
        return callback(null, results[0].total_pacientes_con_examen);
    });
};

module.exports = Examen;
