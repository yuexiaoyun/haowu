import { Model as User, findUsersByIds } from '../../mongodb_models/user';
import { Model as Audio } from '../../mongodb_models/audio';
import { createAction } from 'redux-actions';

module.exports = function*() {
    var audio = yield Audio.findOne({audio_id: this.query.audio_id}).exec();
    if (!audio)
        this.throw(404);
    var users = yield findUsersByIds(this.session.user_id, audio.reads);

    this.body = {
        result: 'ok',
        actions: [
            createAction('update_audio_read_uids')({
                audio_id: this.query.audio_id,
                users
            })
        ]
    }
}
