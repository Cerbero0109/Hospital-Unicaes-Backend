//MODULO DE FARMACIA
const CategoriaMedicamento = require("../models/categoriaMedicamentoModel");

// Listar categorías activas
exports.listarCategorias = (req, res) => {
  CategoriaMedicamento.listarCategorias((err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al listar las categorías de medicamentos", 
        error: err 
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

// Obtener categoría por ID
exports.obtenerCategoriaPorId = (req, res) => {
  const id = req.params.id;

  CategoriaMedicamento.listarCategoriaPorId(id, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al obtener la categoría de medicamento", 
        error: err 
      });
    }
    
    if (!result) {
      return res.status(404).json({ 
        success: false,
        message: "Categoría de medicamento no encontrada" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
};

// Crear nueva categoría
exports.crearCategoria = (req, res) => {
  // Validar datos de entrada
  const { nombre_categoria, descripcion } = req.body;
  
  if (!nombre_categoria) {
    return res.status(400).json({ 
      success: false,
      message: "El nombre de la categoría es obligatorio" 
    });
  }

  const categoriaData = {
    nombre_categoria,
    descripcion: descripcion || null
  };

  CategoriaMedicamento.insertarCategoria(categoriaData, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al crear la categoría de medicamento", 
        error: err 
      });
    }
    
    res.status(201).json({
      success: true,
      message: "Categoría de medicamento creada exitosamente",
      data: { id: result.insertId, ...categoriaData }
    });
  });
};

// Actualizar categoría
exports.actualizarCategoria = (req, res) => {
  const id = req.params.id;
  const { nombre_categoria, descripcion } = req.body;
  
  if (!nombre_categoria) {
    return res.status(400).json({ 
      success: false,
      message: "El nombre de la categoría es obligatorio" 
    });
  }

  const categoriaData = {
    nombre_categoria,
    descripcion: descripcion || null
  };

  CategoriaMedicamento.actualizarCategoria(id, categoriaData, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al actualizar la categoría de medicamento", 
        error: err 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Categoría de medicamento no encontrada" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Categoría de medicamento actualizada exitosamente"
    });
  });
};

// Desactivar categoría
exports.desactivarCategoria = (req, res) => {
  const id = req.params.id;

  CategoriaMedicamento.cambiarEstadoCategoria(id, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al desactivar la categoría de medicamento", 
        error: err 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Categoría de medicamento no encontrada" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Categoría de medicamento desactivada exitosamente"
    });
  });
};