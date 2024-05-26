const express = require('express');
const userRoute = require('./user.route');
const router = express.Router();

// colocar las rutas aquí
router.use(userRoute);


module.exports = router;