const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.post('/registro', AuthController.registrar);
router.post('/login', AuthController.login);

module.exports = router;