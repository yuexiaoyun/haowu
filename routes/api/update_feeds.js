import { Model as Post, findPostsByIds } from '../../mongodb_models/post';
import { Model as User, findUsersByIds } from '../../mongodb_models/user';
import { Model as Audio } from '../../mongodb_models/audio';
import { Model as UserFeed } from '../../mongodb_models/user_feed';
import { createAction } from 'redux-actions';
import { updateScore } from '../../models/Score';
import ms from 'ms';
import co from 'co';

import _ from 'underscore';
import ObjectId from 'bson/lib/bson/objectid'

function *getNewPostIds(my_id, origin_post_ids, limit) {
    // TODO 数据量足够大之后，帖子要加过期时间
    // 取帖子的原则：未被屏蔽的帖子，或者自己发的已被屏蔽的帖子
    var posts = yield Post.find({
        $or: [
            { status: 1 },
            { status: 2, user_id: my_id}
        ],
        _id: {
            $nin: origin_post_ids
        }
    }).select('_id user_id rank0').exec();

    // 按实时性衰减重算rank并排序
    posts = posts.map((post) => {
        // 按（已发的时间 + 若干小时）作为分母来衰减
        var d = (new Date() - ObjectId(post._id).getTimestamp()) / ms('7d') + 1;
        post = post.toObject();
        post.rank = post.rank0 / d;
        return post;
    });
    posts = _.sortBy(posts, (post)=>(-post.rank));

    // 初步的uid去重
    var uids = {};
    var results = _.filter(posts, post=>{
        if (uids[post.user_id])
            return false;
        uids[post.user_id] = true;
        return true;
    });

    if (results.length >= limit) {
        // 结果足够则返回
        results = _.first(results, limit);
        results = results.map(result=>result._id);
    } else {
        // 结果不够，则突破去重策略返回
        var ids = results.map(result=>result._id);
        var id_map = _.object(ids, results);
        var add_ids = _.chain(posts)
            .filter((post) => (!id_map[post._id]))
            .first(limit - results.length)
            .map(post => post._id)
            .value()
        results = [...ids, ...add_ids];
    }
    // TODO: 优化性能
    for (var i in results) {
        co(updateScore(results[i]));
    }
    return results;
}

module.exports = function*() {
    // 先取我曾经刷过的Feed列表，如果为空则新建一个
    var doc = yield UserFeed.findOne({
        user_id: this.session.user_id
    }).exec();
    if (!doc) {
        doc = new UserFeed();
        doc.user_id = this.session.user_id;
        doc.posts = [];
    }
    doc.width = this.query.width;
    doc.dpr = this.query.dpr;

    // 刷出本次的Feed id列表，并更新数据库里的posts字段
    // TODO: doc.save应该在最后进行，防止渲染层出bug
    var limit = 10;
    if (this.query.beforeid) {
        var index = doc.posts.indexOf(this.query.beforeid);
        var pids = index >= 0 ? _.rest(doc.posts, index + 1) : [];
        if (pids.length < limit) {
            var cnt = limit - pids.length;
            var ids = yield getNewPostIds(this.session.user_id, doc.posts, cnt);
            doc.posts = [...doc.posts, ...ids];
            yield doc.save();
            pids = [...pids, ...ids];
        } else {
            pids = _.first(pids, limit);
        }
    } else {
        var pids = yield getNewPostIds(this.session.user_id, doc.posts, doc.posts.length > 0 ? 2: limit);
        doc.posts = [...pids, ...doc.posts];
        var min = parseInt(this.query.min) || 0;
        if (min > 0 && (pids.length < min))
            pids = _.first(doc.posts, min);
        yield doc.save();
    }

    // 取到本次的Feed流，并按照pids里面给的原始顺序重排
    var posts = yield findPostsByIds(this.session.user_id, pids);
    var post_map = _.object(posts.map(post=>post._id), posts);
    posts = pids.map((_id) => post_map[_id]);
    posts = _.filter(posts, post=>(post.status != 0));
    var feed_end = (posts.length > 0 || !this.query.beforeid) ? 0 : 1;

    // 获取Post的作者信息
    var user_ids = _.uniq(posts.map(post => post.user_id))
    var users = yield findUsersByIds(this.session.user_id, user_ids);

    // 获取语音是否已听
    var audio_ids = posts.map(post => post.audio_id);
    var audios = yield Audio.find({
        audio_id: { $in: audio_ids },
    }).select('audio_id reads').exec();

    this.body = {
        result: 'ok',
        actions: [
            createAction('update_feeds')({
                users,
                posts,
                audios: audios.map(audio=>Audio.toBrowser(audio, this.session.user_id)),
                concat: !!this.query.beforeid,
                feed_end,
            }),
            createAction('update_tooltip')(doc.tooltip_showed ? 0 : 1)
        ]
    }
}
