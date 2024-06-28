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
            this.setLabelFormat(GameGlobal.translateObject[String(this.key)][GameGlobal.LANG])
        else {
                    console.warn("key", this.key)
        }
    }
    start() {
    }

    setLabelFormat(format: string) {
        // console.log("key", this.key)
        // console.log("setLabelFormat", this.format)
        this.format = format;
        this.node.getComponent(cc.Label).string = this.formatString(this.format, ...this.value)
    }

    setLabelValue(label: string[]) {
        this.value = []
        this.value.push(...label);
        this.node.getComponent(cc.Label).string = this.formatString(this.format, ...this.value)
    }

    formatString(str: string, ...args: any[]): string {
        return str.replace(/\{(\d+)\}/g, (match, index) => {
            return typeof args[index] !== "undefined" ? args[index] : match;
        });
    }

}


