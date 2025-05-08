const db = require("../database/conexion");

// Definición del objeto MovimientoInventario
const MovimientoInventario = {};

MovimientoInventario.obtenerMovimientosPorMedicamento = (idMedicamento, callback) => {
  // Primero obtenemos todos los lotes de este medicamento
  const sqlLotes = `
    SELECT id_stock 
    FROM stock 
    WHERE id_medicamento = ?
  `;

  db.query(sqlLotes, [idMedicamento], (errLotes, lotes) => {
    if (errLotes) {
      console.error("Error al obtener lotes del medicamento:", errLotes);
      return callback(errLotes, null);
    }

    // Si no hay lotes, devolvemos un array vacío
    if (lotes.length === 0) {
      return callback(null, []);
    }

    // Extraemos los IDs de los lotes
    const loteIds = lotes.map(lote => lote.id_stock);
    
    // Verificar los lotes que encontramos (para depuración)
    console.log(`Lotes encontrados para medicamento ${idMedicamento}:`, loteIds);

    // Construir placeholders para la cláusula IN
    const placeholders = loteIds.map(() => '?').join(',');

    // Consulta para entradas - Aseguramos que solo recupera datos para el medicamento indicado
    const sqlEntradas = `
    SELECT 
      'entrada' AS tipo_movimiento,
      im.id_stock,
      im.fecha_ingreso AS fecha,
      s.numero_lote,
      s.cantidad_disponible AS cantidad,
      CONCAT(u.nombre, ' ', u.apellido) AS usuario,
      CASE
        WHEN im.tipo_ingreso = 'compra' THEN 'Compra'
        WHEN im.tipo_ingreso = 'donacion' THEN 'Donación'
        ELSE 'Ingreso de Stock'
      END AS origen_destino,
      NULL AS id_receta
    FROM ingreso_medicamento im
    JOIN stock s ON im.id_stock = s.id_stock
    LEFT JOIN usuario u ON im.id_usuario = u.id_usuario
    WHERE s.id_medicamento = ? AND im.id_stock IN (${placeholders})
    ORDER BY im.fecha_ingreso DESC
  `;

    // Consulta para salidas - Aseguramos que solo recupera datos para el medicamento indicado
    const sqlSalidas = `
      SELECT 
        'salida' AS tipo_movimiento,
        dd.id_stock,
        d.fecha_despacho AS fecha,
        s.numero_lote,
        dd.cantidad_despachada AS cantidad,
        CONCAT(u.nombre, ' ', u.apellido) AS usuario,
        CONCAT('Receta #', d.id_receta) AS origen_destino,
        d.id_receta
      FROM detalle_despacho dd
      JOIN despacho d ON dd.id_despacho = d.id_despacho
      JOIN stock s ON dd.id_stock = s.id_stock
      JOIN usuario u ON d.id_usuario = u.id_usuario
      WHERE s.id_medicamento = ? AND dd.id_stock IN (${placeholders})
      ORDER BY d.fecha_despacho DESC
    `;

    // Agregamos idMedicamento como primer parámetro para ambas consultas
    const paramsEntradas = [idMedicamento, ...loteIds];
    const paramsSalidas = [idMedicamento, ...loteIds];

    // Ejecutar consulta de entradas
    db.query(sqlEntradas, paramsEntradas, (errEntradas, entradas) => {
      if (errEntradas) {
        console.error("Error al obtener entradas:", errEntradas);
        return callback(errEntradas, null);
      }
      
      console.log(`Entradas encontradas: ${entradas.length}`);
      
      // Ejecutar consulta de salidas
      db.query(sqlSalidas, paramsSalidas, (errSalidas, salidas) => {
        if (errSalidas) {
          console.error("Error al obtener salidas:", errSalidas);
          return callback(errSalidas, null);
        }
        
        console.log(`Salidas encontradas: ${salidas.length}`);
        
        // Combinar resultados y ordenar por fecha
        const movimientos = [...entradas, ...salidas].sort((a, b) => {
          return new Date(b.fecha) - new Date(a.fecha);
        });
        
        return callback(null, movimientos);
      });
    });
  });
};


// Obtener movimientos por lote
MovimientoInventario.obtenerMovimientosPorLote = (idStock, callback) => {
  const sql = `
    SELECT 
      'entrada' AS tipo_movimiento,
      s.fecha_ingreso AS fecha,
      s.numero_lote,
      s.cantidad_disponible AS cantidad,
      CONCAT(u.nombre, ' ', u.apellido) AS usuario,
      'Ingreso de Stock' AS origen_destino,
      NULL AS id_receta
    FROM stock s
    LEFT JOIN ingreso_medicamento im ON s.id_stock = im.id_stock
    LEFT JOIN usuario u ON im.id_usuario = u.id_usuario
    WHERE s.id_stock = ?
    
    UNION ALL
    
    SELECT 
      'salida' AS tipo_movimiento,
      d.fecha_despacho AS fecha,
      s.numero_lote,
      dd.cantidad_despachada AS cantidad,
      CONCAT(u.nombre, ' ', u.apellido) AS usuario,
      CONCAT('Receta #', r.id_receta) AS origen_destino,
      r.id_receta
    FROM detalle_despacho dd
    JOIN despacho d ON dd.id_despacho = d.id_despacho
    JOIN stock s ON dd.id_stock = s.id_stock
    JOIN receta_medica r ON d.id_receta = r.id_receta
    JOIN usuario u ON d.id_usuario = u.id_usuario
    WHERE dd.id_stock = ?
    
    ORDER BY fecha DESC
  `;

  db.query(sql, [idStock, idStock], (err, results) => {
    if (err) {
      console.error("Error al obtener movimientos por lote:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};
module.exports = MovimientoInventario;