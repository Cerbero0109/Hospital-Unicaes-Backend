//MODULO DE FARMACIA
const Proveedor = require("../models/proveedorModel");

// Listar proveedores activos
exports.listarProveedores = (req, res) => {
  Proveedor.listarProveedores((err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al listar los proveedores", 
        error: err 
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

// Obtener proveedor por ID
exports.obtenerProveedorPorId = (req, res) => {
  const id = req.params.id;

  Proveedor.listarProveedorPorId(id, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al obtener el proveedor", 
        error: err 
      });
    }
    
    if (!result) {
      return res.status(404).json({ 
        success: false,
        message: "Proveedor no encontrado" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
};

// Crear nuevo proveedor
exports.crearProveedor = (req, res) => {
  // Validar datos de entrada
  const { nombre, persona_contacto, telefono, correo, direccion, ruc } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ 
      success: false,
      message: "El nombre del proveedor es obligatorio" 
    });
  }

  const proveedorData = {
    nombre,
    persona_contacto: persona_contacto || null,
    telefono: telefono || null,
    correo: correo || null,
    direccion: direccion || null,
    ruc: ruc || null
  };

  Proveedor.insertarProveedor(proveedorData, (err, result) => {
    if (err) {
      // Verificar si es un error de duplicado en el RUC
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: "Ya existe un proveedor con este RUC"
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: "Error al crear el proveedor", 
        error: err 
      });
    }
    
    res.status(201).json({
      success: true,
      message: "Proveedor creado exitosamente",
      data: { id: result.insertId, ...proveedorData }
    });
  });
};

// Actualizar proveedor
exports.actualizarProveedor = (req, res) => {
  const id = req.params.id;
  const { nombre, persona_contacto, telefono, correo, direccion, ruc } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ 
      success: false,
      message: "El nombre del proveedor es obligatorio" 
    });
  }

  const proveedorData = {
    nombre,
    persona_contacto: persona_contacto || null,
    telefono: telefono || null,
    correo: correo || null,
    direccion: direccion || null,
    ruc: ruc || null
  };

  Proveedor.actualizarProveedor(id, proveedorData, (err, result) => {
    if (err) {
      // Verificar si es un error de duplicado en el RUC
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: "Ya existe un proveedor con este RUC"
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: "Error al actualizar el proveedor", 
        error: err 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Proveedor no encontrado" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Proveedor actualizado exitosamente"
    });
  });
};

// Desactivar proveedor
exports.desactivarProveedor = (req, res) => {
  const id = req.params.id;

  Proveedor.cambiarEstadoProveedor(id, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al desactivar el proveedor", 
        error: err 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Proveedor no encontrado" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Proveedor desactivado exitosamente"
    });
  });
};