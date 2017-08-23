/**
 * Created by cong on 2017/7/28.
 */
var CodeMessage = require('../util/codemessage');
var resultModel = require('../util/resultModel');
const SMSClient = require('../lib/index');
var mongoose = require('mongoose');
var config = require('../config/env/development');
var User = mongoose.model('Account');
module.exports={
    login:function (req,res,next) {
        var telNum = req.body.tel;
        var password = req.body.password;
        var resultModel = new resultModel();
        if(!telNum||!password){
            resultModel.code = 5;
            resultModel.message=CodeMessage.MSG_5;
            return res.json(resultModel);
        }else {
            User.findOne({tel:telNum,password:password},{password:0,smscode:0,isDelete:0,createAt:0,modifyAt:0,}).exec(function (err,doc) {
                if(err) return next(err);
                console.log(doc);
                if(doc){
                    resultModel.code=1;
                    resultModel.message=CodeMessage.MSG_1;
                    resultModel.data = doc
                    return res.json(resultModel);

                }else {
                    resultModel.code=4;
                    resultModel.message = CodeMessage.MSG_4;
                    return res.json(resultModel);

                }
            })
        }
    },
    register:function (req,res,next) {
        var resultModel = new resultModel();
        var tel = req.body.tel;
        var code = req.body.code;
        var pass = req.body.password;
        var deviceId = req.body.deviceId;

        if(!tel||!code||!pass||!deviceId){
            resultModel.code = 5;
            resultModel.message = CodeMessage.MSG_5
            return res.json(resultModel);
        }
        User.findOne({tel:tel}).exec(function (err,doc) {
            if(err) return next(err);
            else if(doc.password!=''){
                resultModel.code = 2;
                resultModel.message = CodeMessage.MSG_2;
                return res.json(resultModel);
            }else {
            //    更新操作
                User.findOneAndUpdate({tel:tel,smscode:code},{$set:{
                    password:pass,deviceId:deviceId
                }},function (err,doc) {
                    if (err) return next(err);
                    if(doc){
                        resultModel.code = 1;
                        resultModel.message = CodeMessage.MSG_1;
                        return res.json(resultModel);
                    }else {
                        resultModel.code=4;
                        resultModel.message = CodeMessage.MSG_4;
                        return res.json(resultModel);
                    }
                })
            }
        })

    },
    getSMSCode:function (req,res,next) {
        console.log(req.query.tel);
        var phoneNum = req.query.tel;
        var resultModel = new resultModel();
        if(!phoneNum){
            resultModel.code=5;
            resultModel.message=CodeMessage.MSG_5;
            return res.json(resultModel);
        }
        var code = Math.floor(Math.random() * 999999);
        var smsClient = new SMSClient({appKey:config.appKey, appSecret:config.appSecret});

        smsClient.sendSMS({
            PhoneNumbers: phoneNum,
            SignName: '蜜桃',
            TemplateCode: 'SMS_80330031',
            TemplateParam: JSON.stringify({"code": code})
        }).then(function (result) {
            let {Code}=result
            if (Code === 'OK') {
                User.findOne({tel:phoneNum,isDelete:0}).exec(function (err,doc) {
                    console.log(doc);
                    if(doc){
                        User.update({tel:phoneNum},{$set:{smscode:code}},{multi:false}).exec(function (err) {
                            if(err) return next(err);
                            else {
                                resultModel.code=1;
                                resultModel.message=CodeMessage.MSG_1;
                                return res.json(resultModel);
                            }
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
                                resultModel.code=1;
                                resultModel.message=CodeMessage.MSG_1;
                                return res.json(resultModel);
                            }
                        })
                    }
                })
            }
        }, function (err) {
            resultModel.code=0;
            resultModel.message=CodeMessage.MSG_0;
            return res.json(resultModel);
        })


    },
    packageUpdate:function (req,res,next) {
        var tel =req.body.tel;
        var type = req.body.type;
        var resultModel = new resultModel();
        if(!tel||type){
            resultModel.code = 5;
            resultModel.message=CodeMessage.MSG_5;
            return res.json(resultModel);
        }
        User.findOne({

        })
    },
    payCallBack:function (req,res,next) {
        var user = req.user;
        var type = req.type;
        var startTime = Date.now();
    }

}
