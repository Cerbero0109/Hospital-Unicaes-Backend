//MODULO FARMACIA
const db = require("../database/conexion");

const Despacho = {};

// Listar recetas pendientes de despacho
Despacho.listarRecetasPendientes = (callback) => {
  const sql = `
    SELECT 
      r.id_receta,
      r.fecha_receta,
      r.estado AS estado_receta,
      r.observaciones,
      c.id_consulta,
      p.id_paciente,
      CONCAT(p.nombre_paciente, ' ', p.apellido_paciente) AS nombre_paciente,
      c.id_usuario AS id_medico,
      CONCAT(um.nombre, ' ', um.apellido) AS nombre_medico,
      e.nombre_especialidad AS especialidad
    FROM receta_medica r
    JOIN consulta c ON r.id_consulta = c.id_consulta
    JOIN paciente p ON c.id_paciente = p.id_paciente
    JOIN usuario um ON c.id_usuario = um.id_usuario
    LEFT JOIN especialidad e ON um.id_especialidad = e.id_especialidad
    WHERE r.estado = 'pendiente'
    ORDER BY r.fecha_receta DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al listar recetas pendientes:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Listar historial de despachos con filtros
Despacho.listarHistorialDespachos = (page, limit, filtros, callback) => {
  const offset = (page - 1) * limit;

  let whereClause = '';
  const queryParams = [];

  // Construir filtros
  const conditions = [];

  if (filtros && filtros.estado) {
    conditions.push('d.estado = ?');
    queryParams.push(filtros.estado);
  }

  if (filtros && filtros.fechaInicio && filtros.fechaFin) {
    conditions.push('DATE(d.fecha_despacho) BETWEEN ? AND ?');
    queryParams.push(filtros.fechaInicio, filtros.fechaFin);
  }

  if (conditions.length > 0) {
    whereClause = 'WHERE ' + conditions.join(' AND ');
  }

  const sql = `
    SELECT 
      d.id_despacho,
      d.fecha_despacho,
      d.estado AS estado_despacho,
      d.observaciones,
      d.razon_cancelacion,
      r.id_receta,
      p.id_paciente,
      CONCAT(p.nombre_paciente, ' ', p.apellido_paciente) AS nombre_paciente,
      u.id_usuario AS id_despachador,
      CONCAT(u.nombre, ' ', u.apellido) AS nombre_despachador,
      um.id_usuario AS id_medico,
      CONCAT(um.nombre, ' ', um.apellido) AS nombre_medico,
      CASE 
        WHEN d.estado = 'cancelado' THEN 'Cancelado'
        ELSE GROUP_CONCAT(CONCAT(m.nombre, ' (', dd.cantidad_despachada, '/', dr.cantidad, ')') SEPARATOR ', ')
      END AS medicamentos
    FROM despacho d
    JOIN receta_medica r ON d.id_receta = r.id_receta
    JOIN consulta c ON r.id_consulta = c.id_consulta
    JOIN paciente p ON c.id_paciente = p.id_paciente
    JOIN usuario u ON d.id_usuario = u.id_usuario
    JOIN usuario um ON c.id_usuario = um.id_usuario
    LEFT JOIN detalle_despacho dd ON d.id_despacho = dd.id_despacho
    LEFT JOIN detalle_receta dr ON dd.id_detalle_receta = dr.id_detalle_receta
    LEFT JOIN medicamento m ON dr.id_medicamento = m.id_medicamento
    ${whereClause}
    GROUP BY d.id_despacho
    ORDER BY d.fecha_despacho DESC
    LIMIT ? OFFSET ?
  `;

  // Agregar parámetros para LIMIT y OFFSET
  queryParams.push(limit, offset);

  db.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error("Error al listar historial de despachos:", err);
      return callback(err, null);
    }

    // Obtener el total de registros con filtros
    let countSql = `
      SELECT COUNT(*) as total 
      FROM despacho d
      ${whereClause}
    `;

    // Remover los parámetros de LIMIT y OFFSET para la consulta de conteo
    const countParams = queryParams.slice(0, -2);

    db.query(countSql, countParams, (countErr, countResult) => {
      if (countErr) {
        console.error("Error al contar despachos:", countErr);
        return callback(countErr, null);
      }

      return callback(null, {
        data: results,
        total: countResult[0].total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(countResult[0].total / limit)
      });
    });
  });
};

// Obtener detalle de un despacho específico
Despacho.obtenerDetalleDespacho = (idDespacho, callback) => {
  const sql = `
    SELECT 
      d.*,
      r.id_receta,
      r.fecha_receta,
      r.observaciones AS observaciones_receta,
      p.id_paciente,
      CONCAT(p.nombre_paciente, ' ', p.apellido_paciente) AS nombre_paciente,
      u.id_usuario AS id_despachador,
      CONCAT(u.nombre, ' ', u.apellido) AS nombre_despachador,
      um.id_usuario AS id_medico,
      CONCAT(um.nombre, ' ', um.apellido) AS nombre_medico,
      e.nombre_especialidad AS especialidad
    FROM despacho d
    JOIN receta_medica r ON d.id_receta = r.id_receta
    JOIN consulta c ON r.id_consulta = c.id_consulta
    JOIN paciente p ON c.id_paciente = p.id_paciente
    JOIN usuario u ON d.id_usuario = u.id_usuario
    JOIN usuario um ON c.id_usuario = um.id_usuario
    LEFT JOIN especialidad e ON um.id_especialidad = e.id_especialidad
    WHERE d.id_despacho = ?
  `;

  db.query(sql, [idDespacho], (err, result) => {
    if (err) {
      console.error("Error al obtener detalle de despacho:", err);
      return callback(err, null);
    }

    if (result.length === 0) {
      return callback(null, null);
    }

    // Si es un despacho cancelado, no necesitamos obtener detalles de medicamentos
    if (result[0].estado === 'cancelado') {
      return callback(null, result[0]);
    }

    // Para despachos completos o parciales, obtener detalles de medicamentos
    const detallesSql = `
      SELECT 
        dd.*,
        dr.id_medicamento,
        dr.cantidad AS cantidad_requerida,
        dr.cantidad_despachada AS cantidad_total_despachada,
        dr.dosis,
        dr.frecuencia,
        dr.duracion,
        dr.instrucciones,
        dr.estado as estado_detalle_receta,
        m.codigo,
        m.nombre AS nombre_medicamento,
        m.concentracion,
        s.numero_lote,
        s.fecha_caducidad
      FROM detalle_despacho dd
      JOIN detalle_receta dr ON dd.id_detalle_receta = dr.id_detalle_receta
      JOIN medicamento m ON dr.id_medicamento = m.id_medicamento
      JOIN stock s ON dd.id_stock = s.id_stock
      WHERE dd.id_despacho = ?
    `;

    db.query(detallesSql, [idDespacho], (detErr, detalles) => {
      if (detErr) {
        console.error("Error al obtener detalles de medicamentos:", detErr);
        return callback(detErr, null);
      }

      // Agrupar detalles por medicamento para mejor visualización
      const medicamentosAgrupados = {};
      detalles.forEach(detalle => {
        if (!medicamentosAgrupados[detalle.id_medicamento]) {
          medicamentosAgrupados[detalle.id_medicamento] = {
            id_medicamento: detalle.id_medicamento,
            nombre_medicamento: detalle.nombre_medicamento,
            concentracion: detalle.concentracion,
            cantidad_requerida: detalle.cantidad_requerida,
            cantidad_total_despachada: 0, // Inicializar en 0, vamos a calcular la suma real
            estado_detalle_receta: detalle.estado_detalle_receta,
            lotes: []
          };
        }

        // Agregar la cantidad despachada al total
        medicamentosAgrupados[detalle.id_medicamento].cantidad_total_despachada += detalle.cantidad_despachada;

        medicamentosAgrupados[detalle.id_medicamento].lotes.push({
          id_stock: detalle.id_stock,
          numero_lote: detalle.numero_lote,
          cantidad_despachada: detalle.cantidad_despachada,
          fecha_caducidad: detalle.fecha_caducidad
        });
      });

      const despacho = {
        ...result[0],
        detalles: Object.values(medicamentosAgrupados)
      };

      return callback(null, despacho);
    });
  });
};

// Obtener detalle de una receta con sus medicamentos
Despacho.obtenerDetalleReceta = (idReceta, callback) => {
  const sql = `
    SELECT 
      dr.id_detalle_receta,
      dr.id_medicamento,
      dr.cantidad,
      dr.dosis,
      dr.frecuencia,
      dr.duracion,
      dr.instrucciones,
      dr.estado AS estado_detalle,
      m.codigo,
      m.nombre AS nombre_medicamento,
      m.concentracion,
      m.via_administracion,
      m.ubicacion_almacen,
      p.nombre_presentacion,
      (SELECT SUM(s.cantidad_disponible) 
       FROM stock s 
       WHERE s.id_medicamento = m.id_medicamento 
       AND s.estado = 'activo') AS stock_disponible
    FROM detalle_receta dr
    JOIN medicamento m ON dr.id_medicamento = m.id_medicamento
    LEFT JOIN presentacion_medicamento p ON m.id_presentacion = p.id_presentacion
    WHERE dr.id_receta = ?
  `;

  db.query(sql, [idReceta], (err, results) => {
    if (err) {
      console.error("Error al obtener detalle de receta:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Obtener lotes disponibles para un medicamento
Despacho.obtenerLotesDisponibles = (idMedicamento, callback) => {
  const sql = `
    SELECT 
      s.id_stock,
      s.numero_lote,
      s.fecha_caducidad,
      s.cantidad_disponible,
      s.fecha_ingreso,
      m.ubicacion_almacen
    FROM stock s
    JOIN medicamento m ON s.id_medicamento = m.id_medicamento
    WHERE s.id_medicamento = ? 
    AND s.estado = 'activo' 
    AND s.cantidad_disponible > 0
    ORDER BY s.fecha_caducidad ASC
  `;

  db.query(sql, [idMedicamento], (err, results) => {
    if (err) {
      console.error("Error al obtener lotes disponibles:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Crear despacho
Despacho.crearDespacho = (despachoData, callback) => {
  const { id_receta, id_usuario, estado, observaciones } = despachoData;

  const sql = `
    INSERT INTO despacho (id_receta, id_usuario, estado, observaciones)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [id_receta, id_usuario, estado, observaciones], (err, result) => {
    if (err) {
      console.error("Error al crear despacho:", err);
      return callback(err, null);
    }
    return callback(null, result.insertId);
  });
};

