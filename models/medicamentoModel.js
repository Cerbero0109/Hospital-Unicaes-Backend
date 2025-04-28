//MODULO FARMACIA
const db = require("../database/conexion");

const Medicamento = {};

// Listar medicamentos activos
Medicamento.listarMedicamentos = (callback) => {
  const sql = `
    SELECT m.*, 
           c.nombre_categoria, 
           p.nombre_presentacion,
           pr.nombre as nombre_proveedor
    FROM medicamento m
    LEFT JOIN categoria_medicamento c ON m.id_categoria = c.id_categoria
    LEFT JOIN presentacion_medicamento p ON m.id_presentacion = p.id_presentacion
    LEFT JOIN proveedor pr ON m.id_proveedor = pr.id_proveedor
    WHERE m.estado = 'activo'
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al listar los medicamentos:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Listar medicamento por ID
Medicamento.listarMedicamentoPorId = (id, callback) => {
  const sql = `
    SELECT m.*, 
           c.nombre_categoria, 
           p.nombre_presentacion,
           pr.nombre as nombre_proveedor
    FROM medicamento m
    LEFT JOIN categoria_medicamento c ON m.id_categoria = c.id_categoria
    LEFT JOIN presentacion_medicamento p ON m.id_presentacion = p.id_presentacion
    LEFT JOIN proveedor pr ON m.id_proveedor = pr.id_proveedor
    WHERE m.id_medicamento = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener el medicamento por ID:", err);
      return callback(err, null);
    }
    return callback(null, result[0]);
  });
};

// Insertar nuevo medicamento
Medicamento.insertarMedicamento = (medicamentoData, callback) => {
  const sql = `
    INSERT INTO medicamento (
      codigo, nombre, descripcion, id_categoria, id_presentacion, id_proveedor, 
      concentracion, unidad_medida, via_administracion, stock_minimo, 
      ubicacion_almacen, requiere_receta
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const { 
    codigo, nombre, descripcion, id_categoria, id_presentacion, id_proveedor,
    concentracion, unidad_medida, via_administracion, stock_minimo,
    ubicacion_almacen, requiere_receta
  } = medicamentoData;

  db.query(sql, [
    codigo, nombre, descripcion, id_categoria, id_presentacion, id_proveedor,
    concentracion, unidad_medida, via_administracion, stock_minimo,
    ubicacion_almacen, requiere_receta
  ], (err, result) => {
    if (err) {
      console.error("Error al insertar el medicamento:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Actualizar medicamento
Medicamento.actualizarMedicamento = (id, medicamentoData, callback) => {
  const sql = `
    UPDATE medicamento 
    SET codigo = ?, nombre = ?, descripcion = ?, id_categoria = ?, 
        id_presentacion = ?, id_proveedor = ?, concentracion = ?, 
        unidad_medida = ?, via_administracion = ?, stock_minimo = ?, 
        ubicacion_almacen = ?, requiere_receta = ?
    WHERE id_medicamento = ?
  `;
  
  const { 
    codigo, nombre, descripcion, id_categoria, id_presentacion, id_proveedor,
    concentracion, unidad_medida, via_administracion, stock_minimo,
    ubicacion_almacen, requiere_receta
  } = medicamentoData;

  db.query(sql, [
    codigo, nombre, descripcion, id_categoria, id_presentacion, id_proveedor,
    concentracion, unidad_medida, via_administracion, stock_minimo,
    ubicacion_almacen, requiere_receta, id
  ], (err, result) => {
    if (err) {
      console.error("Error al actualizar el medicamento:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Cambiar estado de medicamento (desactivar)
Medicamento.cambiarEstadoMedicamento = (id, callback) => {
  const sql = `UPDATE medicamento SET estado = 'inactivo' WHERE id_medicamento = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al cambiar el estado del medicamento:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Verificar medicamentos con stock bajo
Medicamento.verificarStockBajo = (callback) => {
  const sql = `
    SELECT m.id_medicamento, m.codigo, m.nombre, m.stock_minimo,
           SUM(s.cantidad_disponible) as stock_actual
    FROM medicamento m
    LEFT JOIN stock s ON m.id_medicamento = s.id_medicamento
    WHERE m.estado = 'activo' AND (s.estado = 'activo' OR s.estado IS NULL)
    GROUP BY m.id_medicamento
    HAVING stock_actual < m.stock_minimo OR stock_actual IS NULL
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al verificar medicamentos con stock bajo:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

module.exports = Medicamento;