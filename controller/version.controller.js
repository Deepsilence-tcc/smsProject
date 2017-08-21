/**
 * Created by tcc on 2017/8/17.
 */
var CodeMessage = require('../util/codemessage');
var ResultModel = require('../util/resultmodel');
var mongoose = require('mongoose');
var Version = mongoose.model('Version');

module.exports={
    create:function (req,res,next) {

    },
    getVersion:function (req,res,next) {

    },
    shouldUpdate:function (req,res,next) {
        var currentVersion = req.query.version;
        var resultModel = new ResultModel();
        if(!currentVersion){
            resultModel.code = 5;
            resultModel.message = CodeMessage.MSG_5;
            return res.json(resultModel);
        }
        Version.findOne({
            isDelete:0
        }).exec(function (err,doc) {
            if(err) return next(err);
            if(doc._id&&doc.version){
                if(currentVersion>doc.version){
                    resultModel.code = 5;
                    resultModel.message = CodeMessage.MSG_5;
                    return res.json(resultModel);
                }else if(currentVersion<doc.version){
                    if(doc.version===1666&&currentVersion){
                        resultModel.code=1;
                        resultModel.message =CodeMessage.MSG_1;
                        resultModel.data = {
                            isRequire:true,
                            isShould:false,
                        };
                        return res.json(resultModel);
                    }else {
                        resultModel.code=1;
                        resultModel.message = CodeMessage.MSG_1;
                        resultModel.data = {
                            isRequire:false,
                            isShould:true,
                        };
                        return res.json(resultModel);
                    }
                }else {
                    resultModel.code = 1;
                    resultModel.message = '已经是最新版本了';
                    resultModel.data = {
                        isRequire:false,
                        isShould:false,
                    };
                    return res.json(resultModel);
                }
            }else {
                resultModel.code = 0;
                resultModel.message = CodeMessage.MSG_0;
                return res.json(resultModel);
            }
        })
    }
}