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
        var telNum = req.body.tel;
        var password = req.body.password;
        var resultModel = new ResultModel();
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
        var resultModel = new ResultModel();
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
        var resultModel = new ResultModel();
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
    payCallBack:function (req,res,next) {
        var user = req.user;
        var endTime = req.endTime;

        var resultModel = new ResultModel();
        User.findOneAndUpdate({_id:user._id,isDelete:0},{$set:{
            vipTime: {
                end: endTime,
                start: startTime},type:type,modifyAt:Date.now()
        }}).exec(function (err,doc) {
            if(err) return next(err);
            console.log(doc);
            console.log(endTime,startTime);
            if(doc){
                resultModel.code = 1;
                resultModel.message = CodeMessage.MSG_1;
                return res.json(resultModel);
            }else {
                resultModel.code=3;
                resultModel.message = CodeMessage.MSG_3;
                return res.json(resultModel);
            }
        })

    },
    getUserType:function (req,res,next) {
        var tel = req.body.tel;
        // var tel = req.query.tel;
        var resultModel = new ResultModel();
        if(typeof tel=='undefined'||tel==null||tel==''){
            resultModel.code = 5;
            resultModel.message = CodeMessage.MSG_5;
            return res.json(resultModel);
        }
        User.find({tel:tel,isDelete:0},{password:0,smscode:0,isDelete:0,createAt:0,modifyAt:0,}).exec(function (err,doc) {
            if(err) return next(err);
            if(doc){
                var currentDate = Date.now();
                console.log(currentDate);
                resultModel.code=1;
                resultModel.message = CodeMessage.MSG_1;
                resultModel.data = doc;
                return res.json(resultModel)
            }else {
                resultModel.code =4;
                resultModel.message = CodeMessage.MSG_4;
                resultModel.data={};
                return res.json(resultModel);
            }
        })
    },
    getUserDateTime:function (req,res,next) {
        // var tel = req.body.tel;
        var tel = req.body.tel;
        var resultModel = new ResultModel();
        if(typeof tel=='undefined'||tel==null||tel==''){
            resultModel.code = 5;
            resultModel.message = CodeMessage.MSG_5;
            return res.json(resultModel);
        }
        User.findOne({tel:tel,isDelete:0},{password:0,smscode:0,isDelete:0,createAt:0,modifyAt:0,identityId:0,name:0,tel:0,age:0,gender:0,headimg:0,expire:0,deviceId:0,times:0}).exec(function (err,doc) {
            if(err) return next(err);
            if(doc){
                var currentDate = Date.now();
                if(currentDate>doc.vipTime.end){
                    User.update({tel:tel,isDelete:0},{$set:{type:0,vipTime:{
                        end:Date.now(),
                        start:Date.now()
                    }}},{multi:false}).exec(function (err) {
                        if(err) return next(err);
                        resultModel.code=1;
                        resultModel.message = CodeMessage.MSG_1;
                        resultModel.data = {
                            vipTime:doc.vipTime,
                            type:0
                        };
                        return res.json(resultModel)
                    })
                }else {
                    if(err) return next(err);
                    resultModel.code=1;
                    resultModel.message = CodeMessage.MSG_1;
                    resultModel.data = doc;
                    return res.json(resultModel)
                }

            }else {
                resultModel.code =4;
                resultModel.message = CodeMessage.MSG_4;
                resultModel.data={};
                return res.json(resultModel);
            }
        })
    },


}
