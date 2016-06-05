import ms from 'ms';
import ObjectId from 'bson/lib/bson/objectid'

export function fromObjectId(_id) {
    var d = new Date() - ObjectId(_id).getTimestamp();
    if (d <= ms('1m')) {
        return '刚刚';
    } else if (d <= ms('1h')) {
        return `${Math.floor(d / ms('1m'))}分钟前`;
    } else if (d <= ms('1d')) {
        return `${Math.floor(d / ms('1h'))}小时前`;
    } else if (d <= ms('7d')) {
        return `${Math.floor(d / ms('1d'))}天前`;
    } else if (d <= ms('30d')) {
        return `${Math.floor(d / ms('7d'))}周前`;
    } else if (d <= ms('365d')) {
        return `${Math.floor(d / ms('30d'))}月前`;
    } else {
        return `${Math.floor(d / ms('365d'))}年前`;
    }
}
