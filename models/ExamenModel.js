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

module.exports = Examen;
