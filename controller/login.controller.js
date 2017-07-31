/**
 * Created by cong on 2017/7/28.
 */
var CodeMessage = require('../util/codemessage');
var ResultModel = require('../util/resultmodel');
var AliSms = require('alidayu-node');
var mongoose = require('mongoose');
var config = require('../config/env/development');
var User = mongoose.model('Account');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var uuid = require('node-uuid');


var obj = {
    AccessKeyId: config.appKey,
    Action: 'SendSms',
    Format: 'JSON',
    PhoneNumbers: '',
    RegionId: 'cn-hangzhou',
    SignName: '泡椒视频',
    SignatureMethod: 'HMAC-SHA1',
    SignatureNonce: uuid.v1(),
    SignatureVersion: '1.0',
    TemplateCode: 'SMS_78610022',
    TemplateParam: '{"code":"123456"}',
    Timestamp: '',
    Version: '2017-05-25'
}

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
        if(!tel){
            resultMode.code = 5;
            resultMode.message = CodeMessage.MSG_5
            return res.json(resultMode);
        }
        User.find({tel:tel}).exec(function (err,doc) {
            if(err) return next(err);
            if(doc.length>0){
                resultMode.code = 2;
                resultMode.message = CodeMessage.MSG_2;
                return res.json(resultMode);
            }else {
                var user = new User({
                    identityId:'',
                    name:tel+'用户',
                    tel:tel,
                    age:0,
                    headimg:'',
                })
            }
        })
    },
    getSMSCode:function (req,res,next) {

        var phoneNum = req.query.tel;
        var resultMode = new ResultModel();
        var aliSms = new AliSms(config.appKey,config.appSecret);
        var code = Math.floor(Math.random() * 999999);

        if(phoneNum==null||phoneNum==undefined||phoneNum==''){
            resultMode.code = 5;
            resultMode.message = CodeMessage.MSG_5;
            return res.json(resultMode);
        }
        aliSms.smsSend({
            sms_free_sign_name: '泡椒视频', //短信签名，参考这里 http://www.alidayu.com/admin/service/sign
            sms_param: JSON.stringify({"code": code, "product": "泡椒视频"}),//短信变量，对应短信模板里面的变量
            rec_num: phoneNum, //接收短信的手机号
            sms_template_code: 'SMS_80050043' //短信模板，参考这里 http://www.alidayu.com/admin/service/tpl
        },function (err,data) {
            console.log(err);
            if (err){
                resultMode.code = 0;
                resultMode.message = CodeMessage.MSG_0;
                return res.json(resultMode);
            }
            var result = data.alibaba_aliqin_fc_sms_num_send_response.result;
            if(result.err_code=='0'&&result.success==true){
                var user = new User({
                    tel:phoneNum,
                    smscode:code
                });
                user.save(function (err,doc) {
                    if(err) return next(err);
                    if(doc._id){

                    }
                })
            }
        });

    }
}
