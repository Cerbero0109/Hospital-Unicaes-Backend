const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const plantillaExamenController = require('../controllers/plantillaExamenController');
const router = express.Router();


router.post('/crear', authMiddleware, plantillaExamenController.crearPlantilla);
router.get('/listar', authMiddleware, plantillaExamenController.listarTodasPlantillas);
router.get('/tipo/:id_tipo_examen', authMiddleware, plantillaExamenController.listarPlantillasPorTipo);
router.get('/:id_plantilla', authMiddleware, plantillaExamenController.obtenerPlantillaCompleta);
router.put('/:id_plantilla', authMiddleware, plantillaExamenController.actualizarPlantilla);
router.delete('/:id_plantilla', authMiddleware, plantillaExamenController.desactivarPlantilla);
router.post('/:id_plantilla/duplicar', authMiddleware, plantillaExamenController.duplicarPlantilla);
router.get('/:id_plantilla/validar', authMiddleware, plantillaExamenController.validarPlantilla);
router.get('/buscar/query', authMiddleware, plantillaExamenController.buscarPlantillas);




router.post('/:id_plantilla/parametros', authMiddleware, plantillaExamenController.agregarParametro);
router.put('/parametros/:id_plantilla_parametro', authMiddleware, plantillaExamenController.actualizarParametro);
router.delete('/parametros/:id_plantilla_parametro', authMiddleware, plantillaExamenController.eliminarParametro);


router.post('/usar-plantilla', authMiddleware, plantillaExamenController.crearResultadosDesdeePlantilla);


router.get('/utils/tipos-examen', authMiddleware, plantillaExamenController.listarTiposExamen);
router.get('/stats/usuario/:id_usuario?', authMiddleware, plantillaExamenController.contarPlantillasPorUsuario);

module.exports = router;