
const { ccclass, property } = cc._decorator;

enum AdapterType {
    NONE,
    CONTENT,
    BACKGROUND,
    CANVAS,
    NODE,
}

cc.Enum(AdapterType)
enum EnumSwitchType {
    ON,
    OFF
}

enum EnumFitType {
    FIT_NONE,
    FIT_HEIGHT,
    FIT_WIDTH,
    FIT_SHOWALL,
}
@ccclass
export default class CAdapterCompent extends cc.Component {
    /**
     * a
     */
    @property(cc.Widget)
    Widget: cc.Widget = null;

    _widget: cc.Widget
    // LIFE-CYCLE CALLBACKS:
    @property({ type: AdapterType, tooltip: "适配模式： \n注.部分模式只有开启SHOW_ALL模式才会有效适配\n0.NONE:不使用（你可以删了） \n1.BACKGROUND:只适用背景图适配(按最大宽高比缩放) \n2.CONTENT:内容适配:只适用全屏大小的节点适配 \n (注:使用此模式不勾选Widget组件) \n3.CANVAS:(只适用Canvas节点)场景适配动态选取宽高适配 \n4.NODE:目前只用于小地图的刘海适配" })
    AdapterMode: AdapterType = AdapterType.CONTENT

    @property()
    private _fitType: EnumFitType = EnumFitType.FIT_HEIGHT;
    @property({
        type: cc.Enum(EnumFitType),
        tooltip: "适配类型",
        visible() {
            return this.AdapterMode == AdapterType.BACKGROUND
        },
    })
    set FitType(value: EnumFitType) {
        this._fitType = value;
    }


    get FitType(): EnumFitType {
        return this._fitType
    }

    @property()
    _bOpenAdapterBangs: boolean = true
    @property({
        type: cc.Boolean,
        tooltip: "是否开启该节点刘海适配",
        visible() {
            return this.AdapterMode == AdapterType.NODE || this.AdapterMode == AdapterType.CONTENT
        },
        displayName: "OpenAdapterBangs"

    })
    set bOpenAdapterBangs(val: boolean) {
        if (val == false) {
            this.node.y = 0;
        }
        this._bOpenAdapterBangs = val
    }

    get bOpenAdapterBangs() {
        return this._bOpenAdapterBangs
    }

    private nOriginalY: number;


    onLoad() {

    }

    start() {
        this._widget = this.Widget
        if (this._widget) {
            this._widget.enabled = false;
            this._widget.updateAlignment()
        }
        switch (this.AdapterMode) {
            case AdapterType.BACKGROUND:
                this.adapterBackground();
                break;
            case AdapterType.CONTENT:
                // cc.view.setResizeCallback(() => this.adapterContent());
                cc.game.on("Resize", this.adapterContent, this)
                this.adapterContent();
                break;
            case AdapterType.CANVAS: {
                //监听窗口大小变化时的回调，每次窗口变化都要自动适配
                // cc.view.setResizeCallback(() => this.screenAdapter());
                cc.game.on("Resize", this.screenAdapter, this)
                this.screenAdapter();
                break;
            }
            case AdapterType.NODE: {
                //监听窗口大小变化时的回调，每次窗口变化都要自动适配
                // cc.view.setResizeCallback(() => this.adapterCompent());
                cc.game.on("Resize", this.adapterCompent, this)
                this.adapterCompent();
                break;
            }
            default:
                break;
        }
        // if (this.NodePosition == NodePositionType.DEFAULT) {
        //     this.node.setPosition(0, 0);
        //     this.node.setAnchorPoint(0.5, 0.5);
        // }
        cc.view.setResizeCallback(() => cc.game.emit("Resize"));

        // 横屏移除组件
        if (this._widget && this.isLandscape()) {
            this._widget.node.removeComponent(cc.Widget)
        }
    }

