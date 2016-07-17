import { Model as User, findUsers } from '../../mongodb_models/user';
import { createAction } from 'redux-actions';
import _ from 'underscore';

import { listSet } from '../../front_end/ducks/list';

module.exports = function*() {
    var users = yield findUsers(this.session.user_id, {
        subids: this.query._id
    });

    this.body = {
        result: 'ok',
        actions: [
            listSet({
                key: `sub_list/${this.query._id}`,
                list: users.map(user=>user._id),
                end: 1
            }),
            createAction('update_users')({
                users
            })
        ]
    }
};
