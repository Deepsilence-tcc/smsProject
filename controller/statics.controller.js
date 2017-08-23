/**
 * Created by cong on 2017/8/21.
 */
var CodeMessage = require('../util/codemessage');
var ResultModel = require('../util/resultmodel');
var mongoose = require('mongoose');
var Statics = mongoose.model('Statics')

module.exports = {
    getUrls:function (req,res,next) {
        var tel = req.body.tel;
        var resultModel = new ResultModel();
        if(!tel){
            resultModel.code = 5;
            resultModel.message = CodeMessage.MSG_5;
            return res.json(resultModel);
        }
        Statics.findOne({isDelete:0},{old:1,new:1,_id:0}).exec(function (err,doc) {
            if(err) return next(err);
            if(doc){
                resultModel.code = 1;
                resultModel.message = CodeMessage.MSG_1;
                resultModel.data = doc;
                return res.json(resultModel);
            }else {
                resultModel.code = 4;
                resultModel.message = CodeMessage.MSG_4;
                return res.json(resultModel);
            }
        })

    }
}
