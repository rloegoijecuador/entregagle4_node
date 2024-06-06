const { getAll, create, getOne, remove, update, verifyCode } = require('../controllers/user.controller');
const express = require('express');

const userRoute = express.Router();

userRoute.route('/user')
    .get(getAll)
    .post(create);


userRoute.route('/user/verify/:code')
    .get(verifyCode);    

userRoute.route('/user/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = userRoute;