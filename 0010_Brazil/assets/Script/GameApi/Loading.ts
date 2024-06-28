// import { _decorator, Component, director, find, game, Game, instantiate, JsonAsset, Label, Node, Prefab, ProgressBar, Size, SpriteFrame, UITransform, Vec3 , screen} from 'cc';
import { LabelTranslator } from '../utils/LabelTranslator';
import { GameGlobal } from '../utils/GameGlobal';
// import { GameGlobal } from './Util/GameGlobal';
// import { cryptoStraa, getBrowserValue, loadingMask, reloadDlg, TranslateText } from './Util/CommonUtils';
// import { LabelTranslator } from './LabelTranslator';
// import { NetWork } from './Util/NetWork';
// import { Toast } from '../components/Toast/Toast';
// import { uniGoLogin } from './Util/UniInterface';
const { ccclass, property } = cc._decorator;

@ccclass('Laoding')
export class Laoding extends cc.Component {

    @property(cc.ProgressBar)
    progressBarView: cc.ProgressBar

    @property(LabelTranslator)
    progressBarLabel: LabelTranslator
    over: boolean = false;

    @property(Node)
    openGameNode: Node

    @property(cc.JsonAsset)
    translateJson: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_zh_TW: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_af: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_ar: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_el: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_es: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_hi: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_it: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_ja: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_ko: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_pt: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_vi: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_fa: cc.JsonAsset = null!;

    @property(cc.JsonAsset)
    translateJson_ru: cc.JsonAsset = null!;

    @property(cc.Prefab)
    prefLoading: cc.Prefab = null;

    @property(cc.Prefab)
    toastBg: cc.Prefab = null;

    @property(cc.SpriteFrame)
    headSpr1: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr2: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr3: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr4: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr5: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr6: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr7: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr8: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr9: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr10: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr11: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr12: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr13: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr14: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr15: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr16: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr17: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr18: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr19: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    headSpr20: cc.SpriteFrame;


    getBrowserValue(value) {
        var params = {}
        var query = window.location.search.substring(1).split("&");
        for (var i = 0; i < query.length; i++) {
            var pair = query[i].split("=");
            if (pair.length == 2) {
                params[pair[0]] = pair[1]
            }
        }
        if (value) {
            return params[value] || null
        }
        return params;
    }


    protected onLoad(): void {
        // console.log("vb1.6.2")
        // console.log("ref", window.location.href)

        GameGlobal.prefLoading = this.prefLoading
        GameGlobal.toastBg = this.toastBg;

        this.progressBarView.progress = 0;
        // console.log("screen.height", screen)

        // this.progressBarLabel.setLabelValue([" " + 0 + '%'])
        // console.log("this.node.contentSize", find("Canvas").getComponent(UITransform).contentSize)
        // this.openGameNode.on(Node.EventType.TOUCH_START, this.openGame, this);

        let token = this.getBrowserValue("t");
        let platform = this.getBrowserValue("platform");
        // let clearTrans = this.getBrowserValue("clearTrans") == "true";


        GameGlobal.host =  window.location.host;
        console.log("token", token);
        console.log("platform", platform);
  
        if (!platform)
            platform = "h5"

        GameGlobal.token = token;
        
        GameGlobal.platform = platform;

        // GameGlobal.clearTrans = clearTrans;

        const jsonData: object = this.translateJson.json!;
        const jsonData_tw: object = this.translateJson_zh_TW.json!;

        
        if (typeof Object.assign != 'function') {
            Object.assign = function (target) {
            // 'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
        
            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                    }
                }
                }
            }
            return target;
            };
        }

        for (let key in jsonData) {
            // console.log("key", key);
            jsonData[key] = Object.assign(jsonData[key], jsonData_tw[key])
        }

        let lang = !this.getBrowserValue("lang") ? "en" : String(this.getBrowserValue("lang")).toLowerCase();
        
        
        if (this.getBrowserValue("lang") && lang != "zh-cn") {
            if (this["translateJson_" + lang]) {
                let jdata: object = this["translateJson_" + lang].json!;
                console.log("jdata", jdata)
                if (this["translateJson_" + lang]) {
                    for (let key in jsonData) {
                        jsonData[key] = Object.assign(jsonData[key], jdata[key])
                    }
                }
            }
        }
            
        GameGlobal.translateObject = jsonData;
        console.log("jsonData", jsonData)
        console.log("lang", lang)
        if (lang == "zh-tw") {
            lang = "zh-TW"
        } else if (lang == "cn") {
            lang = "cn"
        }

        if (!lang) {
            lang = "en"
        }
        GameGlobal.LANG = lang;
    
    }

    protected start(): void {
    }


}

