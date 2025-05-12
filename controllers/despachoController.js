//MODULO FARMACIA
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

// Realizar despacho (completo, parcial o cancelado)
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

  // Si es una cancelación, no necesitamos procesar detalles
  if (tipo_despacho === 'cancelado') {
    if (!razon_cancelacion || razon_cancelacion.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "La razón de cancelación es obligatoria"
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

    return Despacho.crearDespachoCancelado(despachoData, (err, idDespacho) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al cancelar el despacho",
          error: err.message
        });
      }

      // Actualizar estado de la receta
      Despacho.actualizarEstadoReceta(id_receta, 'cancelada', (recetaErr) => {
        if (recetaErr) {
          console.error("Error al actualizar estado de receta:", recetaErr);
        }

        res.status(201).json({
          success: true,
          message: "Despacho cancelado exitosamente",
          data: { id_despacho: idDespacho, tipo: 'cancelado' }
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
      const totalDetalles = detalles.reduce((sum, d) => sum + d.lotes.length, 0);

      if (totalDetalles === 0) {
        return db.rollback(() => {
          res.status(400).json({
            success: false,
            message: "No hay detalles para procesar"
          });
        });
      }

      detalles.forEach((detalle) => {
        const { id_detalle_receta, lotes } = detalle;
        let cantidadTotalDespachada = 0;

        lotes.forEach((lote) => {
          const detalleDespachoData = {
            id_despacho: idDespacho,
            id_detalle_receta,
            id_stock: lote.id_stock,
            cantidad_despachada: lote.cantidad
          };

          // Crear detalle de despacho
          Despacho.crearDetalleDespacho(detalleDespachoData, (detalleErr) => {
            if (detalleErr) {
              erroresDetalle.push(detalleErr);
              detallesProcesados++;

              if (detallesProcesados === totalDetalles) {
                // Si hay errores, hacer rollback
                return db.rollback(() => {
                  res.status(500).json({
                    success: false,
                    message: "Error al procesar detalles del despacho",
                    errors: erroresDetalle
                  });
                });
              }
              return;
            }

            // Actualizar stock
            Despacho.actualizarStockDespacho(lote.id_stock, lote.cantidad, (stockErr) => {
              if (stockErr) {
                erroresDetalle.push(stockErr);
                detallesProcesados++;

                if (detallesProcesados === totalDetalles) {
                  // Si hay errores, hacer rollback
                  return db.rollback(() => {
                    res.status(500).json({
                      success: false,
                      message: "Error al actualizar stock",
                      errors: erroresDetalle
                    });
                  });
                }
                return;
              }

              cantidadTotalDespachada += parseInt(lote.cantidad);
              detallesProcesados++;

              // Verificar si se procesaron todos los lotes de este detalle
              if (detallesProcesados === totalDetalles) {
                // Actualizar cantidad despachada en el detalle de receta
                Despacho.actualizarCantidadDespachadaDetalleReceta(id_detalle_receta, cantidadTotalDespachada, (cantidadErr) => {
                  if (cantidadErr) {
                    erroresDetalle.push(cantidadErr);
                  }

                  // Actualizar estado del detalle de receta según tipo de despacho
                  const estadoDetalle = tipo_despacho === 'completo' ? 'despachado' : 'despachado_parcial';
                  
                  Despacho.actualizarEstadoDetalleReceta(id_detalle_receta, estadoDetalle, (estadoErr) => {
                    if (estadoErr) {
                      erroresDetalle.push(estadoErr);
                    }

                    if (erroresDetalle.length > 0) {
                      return db.rollback(() => {
                        res.status(500).json({
                          success: false,
                          message: "Error al procesar detalles del despacho",
                          errors: erroresDetalle
                        });
                      });
                    }

                    // Actualizar estado de la receta
                    const estadoReceta = tipo_despacho === 'completo' ? 'despachada' : 'despachada_parcial';
                    
                    Despacho.actualizarEstadoReceta(id_receta, estadoReceta, (recetaErr) => {
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
                            tipo: tipo_despacho
                          }
                        });
                      });
                    });
                  });
                });
              }
            });
          });
        });
      });
    });
  });
};

// Cancelar despacho
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

  // Crear registro de despacho cancelado
  const despachoData = {
    id_receta,
    id_usuario,
    estado: 'cancelado',
    observaciones,
    razon_cancelacion
  };

  Despacho.crearDespachoCancelado(despachoData, (err, idDespacho) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al cancelar el despacho",
        error: err.message
      });
    }

    // Actualizar estado de la receta
    Despacho.actualizarEstadoReceta(id_receta, 'cancelada', (recetaErr) => {
      if (recetaErr) {
        console.error("Error al actualizar estado de receta:", recetaErr);
      }

      res.status(201).json({
        success: true,
        message: "Despacho cancelado exitosamente",
        data: { id_despacho: idDespacho, tipo: 'cancelado' }
      });
    });
  });
};

// Listar historial de despachos con paginación y filtros
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

// Obtener detalle de un despacho
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