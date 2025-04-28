//MODULO FARMACIA
const db = require("../database/conexion");

const Proveedor = {};

// Listar proveedores activos
Proveedor.listarProveedores = (callback) => {
  const sql = `SELECT * FROM proveedor WHERE estado = 'activo'`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al listar los proveedores:", err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Listar proveedor por ID
Proveedor.listarProveedorPorId = (id, callback) => {
  const sql = `SELECT * FROM proveedor WHERE id_proveedor = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener el proveedor por ID:", err);
      return callback(err, null);
    }
    return callback(null, result[0]);
  });
};

// Insertar nuevo proveedor
Proveedor.insertarProveedor = (proveedorData, callback) => {
  const sql = `INSERT INTO proveedor (nombre, persona_contacto, telefono, correo, direccion, ruc) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  
  const { nombre, persona_contacto, telefono, correo, direccion, ruc } = proveedorData;

  db.query(sql, [nombre, persona_contacto, telefono, correo, direccion, ruc], (err, result) => {
    if (err) {
      console.error("Error al insertar el proveedor:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Actualizar proveedor
Proveedor.actualizarProveedor = (id, proveedorData, callback) => {
  const sql = `UPDATE proveedor 
               SET nombre = ?, persona_contacto = ?, telefono = ?, correo = ?, direccion = ?, ruc = ? 
               WHERE id_proveedor = ?`;
  
  const { nombre, persona_contacto, telefono, correo, direccion, ruc } = proveedorData;

  db.query(sql, [nombre, persona_contacto, telefono, correo, direccion, ruc, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar el proveedor:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Cambiar estado de proveedor (desactivar)
Proveedor.cambiarEstadoProveedor = (id, callback) => {
  const sql = `UPDATE proveedor SET estado = 'inactivo' WHERE id_proveedor = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al cambiar el estado del proveedor:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

module.exports = Proveedor;