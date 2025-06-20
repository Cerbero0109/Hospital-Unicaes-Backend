const Despacho = require("../models/despachoModel");
const db = require("../database/conexion");

// Listar recetas pendientes
exports.listarRecetasPendientes = (req, res) => {
  Despacho.listarRecetasPendientes((err, results) => {
    if (err) {
      console.error("Error en controlador al listar recetas pendientes:", err);
      return res.status(500).json({
        success: false,
        message: "Error al listar recetas pendientes",
        error: err.message
      });
    }
    res.status(200).json({
      success: true,
      data: results || []
    });
  });
};

// Obtener detalle de receta
exports.obtenerDetalleReceta = (req, res) => {
  const idReceta = req.params.idReceta;

  Despacho.obtenerDetalleReceta(idReceta, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener detalle de receta",
        error: err
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

// Obtener información completa de receta para despacho
exports.obtenerInformacionCompletaReceta = (req, res) => {
  const idReceta = req.params.idReceta;

  Despacho.obtenerInformacionCompletaReceta(idReceta, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener información completa de receta",
        error: err
      });
    }

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Receta no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  });
};

// Obtener lotes disponibles para un medicamento
exports.obtenerLotesDisponibles = (req, res) => {
  const idMedicamento = req.params.idMedicamento;

  Despacho.obtenerLotesDisponibles(idMedicamento, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener lotes disponibles",
        error: err
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

// Realizar despacho (completo, parcial o cancelado) - CORREGIDO
exports.realizarDespacho = (req, res) => {
  const { id_receta, tipo_despacho, detalles, observaciones, razon_cancelacion } = req.body;

  // Obtener id_usuario de la sesión
  const id_usuario = req.session.user?.id_usuario;

  if (!id_usuario) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado o sin permisos suficientes"
    });
  }

  // Si es una cancelación, cancelar TODOS los detalles de la receta
  if (tipo_despacho === 'cancelado') {
    if (!razon_cancelacion || razon_cancelacion.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "La razón de cancelación es obligatoria"
      });
    }

    return db.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al iniciar transacción",
          error: err.message
        });
      }

      // Crear registro de despacho cancelado
      const despachoData = {
        id_receta,
        id_usuario,
        estado: 'cancelado',
        observaciones,
        razon_cancelacion
      };

      Despacho.crearDespachoCancelado(despachoData, (despachoErr, idDespacho) => {
        if (despachoErr) {
          return db.rollback(() => {
            res.status(500).json({
              success: false,
              message: "Error al cancelar el despacho",
              error: despachoErr.message
            });
          });
        }

        // Actualizar TODOS los detalles de receta a estado 'cancelado'
        // y resetear cantidad_despachada a 0
        const cancelarDetallesSql = `
          UPDATE detalle_receta 
          SET estado = 'cancelado', cantidad_despachada = 0
          WHERE id_receta = ?
        `;

        db.query(cancelarDetallesSql, [id_receta], (cancelErr) => {
          if (cancelErr) {
            return db.rollback(() => {
              res.status(500).json({
                success: false,
                message: "Error al cancelar detalles de receta",
                error: cancelErr.message
              });
            });
          }

          // Actualizar estado de la receta
          Despacho.actualizarEstadoReceta(id_receta, 'cancelada', (recetaErr) => {
            if (recetaErr) {
              return db.rollback(() => {
                res.status(500).json({
                  success: false,
                  message: "Error al actualizar estado de receta",
                  error: recetaErr.message
                });
              });
            }

            // Commit transaction
            db.commit((commitErr) => {
              if (commitErr) {
                return db.rollback(() => {
                  res.status(500).json({
                    success: false,
                    message: "Error al confirmar transacción",
                    error: commitErr.message
                  });
                });
              }

              res.status(201).json({
                success: true,
                message: "Despacho cancelado exitosamente",
                data: { id_despacho: idDespacho, tipo: 'cancelado' }
              });
            });
          });
        });
      });
    });
  }

  // Para despachos completos o parciales, procesamos los detalles
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al iniciar transacción",
        error: err.message
      });
    }

    // Crear registro de despacho
    const despachoData = {
      id_receta,
      id_usuario,
      estado: tipo_despacho, // 'completo' o 'parcial'
      observaciones
    };

    Despacho.crearDespacho(despachoData, (despachoErr, idDespacho) => {
      if (despachoErr) {
        return db.rollback(() => {
          res.status(500).json({
            success: false,
            message: "Error al crear despacho",
            error: despachoErr.message
          });
        });
      }

      // Procesar cada detalle
      let detallesProcesados = 0;
      let erroresDetalle = [];
      
      // Primero obtener todos los detalles de la receta para manejar estados correctamente
      const obtenerDetallesSql = `
        SELECT dr.*, m.nombre as nombre_medicamento,
               (SELECT SUM(s.cantidad_disponible) 
                FROM stock s 
                WHERE s.id_medicamento = dr.id_medicamento 
                AND s.estado = 'activo') AS stock_disponible
        FROM detalle_receta dr
        JOIN medicamento m ON dr.id_medicamento = m.id_medicamento
        WHERE dr.id_receta = ?
      `;

      db.query(obtenerDetallesSql, [id_receta], (detallesErr, todosLosDetalles) => {
        if (detallesErr) {
          return db.rollback(() => {
            res.status(500).json({
              success: false,
              message: "Error al obtener detalles de receta",
              error: detallesErr.message
            });
          });
        }

        // Crear un mapa de detalles enviados en el request
        const detallesEnviados = {};
        if (detalles && detalles.length > 0) {
          detalles.forEach(detalle => {
            detallesEnviados[detalle.id_detalle_receta] = detalle;
          });
        }

        // Procesar todos los detalles de la receta
        const procesarDetalle = (index) => {
          if (index >= todosLosDetalles.length) {
            // Todos los detalles procesados, determinar estado final de la receta
            determinarEstadoFinalReceta(id_receta, (estadoErr, estadoFinal) => {
              if (estadoErr) {
                return db.rollback(() => {
                  res.status(500).json({
                    success: false,
                    message: "Error al determinar estado final",
                    error: estadoErr.message
                  });
                });
              }

              // Actualizar estado de la receta
              Despacho.actualizarEstadoReceta(id_receta, estadoFinal, (recetaErr) => {
                if (recetaErr) {
                  return db.rollback(() => {
                    res.status(500).json({
                      success: false,
                      message: "Error al actualizar estado de receta",
                      error: recetaErr.message
                    });
                  });
                }

                // Commit transaction
                db.commit((commitErr) => {
                  if (commitErr) {
                    return db.rollback(() => {
                      res.status(500).json({
                        success: false,
                        message: "Error al confirmar transacción",
                        error: commitErr.message
                      });
                    });
                  }

                  res.status(201).json({
                    success: true,
                    message: `Despacho ${tipo_despacho} realizado exitosamente`,
                    data: {
                      id_despacho: idDespacho,
                      tipo: tipo_despacho,
                      estado_final_receta: estadoFinal
                    }
                  });
                });
              });
            });
            return;
          }

          const detalleActual = todosLosDetalles[index];
          const detalleEnviado = detallesEnviados[detalleActual.id_detalle_receta];

          // Determinar estado y cantidad para este detalle
          let estadoDetalle;
          let cantidadDespachada = 0;

          if (!detalleEnviado || !detalleEnviado.lotes || detalleEnviado.lotes.length === 0) {
            // No hay lotes seleccionados para este medicamento
            if (detalleActual.stock_disponible === 0 || detalleActual.stock_disponible < detalleActual.cantidad) {
              estadoDetalle = 'no_disponible';
            } else {
              estadoDetalle = 'pendiente'; // O el estado que tenía antes
            }
            cantidadDespachada = 0;
          } else {
            // Hay lotes seleccionados, calcular cantidad total
            cantidadDespachada = detalleEnviado.lotes.reduce(
              (sum, lote) => sum + (parseInt(lote.cantidad) || 0), 
              0
            );

            // Determinar estado basado en cantidad despachada
            if (cantidadDespachada === 0) {
              if (detalleActual.stock_disponible === 0) {
                estadoDetalle = 'no_disponible';
              } else {
                estadoDetalle = 'pendiente';
              }
            } else if (cantidadDespachada >= detalleActual.cantidad) {
              estadoDetalle = 'despachado';
              cantidadDespachada = detalleActual.cantidad; // No puede ser mayor a lo solicitado
            } else {
              estadoDetalle = 'despachado_parcial';
            }
          }

          // Actualizar el detalle de receta
          const actualizarDetalleSql = `
            UPDATE detalle_receta 
            SET cantidad_despachada = ?, estado = ?
            WHERE id_detalle_receta = ?
          `;

          db.query(actualizarDetalleSql, [cantidadDespachada, estadoDetalle, detalleActual.id_detalle_receta], (updateErr) => {
            if (updateErr) {
              erroresDetalle.push(`Error al actualizar detalle ${detalleActual.id_detalle_receta}: ${updateErr.message}`);
              return procesarDetalle(index + 1);
            }

            // Si hay lotes para despachar, crear los registros de detalle_despacho
            if (detalleEnviado && detalleEnviado.lotes && detalleEnviado.lotes.length > 0) {
              let lotesProcessed = 0;
              const totalLotes = detalleEnviado.lotes.length;

              if (totalLotes === 0) {
                return procesarDetalle(index + 1);
              }

              detalleEnviado.lotes.forEach((lote) => {
                if (parseInt(lote.cantidad) > 0) {
                  const detalleDespachoData = {
                    id_despacho: idDespacho,
                    id_detalle_receta: detalleActual.id_detalle_receta,
                    id_stock: lote.id_stock,
                    cantidad_despachada: parseInt(lote.cantidad)
                  };

                  // Crear detalle de despacho
                  Despacho.crearDetalleDespacho(detalleDespachoData, (detalleErr) => {
                    if (detalleErr) {
                      erroresDetalle.push(`Error al crear detalle despacho: ${detalleErr.message}`);
                    } else {
                      // Actualizar stock
                      Despacho.actualizarStockDespacho(lote.id_stock, parseInt(lote.cantidad), (stockErr) => {
                        if (stockErr) {
                          erroresDetalle.push(`Error al actualizar stock: ${stockErr.message}`);
                        }
                      });
                    }

                    lotesProcessed++;
                    if (lotesProcessed === totalLotes) {
                      procesarDetalle(index + 1);
                    }
                  });
                } else {
                  lotesProcessed++;
                  if (lotesProcessed === totalLotes) {
                    procesarDetalle(index + 1);
                  }
                }
              });
            } else {
              procesarDetalle(index + 1);
            }
          });
        };

        // Comenzar procesamiento
        procesarDetalle(0);
      });
    });
  });
};

