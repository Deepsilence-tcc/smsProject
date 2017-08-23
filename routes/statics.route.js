var express = require('express');
var router = express.Router();
var StaticsController = require('../controller/statics.controller');

router.get('/get',StaticsController.getUrls);


module.exports = router;