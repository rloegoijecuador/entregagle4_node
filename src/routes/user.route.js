const { getAll, create, getOne, remove, update } = require('../controllers/user.controller');
const express = require('express');

const userRoute = express.Router();

userRoute.route('/user')
    .get(getAll)
    .post(create);

userRoute.route('/user/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = userRoute;