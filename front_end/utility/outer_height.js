module.exports = function(elm) {
    var elmHeight, elmMargin;
    if(document.all) {// IE
        elmHeight = elm.currentStyle.height;
        elmMargin = parseInt(elm.currentStyle.marginTop, 10) + parseInt(elm.currentStyle.marginBottom, 10);
    } else {// Mozilla
        elmHeight = document.defaultView.getComputedStyle(elm, '').getPropertyValue('height');
        elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) +
            parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom'));
    }

    elmHeight = elmHeight.replace(/px/, '');
    elmHeight = parseInt(elmHeight);
    return (elmHeight + elmMargin);
}