    adapterBackground() {
        let self = this;
        function showAll() {
            // 1. 先找到 SHOW_ALL模式适配之后，本节点的实际宽高以及初始缩放值
            let scaleForShowAll = Math.min(
                cc.view.getCanvasSize().width / self.node.width,
                cc.view.getCanvasSize().height / self.node.height
            );
            let realWidth = self.node.width * scaleForShowAll;
            let realHeight = self.node.height * scaleForShowAll;

            // 2. 基于第一步的数据，再做缩放适配
            self.node.scale = Math.max(
                cc.view.getCanvasSize().width / realWidth,
                cc.view.getCanvasSize().height / realHeight
            );
        }

        function fitWidth() {//宽度固定
            let scaleForShowAll = cc.view.getFrameSize().height / self.node.height

            let realHeight = self.node.height * scaleForShowAll;
            self.node.scale = cc.view.getCanvasSize().height / realHeight;
        }

        function fitHeight() {//高度固定
            let scaleForShowAll = cc.view.getCanvasSize().width / self.node.width

            let realWidth = self.node.width * scaleForShowAll;
            self.node.scale = cc.view.getCanvasSize().width / realWidth;
        }

        switch (this.FitType) {
            case EnumFitType.FIT_HEIGHT: { }
                fitHeight()
                break;
            case EnumFitType.FIT_WIDTH:
                fitWidth()
                break;
            case EnumFitType.FIT_SHOWALL:
                showAll()
                break;
            default:
                break;
        }
    }

    adapterContent() {
        if (!this.node) {
            cc.game.off("Resize")
            return
        }

        // 1. 先找到 SHOW_ALL 模式适配之后，本节点的实际宽高以及初始缩放值
        let srcScaleForShowAll = Math.min(
            cc.view.getCanvasSize().width / this.node.width,
            cc.view.getCanvasSize().height / this.node.height
        );
        let realWidth = this.node.width * srcScaleForShowAll;
        let realHeight = this.node.height * srcScaleForShowAll;

        // 2. 基于第一步的数据，再做节点宽高重置
        this.node.width = this.node.width * (cc.view.getCanvasSize().width / realWidth);
        this.node.height = this.node.height * (cc.view.getCanvasSize().height / realHeight);

        let designSize = cc.view.getDesignResolutionSize()
        if (this.node.width > designSize.width || this.node.height > designSize.height) {
            let size = cc.view.getCanvasSize() //当前分辨率
            let nShowAll = size.height / size.width
            if (nShowAll < 1.56) {
                nShowAll = 1.56;
            }
            if (nShowAll > 2.22) {
                nShowAll = 2.22;
            }
            if (this.node.width > designSize.width) {
                if (nShowAll < (16 / 9)) {
                    // this.node.width = designSize.height / nShowAll;
                }
            }
            if (this.node.height > designSize.height) {
                if (nShowAll > (16 / 9)) {
                    this.node.height = designSize.width * nShowAll;
                }
            }
            let tCanvas = cc.Canvas.instance.node
            if (!tCanvas.getComponent(cc.Mask)) {
                tCanvas.addComponent(cc.Mask)
                tCanvas.getComponent(cc.Widget) && (tCanvas.getComponent(cc.Widget).enabled = false);
            }
            tCanvas.setContentSize(this.node.getContentSize())
        }


        //3.刘海适配
        this.nOriginalY = this.node.y
        if (this.bOpenAdapterBangs) {
            this.adapterBangs();
        }
    }


    screenAdapter() {
        // //当前屏幕分辨率比例
        // let screenRatio = cc.view.getFrameSize().width / cc.view.getFrameSize().height;
        // //设计稿分辨率比例
        let designRatio = cc.Canvas.instance.designResolution.width / cc.Canvas.instance.designResolution.height;

        // if (screenRatio <= 1) {
        //     //屏幕高度大于或等于宽度,即竖屏
        //     if (screenRatio <= designRatio) {
        //         this.setFitWidth();
        //     } else {
        //         //此时屏幕比例大于设计比例
        //         //为了保证纵向的游戏内容不受影响，应该使用 fitHeight 模式
        //         this.setFitHeight();
        //         this.adapterContent();
        //     }
        // } else {
        //     //屏幕宽度大于高度,即横屏
        //     this.setFitHeight();
        // }

        let screenRatio = cc.view.getFrameSize().height / cc.view.getFrameSize().width;
        if (screenRatio < 1.56) {
            //屏幕宽度大于高度,即横屏
            this.setFitHeight();
        } else if (screenRatio > 2.222) {
            //屏幕高度大于或等于宽度,即竖屏
            this.setFitWidth();
        } else {
            if (screenRatio < 16 / 9) {
                this.setFitHeight();
            } else {
                this.setFitWidth();
            }
        }
        this.adapterContent();
    }

