import { Model as Notification } from '../../mongodb_models/notification'
import { updateScore } from '../../models/Score'
import { updateCount } from '../../models/Count'

export default function *({user_id, post_user_id, post_id}) {
    try {
        yield updateScore(post_id);
        yield updateCount(post_user_id);
        if (user_id != post_user_id) {
            var query = {
                user_id: post_user_id,
                type: 'read',
                target: post_id,
            }
            console.log(yield Notification.update(query, {
                ...query,
                user_id2: user_id,
                uptime: new Date()
            }, { upsert: true }));
        }
    } catch(err) {
        console.log(err.stack);
        throw(err);
    }
}
