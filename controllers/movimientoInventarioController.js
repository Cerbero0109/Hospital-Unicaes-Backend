const MovimientoInventario = require("../models/movimientoInventarioModel");

// Obtener movimientos por medicamento
exports.obtenerMovimientosPorMedicamento = (req, res) => {
  const idMedicamento = req.params.idMedicamento;
  
  // Validar que el ID es un número
  if (!idMedicamento || isNaN(parseInt(idMedicamento))) {
    return res.status(400).json({
      success: false,
      message: "ID de medicamento inválido"
    });
  }

  MovimientoInventario.obtenerMovimientosPorMedicamento(parseInt(idMedicamento), (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener los movimientos de inventario",
        error: err
      });
    }
    
    // Verificación final: asegurar que todos los movimientos son del medicamento solicitado
    const movimientosValidados = results.filter(m => 
      m.id_medicamento == idMedicamento || // Si tiene id_medicamento, verificar que coincida
      !m.id_medicamento // O si no lo tiene (como en algunas salidas), confiar en la consulta SQL
    );
    
    if (movimientosValidados.length !== results.length) {
      console.warn(`Se filtraron ${results.length - movimientosValidados.length} movimientos que no correspondían al medicamento ${idMedicamento}`);
    }
    
    res.status(200).json({
      success: true,
      data: movimientosValidados
    });
  });
};
// Obtener movimientos por lote
exports.obtenerMovimientosPorLote = (req, res) => {
  const idStock = req.params.idStock;

  MovimientoInventario.obtenerMovimientosPorLote(idStock, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener los movimientos de inventario",
        error: err
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};