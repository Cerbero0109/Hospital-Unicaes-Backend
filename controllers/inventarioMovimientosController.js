const InventarioMovimientos = require("../models/inventarioMovimientosModel");

// Obtener historial de movimientos por medicamento
exports.obtenerMovimientosPorMedicamento = (req, res) => {
  const idMedicamento = req.params.idMedicamento;

  InventarioMovimientos.obtenerMovimientosPorMedicamento(idMedicamento, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener los movimientos de inventario del medicamento",
        error: err
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

// Obtener historial de movimientos por lote
exports.obtenerMovimientosPorLote = (req, res) => {
  const idStock = req.params.idStock;

  InventarioMovimientos.obtenerMovimientosPorLote(idStock, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener los movimientos de inventario del lote",
        error: err
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};