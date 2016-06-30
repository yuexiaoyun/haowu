var qiniu = require('./qiniu');
var co = require('co');
var Post = require('../mongodb_models/post').Model;

co.wrap(function *() {
    console.log(5);
    var docs = yield Post.find().exec();
    for (var i in docs) {
        var d = docs[i];
        try {
            if (true) {
                var info = JSON.parse(yield qiniu.stat(d.pic_id));
                if (info.orientation && info.orientation == 'Right-top') {
                    d.w = info.height;
                    d.h = info.width;
                    yield d.save();
                    console.log(info.orientation);
                }
            }
        } catch(err) {
            console.log(err);
        }
    }
    //yield qiniu.pfop("6LosLa4BqzYwnef8oYVMXTUuMkf6LwHuM1GzbdMOMVm_Iq2N3ttvYwZ8pz-jM80Y");
    console.log(52);
})().then(function(data) {
}).catch(function(err) {
    console.log(err.stack);
});
