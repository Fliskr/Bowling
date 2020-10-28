import { makeAutoObservable, observable } from "mobx";
import { MAX_HIT } from "../helpers/constants";

export default class Frame {
    hit1 = 0;
    hit2 = 0;
    hit3 = 0;
    isStrike = false;
    isSpare = false;
    idx = 0;
    score = 0;
    gameScore = 0;
    constructor(hit1: number, hit2: number, hit3: number, idx: number) {
        makeAutoObservable(this, { score: observable });
        this.hit1 = hit1;
        this.hit2 = hit2;
        this.hit3 = hit3;
        this.idx = idx;
        this.isStrike = hit1 === MAX_HIT;
        this.isSpare = !this.isStrike && hit1 + hit2 === MAX_HIT;
    }
    get scoreFull(): string {
        return this.gameScore.toString();
    }
}
