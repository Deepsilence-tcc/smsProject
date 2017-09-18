/**
 * Created by cong on 2017/8/21.
 */

var express = require('express');
var router = express.Router();
var KeyController = require('../controller/key.controller');
var $keyMiddleware = require('../middlewares/key.check.middlewares');

router.post('/create',KeyController.create);
router.post('/getkey',$keyMiddleware,KeyController.getKey);


module.exports = router
