cc.Class({
    extends: cc.Component,

    properties: {
        bgmAudio: {
            type: cc.AudioClip,
            default: [],
        },

        startWheel: {
            type: cc.AudioClip,
            default: null,
        },

        stopWheel: {
            type: cc.AudioClip,
            default: null,
        },

        clickEf: {
            type: cc.AudioClip,
            default: null,
        }
    },

    onLoad() {
        this.pInfo = require("PlayerInfo").getInstant;
    },

    start() {
        cc.audioEngine.stopAll();
        this.playBgm(0);
    },

    stopAudio() {
        cc.audioEngine.stopAll();
    },

    playBgm(id) {
        if (this.pInfo.musicControl == 0) {
            return;
        }
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(this.bgmAudio[id], true);
    },

    playClick() {
        this.playEf(this.clickEf);
    },

    playStartWheel() {
        this.playEf(this.startWheel);
    },

    playStopWheel() {
        this.playEf(this.stopWheel);
    },

    playEf(clip) {
        if (this.pInfo.soundEffectControl == 0) {
            return;
        }
        cc.audioEngine.playEffect(clip);
    },
})