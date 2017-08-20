/**
 * Created by tcc on 2017/8/17.
 */
var express = require('express');
var router = express.Router();
var VersionController = require('../controller/version.controller');

router.get('/shouldupdate',VersionController.shouldUpdate);

module.exports = router
