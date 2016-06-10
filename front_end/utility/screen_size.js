// TODO: 调用screen_size的地方都必须实时调用
module.exports = function () {
    if (typeof window == 'undefined') return {width: 1440, height: 900};

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;
    return {width: x, height: y};
}
