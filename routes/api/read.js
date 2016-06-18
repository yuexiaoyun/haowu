import { Model as Audio } from '../../mongodb_models/audio';
import { updateScore } from '../../models/Score'

export default function *() {
    var q = { audio_id: this.query.audio_id };
    var d = {
        $addToSet: {
            reads: this.session.user_id
        }
    };
    var update = yield Audio.update(q, d, {upsert: true});
    if (this.query.post_id)
        yield updateScore(this.query.post_id);

    this.body = yield {
        result: 'ok'
    };
}
