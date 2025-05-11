const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const examenController = require('../controllers/examenController');
const router = express.Router();

// Rutas para listar exámenes
router.get('/listar-pendientes', authMiddleware, examenController.listarExamenesPendientes);
router.get('/pacientes-con-examen', authMiddleware, examenController.PacientesConExamen);
router.get('/historial/:id_paciente', authMiddleware, examenController.historialExamenesPorPaciente);
router.get('/resultados/:id_examen/', authMiddleware, examenController.mostrarResultadosExamen);
router.get('/listar-completados', authMiddleware, examenController.listarExamenesCompletados);
router.get('/listar-ultimos-examenes', authMiddleware, examenController.listarUltimosExamenes);
router.get('/contar-examenes-pendientes', authMiddleware, examenController.contarExamenesPendientes);
router.get('/contar-examenes-completados', authMiddleware, examenController.contarExamenesCompletados);
router.get('/pacientes-con-examen', authMiddleware, examenController.contarPacientesConExamen);

// Rutas para la gestión de resultados
router.post('/resultados/:id_examen', authMiddleware, examenController.crearResultadoExamen);
router.put('/resultados-editar/:id_resultado', authMiddleware, examenController.actualizarResultadoExamen);
router.delete('/resultados-eliminar/:id_resultado', authMiddleware, examenController.eliminarResultadoExamen);


// Ruta para marcar un examen como inactivo
router.put('/examen-inactivo/:id_examen', authMiddleware, examenController.marcarExamenComoInactivo);


// Ruta para marcar un examen como completado
router.put('/completar/:id_examen', authMiddleware, examenController.marcarExamenComoCompletado);


//Ruta para marcar un paciente como inactivo
router.put('/paciente-inactivo/:id_paciente', authMiddleware, examenController.marcarPacienteComoInactivo);


module.exports = router;