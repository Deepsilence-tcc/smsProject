/**
 * Created by cong on 2017/7/28.
 */
var CodeMessage = require('../util/codemessage');
var ResultModel = require('../util/resultmodel');
const SMSClient = require('../lib/index');
var mongoose = require('mongoose');
var config = require('../config/env/development');
var User = mongoose.model('Account');


module.exports={
    login:function (req,res,next) {
        var telNum = req.query.tel;
        var resultMode = new ResultModel();
        if(!telNum){
            resultMode.code = 5;
            resultMode.message=CodeMessage.MSG_5;
            return res.json(resultMode);
        }else {
            User.findOne({tel:telNum}).exec(function (err,doc) {
                if(err) return next(err);
                if(doc._id){
                    resultMode.code=1;
                    resultMode.message=CodeMessage.MSG_1;
                    resultMode.data = doc
                }else {
                    resultMode.code=0;
                    resultMode.message = CodeMessage.MSG_0;
                }
                return res.json(resultMode);
            })
        }
    },
    register:function (req,res,next) {
        var resultMode = new ResultModel();
        var tel = req.body.tel;
        var code = req.body.code;
        var pass = req.body.password;
        var deviceId = req.body.deviceId;

        if(!tel||!code||!pass||!deviceId){
            resultMode.code = 5;
            resultMode.message = CodeMessage.MSG_5
            return res.json(resultMode);
        }
        User.findOneAndUpdate({tel:tel,smscode:code},{$set:{
            password:pass,deviceId:deviceId
        }},function (err,doc) {
            if (err) return next(err);
            if(doc._id){
                resultMode.code = 1;
                resultMode.message = CodeMessage.MSG_1;
                return res.json(resultMode);
            }else {
                resultMode.code=4;
                resultMode.message = CodeMessage.MSG_1;
                return res.json(resultMode);
            }
        })
    },
    getSMSCode:function (req,res,next) {
        var phoneNum = req.query.tel;
        var resultMode = new ResultModel();
        if(!phoneNum||!deviceId){
            resultMode.code=5;
            resultMode.message=CodeMessage.MSG_5;
            return res.json(resultMode);
        }
        var code = Math.floor(Math.random() * 999999);
        var smsClient = new SMSClient({appKey:config.appKey, appSecret:config.appSecret});

        smsClient.sendSMS({
            PhoneNumbers: phoneNum,
            SignName: '蜜桃',
            TemplateCode: 'SMS_80330031',
            TemplateParam: JSON.stringify({"code": code})
        }).then(function (res) {
            let {Code}=res
            if (Code === 'OK') {
                User.findOne({tel:phoneNum}).exec(function (err,doc) {
                    console.log(doc);
                    if(doc){
                        User.update({tel:phoneNum},{$set:{smscode:code}},{multi:false}).exec(function (err) {
                            if(err) return next(err);
                        })

                    }else {
                        var user = new User(
                            {
                                tel:phoneNum,
                                smscode:code,
                            }
                        );
                        user.save(function (err,doc) {
                            if(err) return next(err);
                            if(doc){
                                resultMode.code=1;
                                resultMode.message=CodeMessage.MSG_1;
                                return res.json(resultMode);
                            }
                        })
                    }
                })
            }
        }, function (err) {
            console.log(err);
            resultMode.code=0;
            resultMode.message=CodeMessage.MSG_0;
            return res.json(resultMode);
        })


    }
}
