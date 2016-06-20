import { Model as Post } from '../mongodb_models/post'
import { Model as UserFeed } from '../mongodb_models/user_feed'
import { Model as Comment } from '../mongodb_models/comment'
import { Model as Audio } from '../mongodb_models/audio'

import _ from 'underscore'

export function *updateScore(_id) {
    var post = yield Post.findOne({_id: _id}).exec();
    var rank0 = 0;

    var length = Math.floor(post.length / 1000 + 0.5);
    console.log('语音长度权重: ' + length);
    rank0 += length;

    var audio = yield Audio.findOne({audio_id: post.audio_id});
    var reads = (audio && audio.reads && audio.reads.length || 0) * 20;
    console.log('听过次数权重: ' + reads);
    rank0 += reads;

    var comments = yield Comment.find({post_id: _id, status: 1}).exec();
    var comment_user_ids = comments.map((comment)=>comment.user_id);
    var replies = _.flatten(comments.map((comment)=>comment.replies));
    var reply_uids = replies.map((reply)=>reply.user_id);
    var uid_count = _.uniq([...comment_user_ids, ...reply_uids]).length * 40;
    console.log('评论权重: ' + uid_count);
    rank0 += uid_count;

    // TODO: 是否真的看过
    var feed_views = (yield UserFeed.count({posts: _id})) + 5;
    console.log('阅读次数（分母): ' + feed_views);
    rank0 /=  feed_views;

    post.rank0 = rank0;
    yield post.save();
}
