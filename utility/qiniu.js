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
    },
    pfop: function *(media_id) {
        var saveas_key = qiniu.util.urlsafeBase64Encode(conf.qiniu.bucket+':'+media_id + '_mp3');
        var fops = 'avthumb/mp3|saveas/' + saveas_key;
        var ret = yield new Promise((resolve, reject) => {
            qiniu.fop.pfop(conf.qiniu.bucket, media_id, fops, {pipeline: conf.qiniu.pipeline}, function(err, ret) {
                if (err)
                    reject(err);
                else
                    resolve(ret);
            });
        });
        console.log(ret);
    }
}
