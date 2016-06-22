import { Model as Audio } from '../../mongodb_models/audio';
import { updateScore } from '../../models/Score'
import { updateCount } from '../../models/Count'

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
    if (this.query.user_id)
        yield updateCount(this.query.user_id);

    this.body = yield {
        result: 'ok'
    };
}
