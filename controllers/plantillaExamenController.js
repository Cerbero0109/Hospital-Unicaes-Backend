const PlantillaExamen = require('../models/PlantillaExamenModel');

// ========================================
// CONTROLADORES PARA PLANTILLAS
// ========================================

// Crear nueva plantilla
exports.crearPlantilla = (req, res) => {
    const plantillaData = {
        ...req.body,
        id_usuario_creador: req.session.user.id_usuario
    };

    PlantillaExamen.crearPlantilla(plantillaData, (err, result) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al crear la plantilla", 
                error: err 
            });
        }
        res.status(201).json({ 
            message: "Plantilla creada exitosamente", 
            id_plantilla: result.id_plantilla 
        });
    });
};

// Listar todas las plantillas
exports.listarTodasPlantillas = (req, res) => {
    PlantillaExamen.listarTodasPlantillas((err, results) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al listar las plantillas", 
                error: err 
            });
        }
        res.status(200).json(results);
    });
};

// Listar plantillas por tipo de examen
exports.listarPlantillasPorTipo = (req, res) => {
    const id_tipo_examen = req.params.id_tipo_examen;

    PlantillaExamen.listarPlantillasPorTipo(id_tipo_examen, (err, results) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al listar plantillas por tipo", 
                error: err 
            });
        }
        res.status(200).json(results);
    });
};

// Obtener plantilla completa con parámetros
exports.obtenerPlantillaCompleta = (req, res) => {
    const id_plantilla = req.params.id_plantilla;

    PlantillaExamen.obtenerPlantillaCompleta(id_plantilla, (err, result) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al obtener la plantilla", 
                error: err 
            });
        }
        res.status(200).json(result);
    });
};

// Actualizar plantilla
exports.actualizarPlantilla = (req, res) => {
    const id_plantilla = req.params.id_plantilla;
    const plantillaData = req.body;

    PlantillaExamen.actualizarPlantilla(id_plantilla, plantillaData, (err, result) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al actualizar la plantilla", 
                error: err 
            });
        }
        res.status(200).json({ 
            message: "Plantilla actualizada exitosamente" 
        });
    });
};

// Desactivar plantilla
exports.desactivarPlantilla = (req, res) => {
    const id_plantilla = req.params.id_plantilla;

    PlantillaExamen.desactivarPlantilla(id_plantilla, (err, result) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al desactivar la plantilla", 
                error: err 
            });
        }
        res.status(200).json({ 
            message: "Plantilla desactivada exitosamente" 
        });
    });
};

// ========================================
// CONTROLADORES PARA PARÁMETROS
// ========================================

// Agregar parámetro a plantilla
exports.agregarParametro = (req, res) => {
    const id_plantilla = req.params.id_plantilla;
    const parametroData = {
        ...req.body,
        id_plantilla: id_plantilla
    };

    PlantillaExamen.agregarParametro(parametroData, (err, result) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al agregar el parámetro", 
                error: err 
            });
        }
        res.status(201).json({ 
            message: "Parámetro agregado exitosamente" 
        });
    });
};

// Actualizar parámetro
exports.actualizarParametro = (req, res) => {
    const id_plantilla_parametro = req.params.id_plantilla_parametro;
    const parametroData = req.body;

    PlantillaExamen.actualizarParametro(id_plantilla_parametro, parametroData, (err, result) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al actualizar el parámetro", 
                error: err 
            });
        }
        res.status(200).json({ 
            message: "Parámetro actualizado exitosamente" 
        });
    });
};

// Eliminar parámetro
exports.eliminarParametro = (req, res) => {
    const id_plantilla_parametro = req.params.id_plantilla_parametro;

    PlantillaExamen.eliminarParametro(id_plantilla_parametro, (err, result) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al eliminar el parámetro", 
                error: err 
            });
        }
        res.status(200).json({ 
            message: "Parámetro eliminado exitosamente" 
        });
    });
};

// ========================================
// CONTROLADORES PARA USO EN EXÁMENES
// ========================================

// Crear resultados desde plantilla
exports.crearResultadosDesdeePlantilla = (req, res) => {
    const { id_examen, id_plantilla } = req.body;

    PlantillaExamen.crearResultadosDesdeePlantilla(id_examen, id_plantilla, (err, result) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al crear resultados desde plantilla", 
                error: err 
            });
        }
        res.status(201).json({ 
            message: "Resultados creados exitosamente desde la plantilla" 
        });
    });
};

// Listar tipos de examen
exports.listarTiposExamen = (req, res) => {
    PlantillaExamen.listarTiposExamen((err, results) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al listar tipos de examen", 
                error: err 
            });
        }
        res.status(200).json(results);
    });
};

