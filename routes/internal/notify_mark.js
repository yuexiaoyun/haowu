import notifyMark from '../../utility/msg/notify_mark'

module.exports = function *() {
    yield notifyMark({
        topic_id: this.query.topic_id
    });
    this.body = {
        result: 'ok'
    };
}
