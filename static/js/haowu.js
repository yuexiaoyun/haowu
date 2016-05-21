wx.ready(function () {
    var recording = false;
    var voice = {
      localId: '',
      serverId: ''
    };
    var pic = {
        localId: '',
        serverId: ''
    };
    function refresh() {
        if (recording) {
            $('#audio').text('停止录音');
        } else {
            $('#audio').text(voice.localId ? '重新录音' : '开始录音');
        }
        if (voice.localId) {
            $('#audio_play').show();
        } else {
            $('#audio_play').hide();
        }
        if (pic.localId) {
            $('#pic_show').attr('src', pic.localId);
            $('#pic_show').show();
            $('#pic').text('重新拍照');
        } else {
            $('#pic_show').hide();
            $('#pic').text('拍照');
        }
    }
    $('#audio_play').click(function() {
        wx.playVoice({
          localId: voice.localId
        });
    });
    $('#audio').click(function () {
        if (!recording) {
            wx.startRecord({
                cancel: function () {
                    recording = false;
                    refresh();
                }
            });
            recording = true;
            voice.localId = '';
            refresh();
        } else {
            wx.stopRecord({
                success: function (res) {
                    voice.localId = res.localId;
                    recording = false;
                    refresh();
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        }
    });
    $('#pic').click(function() {
        wx.chooseImage({
            count: 1, 
            success: function (res) {
                pic.localId = res.localIds[0];
                refresh();
            }
        });
    });
});

wx.error(function (res) {
  alert(res.errMsg);
});