// Buscar plantillas
exports.buscarPlantillas = (req, res) => {
    const termino = req.query.q || '';

    if (termino.length < 2) {
        return res.status(400).json({ 
            message: "El término de búsqueda debe tener al menos 2 caracteres" 
        });
    }

    PlantillaExamen.buscarPlantillas(termino, (err, results) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al buscar plantillas", 
                error: err 
            });
        }
        res.status(200).json(results);
    });
};

// Contar plantillas por usuario
exports.contarPlantillasPorUsuario = (req, res) => {
    const id_usuario = req.params.id_usuario || req.session.user.id_usuario;

    PlantillaExamen.contarPlantillasPorUsuario(id_usuario, (err, total) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al contar plantillas", 
                error: err 
            });
        }
        res.status(200).json({ total_plantillas: total });
    });
};

// ========================================
// CONTROLADORES ADICIONALES
// ========================================

// Duplicar plantilla (crear copia)
exports.duplicarPlantilla = (req, res) => {
    const id_plantilla_original = req.params.id_plantilla;
    const { nombre_plantilla, descripcion } = req.body;

    // Primero obtener la plantilla original
    PlantillaExamen.obtenerPlantillaCompleta(id_plantilla_original, (err, plantillaOriginal) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al obtener la plantilla original", 
                error: err 
            });
        }

        // Crear nueva plantilla
        const nuevaPlantillaData = {
            id_tipo_examen: plantillaOriginal.plantilla.id_tipo_examen,
            nombre_plantilla: nombre_plantilla || `${plantillaOriginal.plantilla.nombre_plantilla} (Copia)`,
            descripcion: descripcion || plantillaOriginal.plantilla.descripcion,
            id_usuario_creador: req.session.user.id_usuario
        };

        PlantillaExamen.crearPlantilla(nuevaPlantillaData, (err, nuevaPlantilla) => {
            if (err) {
                return res.status(500).json({ 
                    message: "Error al crear la nueva plantilla", 
                    error: err 
                });
            }

            // Copiar parámetros
            let parametrosCopiados = 0;
            const totalParametros = plantillaOriginal.parametros.length;

            if (totalParametros === 0) {
                return res.status(201).json({ 
                    message: "Plantilla duplicada exitosamente",
                    id_plantilla: nuevaPlantilla.id_plantilla
                });
            }

            plantillaOriginal.parametros.forEach(parametro => {
                const parametroData = {
                    id_plantilla: nuevaPlantilla.id_plantilla,
                    nombre_parametro: parametro.nombre_parametro,
                    unidad: parametro.unidad,
                    rango_referencia: parametro.rango_referencia,
                    valor_por_defecto: parametro.valor_por_defecto,
                    orden: parametro.orden,
                    es_obligatorio: parametro.es_obligatorio
                };

                PlantillaExamen.agregarParametro(parametroData, (err, result) => {
                    if (err) {
                        console.error("Error al copiar parámetro:", err);
                    }
                    
                    parametrosCopiados++;
                    
                    if (parametrosCopiados === totalParametros) {
                        res.status(201).json({ 
                            message: "Plantilla duplicada exitosamente",
                            id_plantilla: nuevaPlantilla.id_plantilla
                        });
                    }
                });
            });
        });
    });
};

// Validar plantilla antes de usar
exports.validarPlantilla = (req, res) => {
    const id_plantilla = req.params.id_plantilla;

    PlantillaExamen.obtenerPlantillaCompleta(id_plantilla, (err, result) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error al validar la plantilla", 
                error: err 
            });
        }

        const plantilla = result.plantilla;
        const parametros = result.parametros;

        // Validaciones
        const validaciones = {
            existe: !!plantilla,
            tieneParametros: parametros.length > 0,
            parametrosObligatorios: parametros.filter(p => p.es_obligatorio).length,
            totalParametros: parametros.length,
            esValida: true,
            errores: []
        };

        if (!plantilla) {
            validaciones.esValida = false;
            validaciones.errores.push("La plantilla no existe");
        }

        if (parametros.length === 0) {
            validaciones.esValida = false;
            validaciones.errores.push("La plantilla no tiene parámetros definidos");
        }

        // Verificar parámetros duplicados
        const nombresParametros = parametros.map(p => p.nombre_parametro.toLowerCase());
        const parametrosDuplicados = nombresParametros.filter((nombre, index) => 
            nombresParametros.indexOf(nombre) !== index
        );

        if (parametrosDuplicados.length > 0) {
            validaciones.esValida = false;
            validaciones.errores.push("Existen parámetros con nombres duplicados");
        }

        res.status(200).json(validaciones);
    });
};