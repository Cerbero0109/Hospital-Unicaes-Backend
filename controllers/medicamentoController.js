//MODULO DE FARMACIA
const Medicamento = require("../models/medicamentoModel");

// Listar medicamentos activos
exports.listarMedicamentos = (req, res) => {
  Medicamento.listarMedicamentos((err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al listar los medicamentos", 
        error: err 
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

// Obtener medicamento por ID
exports.obtenerMedicamentoPorId = (req, res) => {
  const id = req.params.id;

  Medicamento.listarMedicamentoPorId(id, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al obtener el medicamento", 
        error: err 
      });
    }
    
    if (!result) {
      return res.status(404).json({ 
        success: false,
        message: "Medicamento no encontrado" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
};

// Crear nuevo medicamento
exports.crearMedicamento = (req, res) => {
  // Validar datos de entrada
  const { 
    codigo, nombre, descripcion, id_categoria, id_presentacion, id_proveedor,
    concentracion, unidad_medida, via_administracion, stock_minimo,
    ubicacion_almacen, requiere_receta
  } = req.body;
  
  if (!codigo || !nombre) {
    return res.status(400).json({ 
      success: false,
      message: "El código y nombre del medicamento son obligatorios" 
    });
  }

  const medicamentoData = {
    codigo,
    nombre,
    descripcion: descripcion || null,
    id_categoria: id_categoria || null,
    id_presentacion: id_presentacion || null,
    id_proveedor: id_proveedor || null,
    concentracion: concentracion || null,
    unidad_medida: unidad_medida || null,
    via_administracion: via_administracion || null,
    stock_minimo: stock_minimo || 10,
    ubicacion_almacen: ubicacion_almacen || null,
    requiere_receta: requiere_receta || false
  };

  Medicamento.insertarMedicamento(medicamentoData, (err, result) => {
    if (err) {
      // Verificar si es un error de duplicado en el código
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: "Ya existe un medicamento con este código"
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: "Error al crear el medicamento", 
        error: err 
      });
    }
    
    res.status(201).json({
      success: true,
      message: "Medicamento creado exitosamente",
      data: { id: result.insertId, ...medicamentoData }
    });
  });
};

// Actualizar medicamento
exports.actualizarMedicamento = (req, res) => {
  const id = req.params.id;
  const { 
    codigo, nombre, descripcion, id_categoria, id_presentacion, id_proveedor,
    concentracion, unidad_medida, via_administracion, stock_minimo,
    ubicacion_almacen, requiere_receta
  } = req.body;
  
  if (!codigo || !nombre) {
    return res.status(400).json({ 
      success: false,
      message: "El código y nombre del medicamento son obligatorios" 
    });
  }

  const medicamentoData = {
    codigo,
    nombre,
    descripcion: descripcion || null,
    id_categoria: id_categoria || null,
    id_presentacion: id_presentacion || null,
    id_proveedor: id_proveedor || null,
    concentracion: concentracion || null,
    unidad_medida: unidad_medida || null,
    via_administracion: via_administracion || null,
    stock_minimo: stock_minimo || 10,
    ubicacion_almacen: ubicacion_almacen || null,
    requiere_receta: requiere_receta || false
  };

  Medicamento.actualizarMedicamento(id, medicamentoData, (err, result) => {
    if (err) {
      // Verificar si es un error de duplicado en el código
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: "Ya existe un medicamento con este código"
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: "Error al actualizar el medicamento", 
        error: err 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Medicamento no encontrado" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Medicamento actualizado exitosamente"
    });
  });
};

// Desactivar medicamento
exports.desactivarMedicamento = (req, res) => {
  const id = req.params.id;

  Medicamento.cambiarEstadoMedicamento(id, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al desactivar el medicamento", 
        error: err 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Medicamento no encontrado" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Medicamento desactivado exitosamente"
    });
  });
};

// Verificar medicamentos con stock bajo
exports.verificarStockBajo = (req, res) => {
  Medicamento.verificarStockBajo((err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al verificar los medicamentos con stock bajo", 
        error: err 
      });
    }
    
    res.status(200).json({
      success: true,
      data: results,
      alerta: results.length > 0 ? `Se encontraron ${results.length} medicamentos con stock bajo` : null
    });
  });
};