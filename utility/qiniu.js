var qiniu = require('qiniu');
var api = require('./wechat').api;
var conf = require('../conf')

qiniu.conf.ACCESS_KEY = conf.qiniu.ak;
qiniu.conf.SECRET_KEY = conf.qiniu.sk;

module.exports = {
    sync: function *(media_id) {
        var buffer = yield api.getMedia(media_id);
        var putPolicy = new qiniu.rs.PutPolicy(conf.qiniu.bucket);
        var token = putPolicy.token();
        var extra = new qiniu.io.PutExtra();
        var ret = yield new Promise((resolve, reject) => {
            qiniu.io.put(token, media_id, buffer, extra, function(err, ret) {
                if (err)
                    reject(err);
                else
                    resolve(ret);
            });
        });
    }
}
