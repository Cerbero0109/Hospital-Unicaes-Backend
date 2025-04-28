const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const examenController = require('../controllers/examenController');
const router = express.Router();


router.get('/listar-pendientes', authMiddleware, examenController.listarExamenesPendientes);
router.get('/pacientes-con-examen', authMiddleware, examenController.PacientesConExamen);
router.get('/historial/:id_paciente', authMiddleware, examenController.historialExamenesPorPaciente);
router.get('/resultados/:id_examen', authMiddleware, examenController.mostrarResultadosExamen);
router.get('/listar-completados', authMiddleware, examenController.listarExamenesCompletados);


module.exports = router;