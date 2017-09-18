var CodeMessage = require('../util/codemessage');
var ResultModel = require('../util/resultmodel');
var mongoose = require('mongoose');
var User = mongoose.model('Account');

module.exports = function (req,res,next) {
    var tel = req.body.tel;
    var resultModel = new ResultModel()
    if(tel==null||tel==undefined||tel==''){
        resultModel.code = 5;
        resultModel.message = CodeMessage.MSG_5;
        return res.json(resultModel);
    }
    User.findOne({tel:tel,isDelete:0}).exec(function (err,user) {
        if(err) return next(err);
        console.log(user);
        if(user){
            console.log(111);
            req.user = user;
            next();
        }else {
            console.log(111);

            resultModel.code = 4;
            resultModel.message = CodeMessage.MSG_4;
            return res.json(resultModel);
        }
    })
}



