var express = require('express');
var router = express.Router();
var StaticsController = require('../controller/statics.controller');
router.post('/fetch_url',StaticsController.getUrls);
module.exports = router;