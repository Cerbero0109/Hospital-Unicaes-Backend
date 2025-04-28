//MODULO DE FARMACIA
const PresentacionMedicamento = require("../models/presentacionMedicamentoModel");

// Listar presentaciones activas
exports.listarPresentaciones = (req, res) => {
  PresentacionMedicamento.listarPresentaciones((err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al listar las presentaciones de medicamentos", 
        error: err 
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

// Obtener presentación por ID
exports.obtenerPresentacionPorId = (req, res) => {
  const id = req.params.id;

  PresentacionMedicamento.listarPresentacionPorId(id, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al obtener la presentación de medicamento", 
        error: err 
      });
    }
    
    if (!result) {
      return res.status(404).json({ 
        success: false,
        message: "Presentación de medicamento no encontrada" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
};

// Crear nueva presentación
exports.crearPresentacion = (req, res) => {
  // Validar datos de entrada
  const { nombre_presentacion, descripcion } = req.body;
  
  if (!nombre_presentacion) {
    return res.status(400).json({ 
      success: false,
      message: "El nombre de la presentación es obligatorio" 
    });
  }

  const presentacionData = {
    nombre_presentacion,
    descripcion: descripcion || null
  };

  PresentacionMedicamento.insertarPresentacion(presentacionData, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al crear la presentación de medicamento", 
        error: err 
      });
    }
    
    res.status(201).json({
      success: true,
      message: "Presentación de medicamento creada exitosamente",
      data: { id: result.insertId, ...presentacionData }
    });
  });
};

// Actualizar presentación
exports.actualizarPresentacion = (req, res) => {
  const id = req.params.id;
  const { nombre_presentacion, descripcion } = req.body;
  
  if (!nombre_presentacion) {
    return res.status(400).json({ 
      success: false,
      message: "El nombre de la presentación es obligatorio" 
    });
  }

  const presentacionData = {
    nombre_presentacion,
    descripcion: descripcion || null
  };

  PresentacionMedicamento.actualizarPresentacion(id, presentacionData, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al actualizar la presentación de medicamento", 
        error: err 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Presentación de medicamento no encontrada" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Presentación de medicamento actualizada exitosamente"
    });
  });
};

// Desactivar presentación
exports.desactivarPresentacion = (req, res) => {
  const id = req.params.id;

  PresentacionMedicamento.cambiarEstadoPresentacion(id, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al desactivar la presentación de medicamento", 
        error: err 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Presentación de medicamento no encontrada" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Presentación de medicamento desactivada exitosamente"
    });
  });
};