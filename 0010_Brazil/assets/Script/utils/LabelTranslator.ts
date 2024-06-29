import { GameGlobal } from "./GameGlobal";

const { ccclass, property } = cc._decorator;

@ccclass('Translator')
export class LabelTranslator extends cc.Component {
    @property(cc.String)
    key: String = ""

    value: string[] = []
    format: string = `{0}`


    protected onLoad(): void {
        
        // console.log("key", this.key)
        
        // console.log("need translate label:", this.key, GameGlobal.LANG,  GameGlobal.translateObject[String(this.key)])
        if (GameGlobal.translateObject[String(this.key)])
            this.node.getComponent(cc.Label).string = GameGlobal.translateObject[String(this.key)][GameGlobal.LANG]
        else {
                    console.warn("key", this.key)
        }
    }
    start() {
    }

  
}


