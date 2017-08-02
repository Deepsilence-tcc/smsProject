/**
 * Created by cong on 2017/7/28.
 */
var express = require('express');
var router = express.Router();
var UserController = require('../controller/login.controller');
router.post('/register',UserController.register);
router.post('/login',UserController.login);
router.get('/smscode',UserController.getSMSCode);

module.exports = router
