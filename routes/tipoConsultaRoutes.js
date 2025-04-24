const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); 
const tipoConsultaController = require('../controllers/tipoConsultaController');
const router = express.Router();



router.get('/listar', authMiddleware, tipoConsultaController.listarTipoConsulta);



module.exports = router;