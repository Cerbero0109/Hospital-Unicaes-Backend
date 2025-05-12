//MODULO DE FARMACIA
const Stock = require("../models/stockModel");
const Medicamento = require("../models/medicamentoModel");

// Listar stock activo
exports.listarStock = (req, res) => {
  Stock.listarStock((err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al listar el stock", 
        error: err 
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

// Obtener stock por ID
exports.obtenerStockPorId = (req, res) => {
  const id = req.params.id;

  Stock.listarStockPorId(id, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al obtener el stock", 
        error: err 
      });
    }
    
    if (!result) {
      return res.status(404).json({ 
        success: false,
        message: "Stock no encontrado" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
};

// Obtener stock por ID de medicamento
exports.obtenerStockPorMedicamento = (req, res) => {
  const id = req.params.idMedicamento;

  Stock.listarStockPorMedicamento(id, (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al obtener el stock del medicamento", 
        error: err 
      });
    }
    
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

// Crear nuevo registro de stock
exports.crearStock = (req, res) => {
  // Primero verifica que el usuario esté autenticado
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado o sesión expirada"
    });
  }

  // Validar datos de entrada
  const { 
    id_medicamento, numero_lote, fecha_fabricacion, fecha_caducidad, 
    cantidad_disponible, tipo_ingreso, precio_unitario, costo_unitario, observaciones
  } = req.body;
  
  if (!id_medicamento || !numero_lote || !fecha_fabricacion || !fecha_caducidad || !cantidad_disponible) {
    return res.status(400).json({ 
      success: false,
      message: "Todos los campos obligatorios deben ser proporcionados" 
    });
  }

  // Validar que las fechas sean correctas
  const fechaActual = new Date();
  const fechaFabricacion = new Date(fecha_fabricacion);
  const fechaCaducidad = new Date(fecha_caducidad);
  
  if (fechaCaducidad <= fechaActual) {
    return res.status(400).json({
      success: false,
      message: "La fecha de caducidad debe ser posterior a la fecha actual"
    });
  }

  if (fechaCaducidad <= fechaFabricacion) {
    return res.status(400).json({
      success: false,
      message: "La fecha de caducidad debe ser posterior a la fecha de fabricación"
    });
  }

  // Obtener el ID del usuario explícitamente de la sesión
  const id_usuario = req.session.user.id_usuario;
  
  console.log('ID de usuario en controlador:', id_usuario);
  console.log('Datos de usuario en sesión:', req.session.user);

  const stockData = {
    id_medicamento,
    numero_lote,
    fecha_fabricacion,
    fecha_caducidad,
    cantidad_disponible,
    registrar_ingreso: true,
    id_usuario, // Incluir aquí el ID del usuario obtenido de la sesión
    tipo_ingreso: tipo_ingreso || 'compra',
    precio_unitario: precio_unitario || 0,
    costo_unitario: costo_unitario || 0,
    observaciones: observaciones || null
  };

  Stock.insertarStock(stockData, (err, result) => {
    if (err) {
      console.error("Error completo al crear stock:", err);
      return res.status(500).json({ 
        success: false,
        message: "Error al crear el registro de stock", 
        error: err 
      });
    }
    
    // Verificar si con este nuevo stock el medicamento sigue teniendo stock bajo
    Medicamento.verificarStockBajo((errStock, medicamentosStockBajo) => {
      let alerta = null;
      
      if (!errStock && medicamentosStockBajo) {
        const medicamento = medicamentosStockBajo.find(m => m.id_medicamento === parseInt(id_medicamento));
        if (medicamento) {
          alerta = `El medicamento ${medicamento.nombre} sigue con stock bajo`;
        }
      }
      
      res.status(201).json({
        success: true,
        message: "Registro de stock creado exitosamente",
        data: { id: result.insertId },
        alerta
      });
    });
  });
};

// Actualizar stock
exports.actualizarStock = (req, res) => {
  const id = req.params.id;
  const { 
    id_medicamento, numero_lote, fecha_fabricacion, fecha_caducidad, cantidad_disponible 
  } = req.body;
  
  if (!id_medicamento || !numero_lote || !fecha_fabricacion || !fecha_caducidad || cantidad_disponible === undefined) {
    return res.status(400).json({ 
      success: false,
      message: "Todos los campos obligatorios deben ser proporcionados" 
    });
  }

  // Validar que las fechas sean correctas
  const fechaFabricacion = new Date(fecha_fabricacion);
  const fechaCaducidad = new Date(fecha_caducidad);
  
  if (fechaCaducidad <= fechaFabricacion) {
    return res.status(400).json({
      success: false,
      message: "La fecha de caducidad debe ser posterior a la fecha de fabricación"
    });
  }

  const stockData = {
    id_medicamento,
    numero_lote,
    fecha_fabricacion,
    fecha_caducidad,
    cantidad_disponible
  };

  Stock.actualizarStock(id, stockData, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al actualizar el registro de stock", 
        error: err 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Registro de stock no encontrado" 
      });
    }
    
    // Verificar estado de stock del medicamento
    Medicamento.verificarStockBajo((errStock, medicamentosStockBajo) => {
      let alerta = null;
      
      if (!errStock && medicamentosStockBajo) {
        const medicamento = medicamentosStockBajo.find(m => m.id_medicamento === parseInt(id_medicamento));
        if (medicamento) {
          alerta = `El medicamento ${medicamento.nombre} tiene stock bajo`;
        }
      }
      
      res.status(200).json({
        success: true,
        message: "Registro de stock actualizado exitosamente",
        alerta
      });
    });
  });
};

// Cambiar estado de stock
exports.cambiarEstadoStock = (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;
  
  if (!estado || !['activo', 'agotado', 'vencido'].includes(estado)) {
    return res.status(400).json({
      success: false,
      message: "Estado no válido. Debe ser 'activo', 'agotado' o 'vencido'"
    });
  }

  Stock.cambiarEstadoStock(id, estado, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al cambiar el estado del stock", 
        error: err 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Registro de stock no encontrado" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Estado del stock cambiado a '${estado}' exitosamente`
    });
  });
};

// Verificar stock próximo a vencer - Actualizado para usar 90 días por defecto
exports.verificarStockProximoVencer = (req, res) => {
  const diasLimite = parseInt(req.query.dias) || 90; // Por defecto, 90 días
  
  Stock.verificarStockProximoVencer(diasLimite, (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al verificar el stock próximo a vencer", 
        error: err 
      });
    }
    
    res.status(200).json({
      success: true,
      data: results,
      alerta: results.length > 0 ? `Se encontraron ${results.length} lotes próximos a vencer en los próximos ${diasLimite} días` : null
    });
  });
};

// Listar lotes agotados
exports.listarLotesAgotados = (req, res) => {
  Stock.listarLotesAgotados((err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al listar los lotes agotados", 
        error: err 
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

// Listar ingresos de medicamentos
exports.listarIngresosMedicamentos = (req, res) => {
  Stock.listarIngresosMedicamentos((err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Error al listar los ingresos de medicamentos", 
        error: err 
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};