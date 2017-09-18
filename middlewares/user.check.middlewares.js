var CodeMessage = require('../util/codemessage');
var ResultModel = require('../util/resultmodel');
var mongoose = require('mongoose');
var User = mongoose.model('Account');

module.exports = function (req,res,next) {
    var tel = req.body.tel;
    var endType = parseInt(req.body.type);
    var state = parseInt(req.body.state);
    var payNum = parseInt(req.body.pay_num);
    var resultModel = new ResultModel()
    if(tel==null||typeof tel=='undefined'||tel==''||endType==''||typeof endType=='undefined'||endType===null||endType>4||endType<0||isNaN(endType)||state>1||state<0||typeof state =='undefined'||state==null||state==''||payNum<0||typeof payNum=='undefined'||payNum ==null||payNum==''){
        resultModel.code = 5;
        resultModel.message = CodeMessage.MSG_5;
        return res.json(resultModel);
    }
    User.findOne({tel:tel,isDelete:0}).exec(function (doc) {
        if(doc){
            if(state==0){
                switch (endType){
                    case 1:
                        if(payNum<48){
                            resultModel.code = 7;
                            resultModel.message = CodeMessage.MSG_7;
                            return res.json(resultModel);
                        }else {
                            req.endTime = doc.vipTime.end;
                        }
                        break;
                    case 2:
                        if(payNum<38){
                            resultModel.code = 7;
                            resultModel.message = CodeMessage.MSG_7;
                            return res.json(resultModel);
                        }else {
                            req.endTime = doc.vipTime.end;
                        }
                        break;
                    case 3:
                        if(payNum<28){
                            resultModel.code = 7;
                            resultModel.message = CodeMessage.MSG_7;
                            return res.json(resultModel);
                        }else {
                            req.endTime = doc.vipTime.end;
                        }
                        break;
                    case 4:
                        if(payNum<284){
                            resultModel.code = 7;
                            resultModel.message = CodeMessage.MSG_7;
                            return res.json(resultModel);
                        }else {
                            req.endTime = doc.vipTime.end;
                        }
                        break;
                }
            }else {
                //全费
                switch (endType){
                    case 1:
                        if(payNum<48){
                            resultModel.code = 7;
                            resultModel.message = CodeMessage.MSG_7;
                            return res.json(resultModel);
                        }else {
                            req.endTime =  user.vipTime.end + 3*30*24 * 60 * 60 * 1000
                        }
                        break;
                    case 2:
                        if(payNum<86){
                            resultModel.code = 7;
                            resultModel.message = CodeMessage.MSG_7;
                            return res.json(resultModel);
                        }else {
                            req.endTime =  user.vipTime.end + 6*30*24 * 60 * 60 * 1000
                        }
                        break;
                    case 3:
                        if(payNum<114){
                            resultModel.code = 7;
                            resultModel.message = CodeMessage.MSG_7;
                            return res.json(resultModel);
                        }else {
                            req.endTime =  user.vipTime.end + 12*30*24 * 60 * 60 * 1000
                        }
                        break;
                    case 4:
                        if(payNum<398){
                            resultModel.code = 7;
                            resultModel.message = CodeMessage.MSG_7;
                            return res.json(resultModel);
                        }else {
                            req.endTime =  user.vipTime.end + 70*12*30*24 * 60 * 60 * 1000
                        }
                        break;
                }
            }
            req.tel = tel;
            req.endType = endType;
            req.state = state;
            req.payNum = payNum;
            req.user = doc;
            next();
        }else {
            resultModel.code = 5;
            resultModel.message = CodeMessage.MSG_5;
            return res.json(resultModel);
        }
    })


}



