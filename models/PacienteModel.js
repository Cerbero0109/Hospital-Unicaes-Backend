const db = require('../database/conexion');

const Paciente = {};

// Listar pacientes (activos)
Paciente.listarPacientesActivos = (callback) => {
    const sql = `SELECT * FROM paciente WHERE estado = 'activo'`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al listar pacientes activos:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};

Paciente.ListarPacienteById = (id, callback) => {
    const sql = `CALL sp_ListarPaciente(?)`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error al listar el paciente:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

Paciente.insertarPaciente = (pacienteData, callback) => {
    const year = new Date().getFullYear();

    const sqlContarPacientes = `
        SELECT COUNT(*) AS total_pacientes
        FROM paciente
        WHERE n_expediente LIKE '${year}-%'
    `;

    db.query(sqlContarPacientes, (err, result) => {
        if (err) {
            console.error("Error al contar pacientes del año:", err);
            return callback(err, null);
        }

        const totalPacientes = result[0].total_pacientes;
        const nuevoExpediente = `${year}-${totalPacientes + 1}`;

        const pacienteDataConExpediente = { ...pacienteData, n_expediente: nuevoExpediente };

        const sqlInsertar = `CALL sp_InsertarPaciente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const {
            n_expediente,
            nombre_paciente,
            apellido_paciente,
            fecha_nacimiento_paciente,
            dui_paciente,
            sexo_paciente,
            telefono_paciente,
            direccion_paciente,
            contactoE_nombre,
            contactoE_telefono,
            contactoE_parentesco,
            responsable_nombre,
            responsable_dui,
            responsable_telefono,
            responsable_parentesco
        } = pacienteDataConExpediente;

        db.query(sqlInsertar, [
            n_expediente, nombre_paciente, apellido_paciente, fecha_nacimiento_paciente,
            dui_paciente, sexo_paciente, telefono_paciente, direccion_paciente,
            contactoE_nombre, contactoE_telefono, contactoE_parentesco,
            responsable_nombre, responsable_dui, responsable_telefono, responsable_parentesco
        ], (err, result) => {
            if (err) {
                console.error("Error al insertar el paciente:", err);
                return callback(err, null);
            }

            return callback(null, result);
        });
    });
};

Paciente.cambiarEstadoPaciente = (id, callback) => {
    const sql = `UPDATE paciente SET estado = 'inactivo' WHERE id_paciente = ?`;
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.error("Error al cambiar el estado del paciente:", error);
            callback(error, null);
        } else {
            callback(null, result);
        }
    });
};

Paciente.actualizarPaciente = (id, pacienteData, callback) => {
    // El número de expediente puede no ser cambiado en este caso, pero se incluye si es necesario actualizarlo
    const sql = `CALL sp_ActualizarPaciente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const {
        n_expediente,
        nombre_paciente,
        apellido_paciente,
        fecha_nacimiento_paciente,
        dui_paciente,
        sexo_paciente,
        telefono_paciente,
        direccion_paciente,
        contactoE_nombre,
        contactoE_telefono,
        contactoE_parentesco,
        responsable_nombre,
        responsable_dui,
        responsable_telefono,
        responsable_parentesco
    } = pacienteData;

    db.query(sql, [
        id, n_expediente, nombre_paciente, apellido_paciente, fecha_nacimiento_paciente,
        dui_paciente, sexo_paciente, telefono_paciente, direccion_paciente,
        contactoE_nombre, contactoE_telefono, contactoE_parentesco,
        responsable_nombre, responsable_dui, responsable_telefono, responsable_parentesco
    ], (err, result) => {
        if (err) {
            console.error("Error al actualizar el paciente:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};

module.exports = Paciente;
