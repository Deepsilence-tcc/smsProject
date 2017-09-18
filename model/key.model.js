/**
 * Created by cong on 2017/8/20.
 */
var mongoose = require('mongoose');

var KeySchema = new mongoose.Schema({

    deviceId:{
        type:String,
    },
    value:{
        type:String
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    modifyAt:{
        type:Date,
        default:Date.now()
    },
    isDelete:{
        type:Number,
        default:0
    }

});
mongoose.model('Keys', KeySchema, 'Keys');
