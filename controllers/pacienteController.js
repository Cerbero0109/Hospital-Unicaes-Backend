const Paciente = require('../models/PacienteModel');


// Metodo Read: Listar pacientes (activos)
exports.listarPacientesActivos = (req, res) => {
    Paciente.listarPacientesActivos((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los pacientes", error: err });
        }

        res.status(200).json(results);
    });
};


//listar pacientes by id
exports.listarPacienteById = (req, res) => {
    const id = req.params.id;

    Paciente.ListarPacienteById(id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar el usuario, seleccionado", error: err });
        }
        res.status(200).json(result);
    });
};


//Metodo Insert
exports.insertarPaciente = (req, res) => {
    const pacienteData = req.body;

    Paciente.insertarPaciente(pacienteData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al registrar el paciente", error: err });
        }

        res.status(200).json({ message: "Paciente registrado" });
    });
};



//Metodo Update
exports.actualizarPaciente = (req, res) => {
    const pacienteData = req.body;
    const id = req.params.id;

    if (pacienteData.fecha_nacimiento_paciente) {
        pacienteData.fecha_nacimiento_paciente = pacienteData.fecha_nacimiento_paciente.split("T")[0];
    }
    

    Paciente.actualizarPaciente(id, pacienteData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al actualizar el paciente", error: err });
        }
        res.status(200).json({ message: "Paciente actualizado" });
    });
};


// Cambiar estado de paciente, metodo DELETE
exports.cambiarEstadoPaciente = (req, res) => {
    const id = req.params.id;  // Extrayendo el id de la URL

    // Realiza la actualización del estado del paciente
    Paciente.cambiarEstadoPaciente(id, (error, result) => {
        if (error) {
            return res.status(500).json({ message: "Error al cambiar el estado del paciente", error });
        }
        res.status(200).json({ message: "Estado cambiado a inactivo correctamente" });
    });
};