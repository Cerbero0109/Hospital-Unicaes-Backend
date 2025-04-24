const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const areaController = require('../controllers/areaController');
const router = express.Router();


router.post('/registrar', authMiddleware, areaController.insertarArea);
router.get('/listar', authMiddleware, areaController.listarArea);
router.get('/listar/:id', authMiddleware, areaController.listarAreaById);
router.put('/cambiar-estado/:id', areaController.cambiarEstadoArea);
router.put('/actualizar/:id', authMiddleware, areaController.actualizarArea);


module.exports = router;