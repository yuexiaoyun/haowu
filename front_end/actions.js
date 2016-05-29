export function takePic(localId) {
    return {
        type: 'take_pic',
        id: localId
    }
}

export function playSound(id) {
    return {
        type: 'play_sound',
        id: id
    }
}

export function stopPlay(id) {
    return {
        type: 'stop_play',
        id: id
    }
}
