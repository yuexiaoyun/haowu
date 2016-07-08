import { Model as UserFeed } from '../../mongodb_models/user_feed';

module.exports = function*() {
    yield UserFeed.update({
        user_id: this.session.user_id
    }, {
        tooltip_showed: 1
    });
    this.body = {
        result: 'ok',
        actions: []
    }
}
