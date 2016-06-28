import { Model as User } from '../mongodb_models/user'
import { Model as Post } from '../mongodb_models/post'
import { Model as Audio } from '../mongodb_models/audio'

import _ from 'underscore'

export function *updateCount(_id) {
    var posts = yield Post.find({
        user_id: _id,
        status: { $ne: 0 }
    }).select('audio_id').exec();
    var post_count = posts.length;

    var audio_ids = posts.map(post=>post.audio_id);
    var reads_count = yield Audio.aggregate([{
        $match: {
            audio_id: { $in: audio_ids }
        },
    }, {
        $project: {
            reads_count: { $size: '$reads' }
        }
    }, {
        $group: {
            _id: 1,
            count: { $sum: '$reads_count' }
        }
    }]).exec();
    console.log(reads_count);
    console.log(post_count);

    console.log(yield User.update({
        _id: _id
    }, {
        $set: {
            post_count: post_count,
            reads_count: reads_count[0] && reads_count[0].count || 0
        }
    }));
}
