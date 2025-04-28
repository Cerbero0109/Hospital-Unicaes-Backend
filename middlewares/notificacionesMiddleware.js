//MODULO FARMACIA
const Medicamento = require("../models/medicamentoModel");
const Stock = require("../models/stockModel");

// Almacenamiento temporal para las notificaciones
const notificaciones = {
  stockBajo: [],
  stockVencimiento: []
};

// Middleware para verificar notificaciones
const verificarNotificaciones = async (req, res, next) => {
  try {
    // Verificar medicamentos con stock bajo
    Medicamento.verificarStockBajo((err, medicamentosStockBajo) => {
      if (!err && medicamentosStockBajo) {
        // Actualizar lista de medicamentos con stock bajo
        notificaciones.stockBajo = medicamentosStockBajo.map(med => ({
          id: med.id_medicamento,
          codigo: med.codigo,
          nombre: med.nombre,
          stockMinimo: med.stock_minimo,
          stockActual: med.stock_actual || 0,
          fecha: new Date()
        }));
      }
    });

    // Verificar stock próximo a vencer (30 días por defecto)
    Stock.verificarStockProximoVencer(30, (err, stockProximoVencer) => {
      if (!err && stockProximoVencer) {
        // Actualizar lista de stock próximo a vencer
        notificaciones.stockVencimiento = stockProximoVencer.map(stock => ({
          id: stock.id_stock,
          medicamento: stock.nombre,
          lote: stock.numero_lote,
          fechaCaducidad: stock.fecha_caducidad,
          diasRestantes: Math.ceil((new Date(stock.fecha_caducidad) - new Date()) / (1000 * 60 * 60 * 24)),
          cantidad: stock.cantidad_disponible,
          fecha: new Date()
        }));
      }
    });

    // Continuar con la solicitud
    next();
  } catch (error) {
    console.error("Error en el middleware de notificaciones:", error);
    next(); // Continuar incluso si hay un error
  }
};

// Endpoint para obtener notificaciones
const obtenerNotificaciones = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      stockBajo: notificaciones.stockBajo,
      stockVencimiento: notificaciones.stockVencimiento,
      totalNotificaciones: notificaciones.stockBajo.length + notificaciones.stockVencimiento.length
    }
  });
};

module.exports = {
  verificarNotificaciones,
  obtenerNotificaciones
};