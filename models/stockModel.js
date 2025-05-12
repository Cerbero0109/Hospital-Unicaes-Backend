//MODULO FARMACIA
const db = require("../database/conexion");

const Stock = {};

// Listar todos los registros de stock activos
Stock.listarStock = (callback) => {
  const sql = `
    SELECT s.*, m.codigo, m.nombre, m.concentracion
    FROM stock s
    JOIN medicamento m ON s.id_medicamento = m.id_medicamento
    WHERE s.estado = 'activo'
    ORDER BY s.fecha_caducidad ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al listar el stock:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Listar stock por ID
Stock.listarStockPorId = (id, callback) => {
  const sql = `
    SELECT s.*, m.codigo, m.nombre, m.concentracion
    FROM stock s
    JOIN medicamento m ON s.id_medicamento = m.id_medicamento
    WHERE s.id_stock = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener el stock por ID:", err);
      return callback(err, null);
    }
    return callback(null, result[0]);
  });
};

// Listar stock por ID de medicamento
Stock.listarStockPorMedicamento = (idMedicamento, callback) => {
  const sql = `
    SELECT s.*, m.codigo, m.nombre, m.concentracion
    FROM stock s
    JOIN medicamento m ON s.id_medicamento = m.id_medicamento
    WHERE s.id_medicamento = ? AND s.estado = 'activo'
    ORDER BY s.fecha_caducidad ASC
  `;

  db.query(sql, [idMedicamento], (err, results) => {
    if (err) {
      console.error("Error al obtener el stock por ID de medicamento:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

Stock.insertarStock = (stockData, callback) => {
  const sql = `
    INSERT INTO stock (
      id_medicamento, numero_lote, fecha_fabricacion, fecha_caducidad, 
      cantidad_disponible, cantidad_inicial
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  const {
    id_medicamento, numero_lote, fecha_fabricacion, fecha_caducidad, cantidad_disponible
  } = stockData;

  // Agregar log para depuración
  console.log("stockData completo:", stockData);
  console.log("ID de usuario antes de insertar:", stockData.id_usuario);

  db.query(sql, [
    id_medicamento, numero_lote, fecha_fabricacion, fecha_caducidad,
    cantidad_disponible, cantidad_disponible // cantidad_inicial = cantidad_disponible
  ], (err, result) => {
    if (err) {
      console.error("Error al insertar el stock:", err);
      return callback(err, null);
    }

    // Si se insertó correctamente, verificar si es necesario registrar en ingreso_medicamento
    if (stockData.registrar_ingreso && result.insertId) {
      const ingresoData = {
        id_stock: result.insertId,
        id_usuario: stockData.id_usuario, // Asegúrate de que este valor no sea null
        tipo_ingreso: stockData.tipo_ingreso || 'compra',
        precio_unitario: stockData.precio_unitario || 0,
        costo_unitario: stockData.costo_unitario || 0,
        observaciones: stockData.observaciones || null
      };

      // Agregar log para depuración
      console.log("ingresoData antes de registrar:", ingresoData);

      Stock.registrarIngresoMedicamento(ingresoData, (errorIngreso) => {
        if (errorIngreso) {
          console.error("Error al registrar el ingreso del medicamento:", errorIngreso);
        }
        return callback(null, result);
      });
    } else {
      return callback(null, result);
    }
  });
};
// Actualizar stock
Stock.actualizarStock = (id, stockData, callback) => {
  const sql = `
    UPDATE stock 
    SET id_medicamento = ?, numero_lote = ?, fecha_fabricacion = ?, 
        fecha_caducidad = ?, cantidad_disponible = ?
    WHERE id_stock = ?
  `;

  const {
    id_medicamento, numero_lote, fecha_fabricacion, fecha_caducidad, cantidad_disponible
  } = stockData;

  db.query(sql, [
    id_medicamento, numero_lote, fecha_fabricacion, fecha_caducidad, cantidad_disponible, id
  ], (err, result) => {
    if (err) {
      console.error("Error al actualizar el stock:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Cambiar estado de stock (agotado o vencido)
Stock.cambiarEstadoStock = (id, nuevoEstado, callback) => {
  // Validar que el nuevo estado sea válido
  const estadosValidos = ['activo', 'agotado', 'vencido'];
  if (!estadosValidos.includes(nuevoEstado)) {
    return callback(new Error("Estado no válido"), null);
  }

  const sql = `UPDATE stock SET estado = ? WHERE id_stock = ?`;

  db.query(sql, [nuevoEstado, id], (err, result) => {
    if (err) {
      console.error("Error al cambiar el estado del stock:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Verificar stock próximo a vencer - Actualizado para mostrar cantidad inicial y disponible
Stock.verificarStockProximoVencer = (diasLimite, callback) => {
  const sql = `
    SELECT 
      s.id_stock,
      s.id_medicamento,
      s.numero_lote,
      s.fecha_fabricacion,
      s.fecha_caducidad,
      s.cantidad_disponible,
      m.codigo,
      m.nombre,
      m.concentracion,
      c.nombre_categoria,
      p.nombre_presentacion,
      (SELECT SUM(cantidad_disponible) 
       FROM stock 
       WHERE id_medicamento = s.id_medicamento AND estado = 'activo') as cantidad_inicial
    FROM stock s
    JOIN medicamento m ON s.id_medicamento = m.id_medicamento
    LEFT JOIN categoria_medicamento c ON m.id_categoria = c.id_categoria
    LEFT JOIN presentacion_medicamento p ON m.id_presentacion = p.id_presentacion
    WHERE s.estado = 'activo' 
    AND DATEDIFF(s.fecha_caducidad, CURDATE()) <= ?
    ORDER BY s.fecha_caducidad ASC
  `;

  db.query(sql, [diasLimite], (err, results) => {
    if (err) {
      console.error("Error al verificar stock próximo a vencer:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Listar lotes agotados
Stock.listarLotesAgotados = (callback) => {
  const sql = `
    SELECT s.*, m.codigo, m.nombre, m.concentracion,
           (s.cantidad_inicial - s.cantidad_disponible) as cantidad_consumida
    FROM stock s
    JOIN medicamento m ON s.id_medicamento = m.id_medicamento
    WHERE s.estado = 'agotado'
    ORDER BY s.fecha_ingreso DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al listar lotes agotados:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

//TABLA `ingreso_medicamento`

// Registrar ingreso de medicamento
Stock.registrarIngresoMedicamento = (ingresoData, callback) => {
  const sql = `
    INSERT INTO ingreso_medicamento (
      id_stock, id_usuario, tipo_ingreso, precio_unitario, costo_unitario, observaciones
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  const {
    id_stock, id_usuario, tipo_ingreso, precio_unitario, costo_unitario, observaciones
  } = ingresoData;

  // Agregar log para depuración
  console.log("Datos para ingreso medicamento:", { 
    id_stock, id_usuario, tipo_ingreso, precio_unitario, costo_unitario, observaciones 
  });

  db.query(sql, [
    id_stock, id_usuario, tipo_ingreso, precio_unitario, costo_unitario, observaciones
  ], (err, result) => {
    if (err) {
      console.error("Error al registrar el ingreso de medicamento:", err);
      return callback(err);
    }
    console.log("Ingreso de medicamento registrado correctamente:", result);
    return callback(null);
  });
};;


// Listar ingresos de medicamentos
Stock.listarIngresosMedicamentos = (callback) => {
  const sql = `
    SELECT i.*, s.numero_lote, s.cantidad_disponible, 
           m.codigo, m.nombre, m.concentracion
    FROM ingreso_medicamento i
    JOIN stock s ON i.id_stock = s.id_stock
    JOIN medicamento m ON s.id_medicamento = m.id_medicamento
    ORDER BY i.fecha_ingreso DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al listar los ingresos de medicamentos:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

module.exports = Stock;