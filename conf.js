var config = {
    appid: 'wx108d3ed3c670e850',
    secret: 'b03ea31002400ba73d272dd8a6d764ad',
    wechat_token: 'ie5xI5ZAvwhnC9XahpZGK1FknQX56zx',
    site: 'http://wuwoweiyi.com',
    mongodb: 'mongodb://127.0.0.1:27017/haowu',
    qiniu: {
        ak: '6DlqchP1xPFCO4tecFKSOtdtF6aXIsjeTegtZ0Uy',
        sk: 'iQ_-R6hKeNE-hzppcng7DzJtOyoi_AaJMcJnnetC',
        bucket: 'haowu',
        site: 'http://files.wuwoweiyi.com/',
        pipeline: 'haowu'
    },
}

try {
    //noinspection JSFileReferences
    require('./localconf')(config);
} catch (e) {
}

module.exports = config;
