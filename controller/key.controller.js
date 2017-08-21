/**
 * Created by cong on 2017/8/21.
 */
var CodeMessage = require('../util/codemessage');
var ResultModel = require('../util/resultmodel');
var mongoose = require('mongoose');
var Key = mongoose.model('Key');

module.exports = {
    create:function (req,res,next) {
        var deviceId = req.body.deviceId;
        var key = req.body.key;
        var resultMode = new ResultModel();
        if(!deviceId||!key){
            resultMode.code=5;
            resultMode.message = CodeMessage.MSG_5;
            return res.json(resultMode);
        }
        Key.findOne({deviceId:deviceId,value:key,isDelete:0}).exec(function (err,doc) {
            if(err) return next(err);
            if(doc){
                Key.update({deviceId:deviceId,isDelete:0},{$set:{value:key,modifyAt:Date.now()}},{multi:false})
                    .exec(function (err,currentDoc) {
                        if (err) return next(err);
                        if(currentDoc){
                            resultMode.code = 1;
                            resultMode.message = CodeMessage.MSG_1;
                            return res.json(resultMode);
                        }
                    })
            }else {
                var key = new Key({
                    deviceId:deviceId,
                    value:key
                });
                key.save(function (err,resultKey) {
                    if(err) return next(err);
                    if(resultKey){
                        resultMode.code=1;
                        resultMode.message=CodeMessage.MSG_1;
                        return res.json(resultMode);
                    }
                })
            }
        })
    },
    getKey:function (req,res,next) {
        var deviceId = req.body.deviceId;
        var resultMode = new ResultModel();
        if(!deviceId){
            resultMode.code=5;
            resultMode.message = CodeMessage.MSG_5;
            return res.json(resultMode);
        }
        Key.findOne({deviceId:deviceId,isDelete:0}).exec(function (err,doc) {
            if(err) return next(err);
            if(doc){
                resultMode.code = 1;
                resultMode.message = CodeMessage.MSG_1;
                resultMode.data = doc;
                return res.json(resultMode);
            }else {
                resultMode.code = 4;
                resultMode.message = CodeMessage.MSG_4;
                return res.json(resultMode);
            }
        })
    }
}