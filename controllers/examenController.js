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
    const id_examen = req.params.id_examen; 
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

// Metodo Delete para "Eliminar" un resultado de examen
exports.eliminarResultadoExamen = (req, res) => {
    const id_resultado = req.params.id_resultado; 

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
    let nombre_laboratorista = 'Desconocido';
    if (req.session.user && req.session.user.nombre && req.session.user.apellido) {
        nombre_laboratorista = `${req.session.user.nombre} ${req.session.user.apellido}`;
    }

    Examen.marcarExamenComoCompletado(id_examen, nombre_laboratorista, (err, result) => { 
        if (err) {
            return res.status(500).json({ message: "Error al marcar el examen como completado", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Examen no encontrado" });
        }
        res.status(200).json({ message: "Examen marcado como completado exitosamente" });
    });
};

//Metodo para actualizar el estado de un paciente a inactivo
exports.marcarPacienteComoInactivo = (req, res) => {
    const id_paciente = req.params.id_paciente; // Obtener el id del paciente a marcar como inactivo

    Examen.marcarPacienteComoInactivo(id_paciente, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al marcar el paciente como inactivo", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        res.status(200).json({ message: "Paciente marcado como inactivo exitosamente" });
    });
};

//Metodo para listar los últimos exámenes
exports.listarUltimosExamenes = (req, res) => {
    Examen.listarUltimosExamenes((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los últimos exámenes", error: err });
        }

        res.status(200).json(results);
    });
}

//Metodo para contar los exámenes pendientes
exports.contarExamenesPendientes = (req, res) => {
    Examen.contarExamenesPendientes((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al contar los exámenes pendientes", error: err });
        }

        res.status(200).json(results);
    });
}

// Metodo para contar los exámenes completados
exports.contarExamenesCompletados = (req, res) => {
    Examen.contarExamenesCompletados((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al contar los exámenes completados", error: err });
        }

        res.status(200).json(results);
    });
}

//Metodo para contar los pacientes con examen
exports.contarPacientesConExamen = (req, res) => {
    Examen.contarPacientesConExamen((err, total) => {
        if (err) {
            return res.status(500).json({ error: 'Error al contar los pacientes con examen' });
        }
       res.status(200).json({ total_pacientes: total });

    });
};

// ========== CONTROLADORES PARA TIPOS DE EXAMEN ==========

// Listar todos los tipos de examen
exports.listarTiposExamen = (req, res) => {
    Examen.listarTiposExamen((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al listar los tipos de examen", error: err });
        }
        res.status(200).json(results);
    });
};

// Obtener tipo de examen por ID
exports.obtenerTipoExamenPorId = (req, res) => {
    const id_tipo_examen = req.params.id_tipo_examen;
    
    Examen.obtenerTipoExamenPorId(id_tipo_examen, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al obtener el tipo de examen", error: err });
        }
        if (!result) {
            return res.status(404).json({ message: "Tipo de examen no encontrado" });
        }
        res.status(200).json(result);
    });
};

// Crear nuevo tipo de examen
exports.crearTipoExamen = (req, res) => {
    const nuevoTipoExamen = req.body;
    
    // Validaciones básicas
    if (!nuevoTipoExamen.nombre || !nuevoTipoExamen.nombre.trim()) {
        return res.status(400).json({ message: "El nombre del tipo de examen es requerido" });
    }
    
    // Verificar si ya existe un tipo de examen con el mismo nombre
    Examen.verificarNombreTipoExamen(nuevoTipoExamen.nombre.trim(), null, (err, existe) => {
        if (err) {
            return res.status(500).json({ message: "Error al verificar el nombre", error: err });
        }
        
        if (existe) {
            return res.status(400).json({ message: "Ya existe un tipo de examen con ese nombre" });
        }
        
        // Proceder con la creación
        Examen.crearTipoExamen(nuevoTipoExamen, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error al crear el tipo de examen", error: err });
            }
            res.status(201).json({ 
                message: "Tipo de examen creado exitosamente", 
                id_tipo_examen: result.insertId 
            });
        });
    });
};

// Actualizar tipo de examen
exports.actualizarTipoExamen = (req, res) => {
    const id_tipo_examen = req.params.id_tipo_examen;
    const tipoExamenActualizado = req.body;
    
    // Validaciones básicas
    if (!tipoExamenActualizado.nombre || !tipoExamenActualizado.nombre.trim()) {
        return res.status(400).json({ message: "El nombre del tipo de examen es requerido" });
    }
    
    // Verificar si ya existe un tipo de examen con el mismo nombre (excluyendo el actual)
    Examen.verificarNombreTipoExamen(tipoExamenActualizado.nombre.trim(), id_tipo_examen, (err, existe) => {
        if (err) {
            return res.status(500).json({ message: "Error al verificar el nombre", error: err });
        }
        
        if (existe) {
            return res.status(400).json({ message: "Ya existe un tipo de examen con ese nombre" });
        }
        
        // Proceder con la actualización
        Examen.actualizarTipoExamen(id_tipo_examen, tipoExamenActualizado, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error al actualizar el tipo de examen", error: err });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Tipo de examen no encontrado" });
            }
            res.status(200).json({ message: "Tipo de examen actualizado exitosamente" });
        });
    });
};

// Eliminar tipo de examen
exports.eliminarTipoExamen = (req, res) => {
    const id_tipo_examen = req.params.id_tipo_examen;
    
    Examen.eliminarTipoExamen(id_tipo_examen, (err, result) => {
        if (err) {
            if (err.message.includes('exámenes asociados')) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: "Error al eliminar el tipo de examen", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Tipo de examen no encontrado" });
        }
        res.status(200).json({ message: "Tipo de examen eliminado exitosamente" });
    });
};

// Contar plantillas por tipo de examen
exports.contarPlantillasPorTipo = (req, res) => {
    const id_tipo_examen = req.params.id_tipo_examen;
    
    Examen.contarPlantillasPorTipo(id_tipo_examen, (err, count) => {
        if (err) {
            return res.status(500).json({ message: "Error al contar plantillas", error: err });
        }
        res.status(200).json({ count });
    });
};
