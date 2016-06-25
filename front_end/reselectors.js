import { createSelector } from 'reselect'
import _ from 'underscore';

export const get_feed_ids = (state) => state.feed_ids
export const get_feed_end = (state) => state.feed_end
export const get_user_post_ids = (state) => state.user_post_ids
export const get_notifications = (state) => state.notifications
export const get_subids = (state) => state.subids
export const get_posts = (state) => state.posts
export const get_users = (state) => state.users
export const get_audios = (state) => state.audios
export const get_post_details = (state) => state.post_details
