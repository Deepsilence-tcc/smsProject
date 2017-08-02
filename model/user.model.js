/**
 * Created by cong on 2017/7/28.
 */
/**
 * Created by zhangjinming on 16/7/29.
 */
var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
    identityId:{
        type:Number,
        default:0
    },
    name:{
        type:String,
        default:0,
    },
    tel:String,
    age:{
        type:Number,
        default:0
    },
    gender:{
        type:Number,
        default:1
    },
    headimg:{
        type:String,
        default:''
    },
    expire:{
        type:Date,
        default:Date.now()
    },
    smscode:Number,
    deviceId:String,
    times:{
        type:Number,
        default:3,
    },
    createAt: {
        type: Date,
        default: Date.now
    }, //创建时间
    modifyAt: {
        type: Date,
        default: Date.now
    }, //修改时间
    isDelete: {
        type:Number,
        default:0
    } //是否删除
}, {
    versionKey: false
});

mongoose.model('Account', AccountSchema, 'Account');