import qs from 'querystring';
var err_to_msg = function(err) {
    return typeof(err) == 'string' ? err : '网络连接失败';
};

module.exports = {
    parse_online_json: function(res) {
        return res.json().then(function(body) {
            if (body.result == 'ok' || body.code == 0) {
                return Promise.resolve(body);
            }  else {
                var msg = body.error_msg ? body.error_msg : '未知错误: ' + JSON.stringify(body);
                return Promise.reject(msg);
            }
        });
    }
};
