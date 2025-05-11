const db = require("../database/conexion");

const InventarioMovimientos = {};

// Obtener historial de movimientos por medicamento
InventarioMovimientos.obtenerMovimientosPorMedicamento = (idMedicamento, callback) => {
  const sql = `CALL sp_HistorialMovimientosInventarioMedicamento(?)`;
  
  db.query(sql, [idMedicamento], (err, results) => {
    if (err) {
      console.error("Error al obtener los movimientos de inventario del medicamento:", err);
      return callback(err, null);
    }
    return callback(null, results[0]); // El primer elemento contiene los resultados
  });
};

// Obtener historial de movimientos por lote
InventarioMovimientos.obtenerMovimientosPorLote = (idStock, callback) => {
  const sql = `CALL sp_HistorialMovimientosInventarioLote(?)`;
  
  db.query(sql, [idStock], (err, results) => {
    if (err) {
      console.error("Error al obtener los movimientos de inventario del lote:", err);
      return callback(err, null);
    }
    return callback(null, results[0]); // El primer elemento contiene los resultados
  });
};

module.exports = InventarioMovimientos;