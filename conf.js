var config = {
    appid: 'wxa14c3c5992691f51',
    secret: 'eddc796da91aa9a695a36a7b9b9e23be',
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
