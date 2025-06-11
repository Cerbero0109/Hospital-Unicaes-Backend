const db = require('../database/conexion');

const PlantillaExamen = {};

// ========================================
// MÉTODOS PARA PLANTILLAS
// ========================================

// Crear nueva plantilla
PlantillaExamen.crearPlantilla = (plantillaData, callback) => {
    const sql = `CALL sp_CrearPlantillaExamen(?, ?, ?, ?)`;
    
    db.query(sql, [
        plantillaData.id_tipo_examen,
        plantillaData.nombre_plantilla,
        plantillaData.descripcion,
        plantillaData.id_usuario_creador
    ], (err, results) => {
        if (err) {
            console.error("Error al crear plantilla:", err);
            return callback(err, null);
        }
        return callback(null, results[0][0]);
    });
};

// Listar todas las plantillas
PlantillaExamen.listarTodasPlantillas = (callback) => {
    const sql = `SELECT 
                    p.id_plantilla,
                    p.nombre_plantilla,
                    p.descripcion,
                    p.fecha_creacion,
                    p.fecha_modificacion,
                    te.nombre AS tipo_examen_nombre,
                    u.nombre AS creador_nombre,
                    u.apellido AS creador_apellido,
                    COUNT(pp.id_plantilla_parametro) AS total_parametros
                FROM plantilla_examen p
                JOIN tipo_examen te ON p.id_tipo_examen = te.id_tipo_examen
                JOIN usuario u ON p.id_usuario_creador = u.id_usuario
                LEFT JOIN plantilla_parametro pp ON p.id_plantilla = pp.id_plantilla AND pp.estado = 'activo'
                WHERE p.estado = 'activa'
                GROUP BY p.id_plantilla
                ORDER BY p.fecha_modificacion DESC`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al listar plantillas:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};

// Listar plantillas por tipo de examen
PlantillaExamen.listarPlantillasPorTipo = (id_tipo_examen, callback) => {
    const sql = `CALL sp_ListarPlantillasPorTipo(?)`;
    
    db.query(sql, [id_tipo_examen], (err, results) => {
        if (err) {
            console.error("Error al listar plantillas por tipo:", err);
            return callback(err, null);
        }
        return callback(null, results[0]);
    });
};

// Obtener plantilla completa con parámetros
PlantillaExamen.obtenerPlantillaCompleta = (id_plantilla, callback) => {
    const sql = `CALL sp_ObtenerPlantillaCompleta(?)`;
    
    db.query(sql, [id_plantilla], (err, results) => {
        if (err) {
            console.error("Error al obtener plantilla completa:", err);
            return callback(err, null);
        }
        
        const plantilla = results[0][0];
        const parametros = results[1];
        
        return callback(null, {
            plantilla: plantilla,
            parametros: parametros
        });
    });
};

// Actualizar plantilla
PlantillaExamen.actualizarPlantilla = (id_plantilla, plantillaData, callback) => {
    const sql = `CALL sp_ActualizarPlantilla(?, ?, ?)`;
    
    db.query(sql, [
        id_plantilla,
        plantillaData.nombre_plantilla,
        plantillaData.descripcion
    ], (err, results) => {
        if (err) {
            console.error("Error al actualizar plantilla:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};

// Desactivar plantilla
PlantillaExamen.desactivarPlantilla = (id_plantilla, callback) => {
    const sql = `CALL sp_DesactivarPlantilla(?)`;
    
    db.query(sql, [id_plantilla], (err, results) => {
        if (err) {
            console.error("Error al desactivar plantilla:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};

// ========================================
// MÉTODOS PARA PARÁMETROS DE PLANTILLAS
// ========================================

// Agregar parámetro a plantilla
PlantillaExamen.agregarParametro = (parametroData, callback) => {
    const sql = `CALL sp_AgregarParametroPlantilla(?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [
        parametroData.id_plantilla,
        parametroData.nombre_parametro,
        parametroData.unidad,
        parametroData.rango_referencia,
        parametroData.valor_por_defecto,
        parametroData.orden,
        parametroData.es_obligatorio
    ], (err, results) => {
        if (err) {
            console.error("Error al agregar parámetro:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};

// Actualizar parámetro
PlantillaExamen.actualizarParametro = (id_plantilla_parametro, parametroData, callback) => {
    const sql = `CALL sp_ActualizarParametroPlantilla(?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [
        id_plantilla_parametro,
        parametroData.nombre_parametro,
        parametroData.unidad,
        parametroData.rango_referencia,
        parametroData.valor_por_defecto,
        parametroData.orden,
        parametroData.es_obligatorio
    ], (err, results) => {
        if (err) {
            console.error("Error al actualizar parámetro:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};

// Eliminar parámetro
PlantillaExamen.eliminarParametro = (id_plantilla_parametro, callback) => {
    const sql = `CALL sp_EliminarParametroPlantilla(?)`;
    
    db.query(sql, [id_plantilla_parametro], (err, results) => {
        if (err) {
            console.error("Error al eliminar parámetro:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};

// ========================================
// MÉTODOS PARA USAR PLANTILLAS EN EXÁMENES
// ========================================

// Crear resultados desde plantilla
PlantillaExamen.crearResultadosDesdeePlantilla = (id_examen, id_plantilla, callback) => {
    const sql = `CALL sp_CrearResultadosDesdeePlantilla(?, ?)`;
    
    db.query(sql, [id_examen, id_plantilla], (err, results) => {
        if (err) {
            console.error("Error al crear resultados desde plantilla:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};

// Listar tipos de examen para selector
PlantillaExamen.listarTiposExamen = (callback) => {
    const sql = `SELECT id_tipo_examen, nombre, descripcion 
                FROM tipo_examen 
                ORDER BY nombre ASC`;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al listar tipos de examen:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};

// Buscar plantillas (para búsquedas)
PlantillaExamen.buscarPlantillas = (termino, callback) => {
    const sql = `SELECT 
                    p.id_plantilla,
                    p.nombre_plantilla,
                    p.descripcion,
                    te.nombre AS tipo_examen_nombre,
                    u.nombre AS creador_nombre,
                    u.apellido AS creador_apellido,
                    COUNT(pp.id_plantilla_parametro) AS total_parametros
                FROM plantilla_examen p
                JOIN tipo_examen te ON p.id_tipo_examen = te.id_tipo_examen
                JOIN usuario u ON p.id_usuario_creador = u.id_usuario
                LEFT JOIN plantilla_parametro pp ON p.id_plantilla = pp.id_plantilla AND pp.estado = 'activo'
                WHERE p.estado = 'activa' 
                AND (p.nombre_plantilla LIKE ? OR p.descripcion LIKE ? OR te.nombre LIKE ?)
                GROUP BY p.id_plantilla
                ORDER BY p.fecha_modificacion DESC`;
    
    const searchTerm = `%${termino}%`;
    
    db.query(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.error("Error al buscar plantillas:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
};

// Contar plantillas por usuario
PlantillaExamen.contarPlantillasPorUsuario = (id_usuario, callback) => {
    const sql = `SELECT COUNT(*) AS total_plantillas
                FROM plantilla_examen 
                WHERE id_usuario_creador = ? AND estado = 'activa'`;
    
    db.query(sql, [id_usuario], (err, results) => {
        if (err) {
            console.error("Error al contar plantillas por usuario:", err);
            return callback(err, null);
        }
        return callback(null, results[0].total_plantillas);
    });
};

module.exports = PlantillaExamen;