module.exports.hitContainer = function(event, domNode) {
    let target = event.target;
    if(target == domNode || domNode.contains(target)) {
        return true;
    }

    return false;
}