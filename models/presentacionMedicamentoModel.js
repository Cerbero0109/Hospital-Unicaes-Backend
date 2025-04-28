//MODULO DE FARMACIA
const db = require("../database/conexion");

const PresentacionMedicamento = {};

// Listar presentaciones activas
PresentacionMedicamento.listarPresentaciones = (callback) => {
  const sql = `SELECT * FROM presentacion_medicamento WHERE estado = 'activo'`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al listar las presentaciones:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Listar presentación por ID
PresentacionMedicamento.listarPresentacionPorId = (id, callback) => {
  const sql = `SELECT * FROM presentacion_medicamento WHERE id_presentacion = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener la presentación por ID:", err);
      return callback(err, null);
    }
    return callback(null, result[0]);
  });
};

// Insertar nueva presentación
PresentacionMedicamento.insertarPresentacion = (presentacionData, callback) => {
  const sql = `INSERT INTO presentacion_medicamento (nombre_presentacion, descripcion) VALUES (?, ?)`;
  
  const { nombre_presentacion, descripcion } = presentacionData;

  db.query(sql, [nombre_presentacion, descripcion], (err, result) => {
    if (err) {
      console.error("Error al insertar la presentación:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Actualizar presentación
PresentacionMedicamento.actualizarPresentacion = (id, presentacionData, callback) => {
  const sql = `UPDATE presentacion_medicamento SET nombre_presentacion = ?, descripcion = ? WHERE id_presentacion = ?`;
  
  const { nombre_presentacion, descripcion } = presentacionData;

  db.query(sql, [nombre_presentacion, descripcion, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar la presentación:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Cambiar estado de presentación (desactivar)
PresentacionMedicamento.cambiarEstadoPresentacion = (id, callback) => {
  const sql = `UPDATE presentacion_medicamento SET estado = 'inactivo' WHERE id_presentacion = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al cambiar el estado de la presentación:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

module.exports = PresentacionMedicamento;