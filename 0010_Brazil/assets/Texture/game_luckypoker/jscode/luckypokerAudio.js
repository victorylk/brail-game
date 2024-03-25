cc.Class({
    extends: cc.Component,

    properties: {
        bgmAudio: {
            type: cc.AudioClip,
            default: [],
        },
        efAudio: {
            type: cc.AudioClip,
            default: [],
        },
    },

    onLoad() {
        this.pInfo = require("PlayerInfo").getInstant;
    },

    start() {
        cc.audioEngine.stopAll();
        this.playBgm(0);
    },

    stopAudio(){
        cc.audioEngine.stopAll();
    },

    playBgm(id) {
        if (this.pInfo.musicControl == 0) {
            return;
        }
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(this.bgmAudio[id], true);
    },
    playEffect (id) {
        this.playEf(this.efAudio[id]);
    },
    
    playEf(clip) {
        if (this.pInfo.soundEffectControl == 0) {
            return;
        }
        cc.audioEngine.playEffect(clip);
    },
})