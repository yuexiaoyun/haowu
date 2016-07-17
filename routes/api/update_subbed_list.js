import { Model as User, findUsersByIds } from '../../mongodb_models/user';
import { createAction } from 'redux-actions';
import _ from 'underscore';

import { listSet } from '../../front_end/ducks/list';

module.exports = function*() {
    var docs = yield User.findById(this.query._id).select('subids').exec();
    var subids = docs.subids.reverse();
    var user_ids = _.uniq([
        ...subids,
        this.query._id
    ]);
    var users = yield findUsersByIds(this.session.user_id, user_ids);

    this.body = {
        result: 'ok',
        actions: [
            listSet({
                key: `subbed_list/${this.query._id}`,
                list: subids,
                end: 1
            }),
            createAction('update_users')({
                users
            })
        ]
    }
};
