var CodeMessage = require('../util/codemessage');
var ResultModel = require('../util/resultmodel');
var mongoose = require('mongoose');
var User = mongoose.model('Account');

module.exports = function (req,res,next) {
    var tel = req.body.tel;
    var type = parseInt(req.body.type);
    var resultModel = new ResultModel()
    if(tel==null||tel==undefined||tel==''||type==''||type==undefined||type===null||type>3||type<0||type.isNaN){
        resultModel.code = 5;
        resultModel.message = CodeMessage.MSG_5;
        return res.json(resultModel);
    }
    User.findOne({tel:tel,isDelete:0}).exec(function (err,user) {
        if(err) return next(err);
        if(user){
            req.user = user;
            req.type = type;
            next();
        }else {
            resultModel.code = 4;
            resultModel.message = CodeMessage.MSG_4;
            return res.json(resultModel);
        }
    })
}