    /**是否横屏 */
    isLandscape() {
        let bLandscape = false
        // //当前屏幕分辨率比例
        let screenRatio = cc.view.getFrameSize().width / cc.view.getFrameSize().height;
        // //设计稿分辨率比例
        let designRatio = cc.Canvas.instance.designResolution.width / cc.Canvas.instance.designResolution.height;
        if (screenRatio > 1) {
            bLandscape = true
        } else {
            if (screenRatio > designRatio) {
                bLandscape = true
            }
        }
        return bLandscape
    }

    setFitWidth() {
        cc.Canvas.instance.fitHeight = false;
        cc.Canvas.instance.fitWidth = true;
    }

    setFitHeight() {
        cc.Canvas.instance.fitHeight = true;
        cc.Canvas.instance.fitWidth = false;
    }

    adapterCompent() {
        // let scaleForShowAll = Math.min(
        //     cc.Canvas.instance.designResolution.width / cc.view.getFrameSize().width,
        //     cc.Canvas.instance.designResolution.height / cc.view.getFrameSize().height
        // );
        // this.node.scale = scaleForShowAll
        if (this.bOpenAdapterBangs) {
            this.adapterNodeBangs();
        }

    }

    getBangsHeight() {
        let tRect = cc.sys.getSafeAreaRect();
        let tWinSize = cc.winSize
        let DELT_SCREEN_SIZE_HEIGHT = cc.view.getCanvasSize().height * (75 / 1280) //test
        if (cc.sys.platform == cc.sys.IPHONE) {
            DELT_SCREEN_SIZE_HEIGHT = (tWinSize.height - tRect.height) / 2;
        }
        else if (cc.sys.platform == cc.sys.ANDROID) {
            DELT_SCREEN_SIZE_HEIGHT = (tWinSize.height - tRect.height) / 2;
        }
        else if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            DELT_SCREEN_SIZE_HEIGHT = (tWinSize.height - tRect.height) / 2;
        }
        else if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
            DELT_SCREEN_SIZE_HEIGHT = 34 //bottom
        }
        else {
            DELT_SCREEN_SIZE_HEIGHT = 0
            // DELT_SCREEN_SIZE_HEIGHT = cc.view.getCanvasSize().height * (75 / 1280) //测试
        }
        DELT_SCREEN_SIZE_HEIGHT = Math.floor(DELT_SCREEN_SIZE_HEIGHT)
        return DELT_SCREEN_SIZE_HEIGHT
    }

    adapterBangs() {
        let DELT_SCREEN_SIZE_HEIGHT = this.getBangsHeight();

        if (DELT_SCREEN_SIZE_HEIGHT > 0) {
            // this.node.y = this.node.y - DELT_SCREEN_SIZE_HEIGHT / 2
            if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
                this.node.height = this.node.height - DELT_SCREEN_SIZE_HEIGHT;
                this.node.y = this.node.y + DELT_SCREEN_SIZE_HEIGHT / 2
            }
            else {
                if (this.node.name != "Canvas") {
                    let tRect = cc.sys.getSafeAreaRect();
                    this.node.height = cc.winSize.height - DELT_SCREEN_SIZE_HEIGHT;
                    if (tRect.y > 0) {
                        this.node.y = -DELT_SCREEN_SIZE_HEIGHT * 0.5;
                    } else {
                        this.node.y = -DELT_SCREEN_SIZE_HEIGHT;
                    }
                }
            }
        }
    }

    adapterNodeBangs() {
        let DELT_SCREEN_SIZE_HEIGHT = this.getBangsHeight()

        if (DELT_SCREEN_SIZE_HEIGHT > 0) {
            this.node.y = this.node.y - DELT_SCREEN_SIZE_HEIGHT
        }
    }

    // update(dt) {
    //     // this.adapterContent()
    // }
}
