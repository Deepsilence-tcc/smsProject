/**
 * Created by cong on 2017/7/28.
 */
var express = require('express');
var router = express.Router();
var UserController = require('../controller/login.controller');
var UserMiddleware = require('../middlewares/user.check.middlewares');
router.post('/register',UserController.register);
router.post('/login',UserController.login);
router.get('/smscode',UserController.getSMSCode);
router.post('/order',UserMiddleware,UserController.payCallBack);

module.exports = router
