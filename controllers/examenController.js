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