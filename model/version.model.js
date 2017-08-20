/**
 * Created by tcc on 2017/8/17.
 */
var mongoose = require('mongoose');

var VersionSchema = new mongoose.Schema({
    version:{
        type:Number,
        default:1000,
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
mongoose.model('Version', VersionSchema, 'Version');