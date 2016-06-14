import { Model as User } from '../../mongodb_models/user';
import { Model as Audio } from '../../mongodb_models/audio';
import { createAction } from 'redux-actions';

export default function*() {
    var audio = yield Audio.findOne({audio_id: this.query.audio_id}).exec();
    if (!audio)
        this.throw(404);
    var users = yield User.find(
        {_id: { $in: audio.reads}}
    ).select('_id headimgurl nickname subids status').exec();

    this.body = {
        result: 'ok',
        actions: [
            createAction('update_audio_read_uids')({
                audio_id: this.query.audio_id,
                users: users.map(user=>User.toBrowser(user, this.session.user_id))
            })
        ]
    }
}
