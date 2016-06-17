module.exports = function(context) {
    const userAgent = context.navigator.userAgent || context.navigator.vendor || context.opera;
    const isIPhone = userAgent.match(/iPhone/i);
    context.setTitle = function(title) {
        if (context.document.title != title) {
            context.document.title = title;

            if (isIPhone) {
                var iframe = context.document.createElement('iframe');
                iframe.style.visibility = 'hidden';
                iframe.style.width = '1px';
                iframe.style.height = '1px';
                iframe.src = "/favicon.ico";
                iframe.onload = function () {
                    setTimeout(function () {
                        context.document.body.removeChild(iframe);
                    }, 0);
                };
                context.document.body.appendChild(iframe);
            }
        }
    }
}(window);
