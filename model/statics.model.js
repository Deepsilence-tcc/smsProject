
var mongoose = require('mongoose');

var StaticsSchema = new mongoose.Schema({

    old:{
        home:String,
        rank:String,
        goddess:String,
        atlas:String,
        pic:String
    },
    new:{
        home:String,
        rank:String,
        goddess:String,
        atlas:String,
        pic:String
    },
    isDelete:{
        type:Number,
        default:0
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    modifyAt:{
        type:Date,
        default:Date.now()
    }
});

mongoose.model('Statics', StaticsSchema, 'Statics');

