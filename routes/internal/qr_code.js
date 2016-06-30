import { api } from '../../utility/wechat'
import { new_id } from '../../utility/ids_utils'
import { Model as QrCode } from '../../mongodb_models/qr_code'
import uuid from 'uuid'

module.exports = function *() {
    var expire = this.query.expire || 1800;
    var token = this.query.token || uuid.v4();
    var id = yield new_id('qr_code', 1);
    var result = yield api.createTmpQRCode(id, expire);
    var imgurl = api.showQRCodeURL(result.ticket);

    var doc = new QrCode();
    doc._id = id;
    doc.token = token;
    doc.imgurl = imgurl;
    yield doc.save();

    this.body = {
        result: 'ok',
        _id: id,
        token,
        imgurl
    };
}