// Crear despacho cancelado (incluye razón de cancelación)
Despacho.crearDespachoCancelado = (despachoData, callback) => {
  const { id_receta, id_usuario, estado, observaciones, razon_cancelacion } = despachoData;

  const sql = `
    INSERT INTO despacho (id_receta, id_usuario, estado, observaciones, razon_cancelacion)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [id_receta, id_usuario, estado, observaciones, razon_cancelacion], (err, result) => {
    if (err) {
      console.error("Error al crear despacho cancelado:", err);
      return callback(err, null);
    }
    return callback(null, result.insertId);
  });
};

// Crear detalle de despacho
Despacho.crearDetalleDespacho = (detalleData, callback) => {
  const { id_despacho, id_detalle_receta, id_stock, cantidad_despachada } = detalleData;

  const sql = `
    INSERT INTO detalle_despacho (id_despacho, id_detalle_receta, id_stock, cantidad_despachada)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [id_despacho, id_detalle_receta, id_stock, cantidad_despachada], (err, result) => {
    if (err) {
      console.error("Error al crear detalle de despacho:", err);
      return callback(err, null);
    }
    return callback(null, result.insertId);
  });
};

// Actualizar stock después del despacho
Despacho.actualizarStockDespacho = (idStock, cantidadDespachada, callback) => {
  const sql = `
    UPDATE stock 
    SET cantidad_disponible = cantidad_disponible - ?
    WHERE id_stock = ?
  `;

  db.query(sql, [cantidadDespachada, idStock], (err, result) => {
    if (err) {
      console.error("Error al actualizar stock:", err);
      return callback(err, null);
    }

    // Verificar si el stock quedó en 0 para marcarlo como agotado
    const checkStockSql = `
      UPDATE stock 
      SET estado = 'agotado'
      WHERE id_stock = ? AND cantidad_disponible <= 0
    `;

    db.query(checkStockSql, [idStock], (checkErr) => {
      if (checkErr) {
        console.error("Error al verificar estado del stock:", checkErr);
      }
      return callback(null, result);
    });
  });
};