// Función auxiliar para determinar el estado final de la receta
function determinarEstadoFinalReceta(idReceta, callback) {
  const sql = `
    SELECT 
      COUNT(*) as total_detalles,
      COUNT(CASE WHEN estado = 'despachado' THEN 1 END) as despachados_completos,
      COUNT(CASE WHEN estado = 'despachado_parcial' THEN 1 END) as despachados_parciales,
      COUNT(CASE WHEN estado = 'cancelado' THEN 1 END) as cancelados,
      COUNT(CASE WHEN estado = 'no_disponible' THEN 1 END) as no_disponibles,
      COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as pendientes
    FROM detalle_receta 
    WHERE id_receta = ?
  `;

  db.query(sql, [idReceta], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    const stats = results[0];
    let estadoFinal;

    if (stats.cancelados === stats.total_detalles) {
      estadoFinal = 'cancelada';
    } else if (stats.despachados_completos === stats.total_detalles) {
      estadoFinal = 'despachada';
    } else if (stats.despachados_completos > 0 || stats.despachados_parciales > 0) {
      estadoFinal = 'despachada_parcial';
    } else {
      estadoFinal = 'pendiente';
    }

    callback(null, estadoFinal);
  });
}

// Cancelar despacho - ACTUALIZADO
exports.cancelarDespacho = (req, res) => {
  const { id_receta, razon_cancelacion, observaciones } = req.body;

  // Obtener id_usuario de la sesión
  const id_usuario = req.session.user?.id_usuario;

  if (!id_usuario) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado o sin permisos suficientes"
    });
  }

  if (!razon_cancelacion || razon_cancelacion.trim() === '') {
    return res.status(400).json({
      success: false,
      message: "La razón de cancelación es obligatoria"
    });
  }

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al iniciar transacción",
        error: err.message
      });
    }

    // Crear registro de despacho cancelado
    const despachoData = {
      id_receta,
      id_usuario,
      estado: 'cancelado',
      observaciones,
      razon_cancelacion
    };

    Despacho.crearDespachoCancelado(despachoData, (despachoErr, idDespacho) => {
      if (despachoErr) {
        return db.rollback(() => {
          res.status(500).json({
            success: false,
            message: "Error al cancelar el despacho",
            error: despachoErr.message
          });
        });
      }

      // Actualizar TODOS los detalles de receta a estado 'cancelado'
      const cancelarDetallesSql = `
        UPDATE detalle_receta 
        SET estado = 'cancelado', cantidad_despachada = 0
        WHERE id_receta = ?
      `;

      db.query(cancelarDetallesSql, [id_receta], (cancelErr) => {
        if (cancelErr) {
          return db.rollback(() => {
            res.status(500).json({
              success: false,
              message: "Error al cancelar detalles de receta",
              error: cancelErr.message
            });
          });
        }

        // Actualizar estado de la receta
        Despacho.actualizarEstadoReceta(id_receta, 'cancelada', (recetaErr) => {
          if (recetaErr) {
            return db.rollback(() => {
              res.status(500).json({
                success: false,
                message: "Error al actualizar estado de receta",
                error: recetaErr.message
              });
            });
          }

          // Commit transaction
          db.commit((commitErr) => {
            if (commitErr) {
              return db.rollback(() => {
                res.status(500).json({
                  success: false,
                  message: "Error al confirmar transacción",
                  error: commitErr.message
                });
              });
            }

            res.status(201).json({
              success: true,
              message: "Despacho cancelado exitosamente",
              data: { id_despacho: idDespacho, tipo: 'cancelado' }
            });
          });
        });
      });
    });
  });
};

