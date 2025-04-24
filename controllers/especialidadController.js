const Especialidad = require("../models/EspecialidadModel");

// Metodo Read: Listar especialidades (activas)
exports.listarEspecialidad = (req, res) => {
  Especialidad.listarEspecialidad((err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al listar las especialidades", error: err });
    }

    res.status(200).json(results);
  });
};

//listar usuarios by id
exports.ListarEspecialidadById = (req, res) => {
  const id = req.params.id;

  Especialidad.ListarEspecialidadById(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Controller Error al listar la especialidad, seleccionada",
        error: err,
      });
    }
    res.status(200).json(result);
  });
};

//Metodo Insert
exports.insertarEspecialidad = (req, res) => {
  const especialidadData = req.body;

  Especialidad.insertarEspecialidad(especialidadData, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "controller: Error al registrar la especialidad",
        error: err,
      });
    }

    res.status(200).json({ message: "Especialidad registrada" });
  });
};

//Metodo Update
exports.actualizarEspecialidad = (req, res) => {
  const especialidadData = req.body;
  const id = req.params.id;

  Especialidad.actualizarEspecialidad(id, especialidadData, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al actualizar la especialidad", error: err });
    }
    res.status(200).json({ message: "Especialidad actualizada" });
  });
};

// Cambiar estado de la especialidad, metodo DELETE
exports.cambiarEstadoEspecialidad = (req, res) => {
  const id = req.params.id; // Extrayendo el id de la URL
  Especialidad.cambiarEstadoEspecialidad(id, (error) => {
    if (error) {
      return res.status(500).json({
        message: "controller: Error al cambiar estado de la especialidad",
        error,
      });
    }
    res.status(200).json({ message: "Estado de la especialidad actualizada" });
  });
};
