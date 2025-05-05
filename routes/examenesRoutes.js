const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const examenController = require('../controllers/examenController');
const router = express.Router();

// Rutas para listar exámenes
router.get('/listar-pendientes', authMiddleware, examenController.listarExamenesPendientes);
router.get('/pacientes-con-examen', authMiddleware, examenController.PacientesConExamen);
router.get('/historial/:id_paciente', authMiddleware, examenController.historialExamenesPorPaciente);
router.get('/:id_examen/resultados', authMiddleware, examenController.mostrarResultadosExamen);
router.get('/listar-completados', authMiddleware, examenController.listarExamenesCompletados);

// Rutas para la gestión de resultados
router.post('/:id_examen/resultados', authMiddleware, examenController.crearResultadoExamen);
router.put('/resultados-editar/:id_resultado', authMiddleware, examenController.actualizarResultadoExamen);
// Ruta para marcar un examen como inactivo
router.put('/:id_examen/examen-inactivo', authMiddleware, examenController.marcarExamenComoInactivo);
// Ruta para marcar un examen como completado
router.put('/:id_examen/completar', authMiddleware, examenController.marcarExamenComoCompletado);

module.exports = router;