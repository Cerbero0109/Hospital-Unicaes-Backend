//MODULO DE FARMACIA
const db = require("../database/conexion");

const CategoriaMedicamento = {};

// Listar categorías activas
CategoriaMedicamento.listarCategorias = (callback) => {
  const sql = `SELECT * FROM categoria_medicamento WHERE estado = 'activo'`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al listar las categorías:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Listar categoría por ID
CategoriaMedicamento.listarCategoriaPorId = (id, callback) => {
  const sql = `SELECT * FROM categoria_medicamento WHERE id_categoria = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener la categoría por ID:", err);
      return callback(err, null);
    }
    return callback(null, result[0]);
  });
};

// Insertar nueva categoría
CategoriaMedicamento.insertarCategoria = (categoriaData, callback) => {
  const sql = `INSERT INTO categoria_medicamento (nombre_categoria, descripcion) VALUES (?, ?)`;
  
  const { nombre_categoria, descripcion } = categoriaData;

  db.query(sql, [nombre_categoria, descripcion], (err, result) => {
    if (err) {
      console.error("Error al insertar la categoría:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Actualizar categoría
CategoriaMedicamento.actualizarCategoria = (id, categoriaData, callback) => {
  const sql = `UPDATE categoria_medicamento SET nombre_categoria = ?, descripcion = ? WHERE id_categoria = ?`;
  
  const { nombre_categoria, descripcion } = categoriaData;

  db.query(sql, [nombre_categoria, descripcion, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar la categoría:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Cambiar estado de categoría (desactivar)
CategoriaMedicamento.cambiarEstadoCategoria = (id, callback) => {
  const sql = `UPDATE categoria_medicamento SET estado = 'inactivo' WHERE id_categoria = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al cambiar el estado de la categoría:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

module.exports = CategoriaMedicamento;