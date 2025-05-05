const Examen = require('../models/ExamenModel.js');


// Metodo Read para Listar Examenes Pendientes
exports.listarExamenesPendientes = (req, res) => {
    Examen.listarExamenesPendientes((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los examenes pendientes", error: err });
        }

        res.status(200).json(results);
    });
}

// Metodo Read para Listar Pacientes con Examenes
exports.PacientesConExamen = (req, res) => {
    Examen.PacientesConExamen((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los pacientes", error: err });
        }

        res.status(200).json(results);
    });
}

// Metodo Read para Mostrar Historial de Examenes por Paciente
exports.historialExamenesPorPaciente = (req, res) => {
    const id_paciente = req.params.id_paciente; // Obtener el id del paciente de los parámetros de la solicitud

    Examen.historialExamenesPorPaciente(id_paciente, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los examenes por paciente", error: err });
        }

        res.status(200).json(results);
    });
}

// Metodo Read para Mostrar Los Resultados de un Examen
exports.mostrarResultadosExamen = (req, res) => {
    const id_examen = req.params.id_examen; // Obtener el id del examen de los parámetros de la solicitud
    Examen.mostrarResultadosExamen(id_examen, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los resultados del examen", error: err });
        }

        res.status(200).json(results);
    });
}

//Metodo Read para Mostrar Examenes Completados
exports.listarExamenesCompletados = (req, res) => {
    Examen.listarExamenesCompletados((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los examenes completados", error: err });
        }

        res.status(200).json(results);
    });
}

// Metodo Create para Crear un nuevo resultado de examen
exports.crearResultadoExamen = (req, res) => {
    const id_examen = req.params.id_examen; // Obtener el id del examen al que pertenece el resultado
    const nuevoResultado = req.body; // Obtener los datos del nuevo resultado del cuerpo de la solicitud

    Examen.crearResultadoExamen(id_examen, nuevoResultado, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al crear el resultado del examen", error: err });
        }
        res.status(201).json({ message: "Resultado del examen creado exitosamente", insertId: result.insertId });
    });
};

// Metodo Update para Actualizar un resultado de examen existente
exports.actualizarResultadoExamen = (req, res) => {
    const id_resultado = req.params.id_resultado; // Obtener el id del resultado a actualizar
    const resultadoActualizado = req.body; // Obtener los datos actualizados del cuerpo de la solicitud

    Examen.actualizarResultadoExamen(id_resultado, resultadoActualizado, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al actualizar el resultado del examen", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Resultado del examen no encontrado" });
        }
        res.status(200).json({ message: "Resultado del examen actualizado exitosamente" });
    });
};

// Metodo Update para Marcar un examen como inactivo
exports.marcarExamenComoInactivo = (req, res) => {
    const id_examen = req.params.id_examen; // Obtener el id del examen a marcar como inactivo

    Examen.marcarExamenComoInactivo(id_examen, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al marcar el examen como inactivo", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Examen no encontrado" });
        }
        res.status(200).json({ message: "Examen marcado como inactivo exitosamente" });
    });
};

// Metodo Delete para "Eliminar" (actualizar estado a inactivo) un resultado de examen
exports.eliminarResultadoExamen = (req, res) => {
    const id_resultado = req.params.id_resultado; // Obtener el id del resultado a "eliminar"

    Examen.eliminarResultadoExamen(id_resultado, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al actualizar el estado del resultado del examen", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Resultado del examen no encontrado" });
        }
        res.status(200).json({ message: "Estado del resultado del examen actualizado a inactivo exitosamente" });
    });
};

// Metodo Update para Marcar un examen como completado
exports.marcarExamenComoCompletado = (req, res) => {
    const id_examen = req.params.id_examen; // Obtener el id del examen a marcar como completado

    Examen.marcarExamenComoCompletado(id_examen, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al marcar el examen como completado", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Examen no encontrado" });
        }
        res.status(200).json({ message: "Examen marcado como completado exitosamente" });
    });
};