// Resto de funciones sin cambios...
exports.listarHistorialDespachos = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const estado = req.query.estado;
  const fechaInicio = req.query.fechaInicio;
  const fechaFin = req.query.fechaFin;

  const filtros = {
    estado,
    fechaInicio,
    fechaFin
  };

  Despacho.listarHistorialDespachos(page, limit, filtros, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al listar historial de despachos",
        error: err
      });
    }
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    });
  });
};

exports.obtenerDetalleDespacho = (req, res) => {
  const idDespacho = req.params.idDespacho;

  Despacho.obtenerDetalleDespacho(idDespacho, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener detalle de despacho",
        error: err
      });
    }

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Despacho no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  });
};

exports.obtenerEstadisticasDashboard = (req, res) => {
  Despacho.obtenerEstadisticasDashboard((err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener estadísticas del dashboard",
        error: err
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  });
};

exports.obtenerResumenDespachos = (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({
      success: false,
      message: "Las fechas de inicio y fin son obligatorias"
    });
  }

  Despacho.obtenerResumenDespachos(fechaInicio, fechaFin, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener resumen de despachos",
        error: err
      });
    }

    res.status(200).json({
      success: true,
      data: results
    });
  });
};

exports.obtenerMetricasRendimiento = (req, res) => {
  const { idUsuario, periodo } = req.query;
  const userId = idUsuario || req.session.user?.id_usuario;

  let fechaInicio;
  const fechaFin = new Date().toISOString().split('T')[0];

  switch (periodo) {
    case 'semana':
      fechaInicio = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    case 'mes':
      fechaInicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      break;
    case 'trimestre':
      fechaInicio = new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1).toISOString().split('T')[0];
      break;
    default:
      fechaInicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  }

  Despacho.obtenerMetricasRendimiento(fechaInicio, fechaFin, userId, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener métricas de rendimiento",
        error: err
      });
    }

    res.status(200).json({
      success: true,
      data: results,
      periodo: {
        inicio: fechaInicio,
        fin: fechaFin,
        tipo: periodo || 'mes'
      }
    });
  });
};