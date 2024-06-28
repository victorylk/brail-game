// import { Prefab, Size, SpriteFrame } from "cc";
// import { AudioInterface } from "../AudioManager";
// import { GameUserInfo } from "./GameUserInfo";
// import { GameCtrlInterface } from "../GameMain";
// import { AreaBetInfo, Bet, EnumGameState, PlayerInfoRes, RoomConfig, RoomInfoRes } from "./Const";


export class GameGlobal {

    constructor() {

    }

    public static INST: GameGlobal = new GameGlobal;

    public realSize: cc.Size = new cc.Size(0, 0)

    public realRatio: number
    
    // public static audioInterface?: AudioInterface

    // public static gameStateControl?: GameCtrlInterface;

    // public static currentGameState: EnumGameState = EnumGameState.Unknow;

    public static translateObject: object = null;

    // public static roomInfoCofig: [RoomConfig] = null;

    // public static playerInfo: PlayerInfoRes = null;

    public static LANG: string = "en";
    
    // public static playerInfos: [PlayerInfoRes] = null;
    // public static lastRoomInfoRes: RoomInfoRes = null;
    // public static lastBetInfo: [AreaBetInfo] = null;

    public static avatars: cc.SpriteFrame[] = [];

    public static token: string = "";

    public static platform: string = "";

    public static prefLoading: cc.Prefab = null;

    public static toastBg: cc.Prefab = null;

    public static prefReload: cc.Prefab = null;

    public static loadingNetWork: boolean = false;

    public static clearTrans: boolean = false;

    public static host: string = "";

    public static GameType: number = 1;
    public static bMusic: boolean = true;
    public static bEffect: boolean = true;
    public static bDanmu: boolean = true;
    
    public static prizePoolInfo: any = null;
}