// Actualizar cantidad despachada en detalle_receta
Despacho.actualizarCantidadDespachadaDetalleReceta = (idDetalleReceta, cantidadDespachada, callback) => {
  const sql = `
    UPDATE detalle_receta 
    SET cantidad_despachada = cantidad_despachada + ?
    WHERE id_detalle_receta = ?
  `;

  db.query(sql, [cantidadDespachada, idDetalleReceta], (err, result) => {
    if (err) {
      console.error("Error al actualizar cantidad despachada:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Actualizar estado de detalle de receta
Despacho.actualizarEstadoDetalleReceta = (idDetalleReceta, estado, callback) => {
  const sql = `
    UPDATE detalle_receta 
    SET estado = ?
    WHERE id_detalle_receta = ?
  `;

  db.query(sql, [estado, idDetalleReceta], (err, result) => {
    if (err) {
      console.error("Error al actualizar estado de detalle de receta:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Actualizar estado de receta
Despacho.actualizarEstadoReceta = (idReceta, estado, callback) => {
  const sql = `
    UPDATE receta_medica 
    SET estado = ?
    WHERE id_receta = ?
  `;

  db.query(sql, [estado, idReceta], (err, result) => {
    if (err) {
      console.error("Error al actualizar estado de receta:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

module.exports = Despacho;