/**
 * Created by cong on 2017/8/21.
 */
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
module.exports={
    get:function (url,data) {
        if(!url){
            return new Promise(function(resolve,reject){
                var options = {
                    method: 'GET',
                    url: url,
                    data: data,
                    json: true,
                };
                request(options)
                    .then(function (response) {
                        var _data = response;
                        if(_data.status=='ok'){
                            resolve(_data);
                        }else {
                            var data={
                                status:'fail'
                            };
                            reject(data);
                        }
                    })
                
            })
        }
    },
    post:function (url,data) {

    }
}
