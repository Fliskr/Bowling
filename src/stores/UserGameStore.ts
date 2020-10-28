import { makeAutoObservable } from "mobx";
import Frame from "./FrameStore";

export default class UserGameStore {
    constructor(name: string) {
        makeAutoObservable(this);
        this.name = name;
    }
    step = 0;
    name = "";
    plays: Frame[] = [];
    finished = false;
    get score(): number {
        return this.plays.reduce((fs, { score }) => {
            return fs + score;
        }, 0);
    }
    hits(hit1 = 0, hit2 = 0, hit3 = 0) {
        if (this.finished) {
            return;
        }
        this.step++;
        this.plays.push(new Frame(hit1, hit2, hit3, this.plays.length + 1));
        let gameScore = 0;
        this.plays.forEach((play, idx, plays) => {
            play.score = play.hit1 + play.hit2;
            if (play.isSpare) {
                const nextPlay = plays.length > idx + 1 && plays[idx + 1];
                if (nextPlay) {
                    play.score += nextPlay.hit1;
                }
                if (idx === 9) {
                    play.score += play.hit3;
                }
            }
            if (play.isStrike) {
                let nextPlay = plays.length > idx + 1 && plays[idx + 1];

                if (nextPlay) {
                    play.score += nextPlay.hit1;
                    if (nextPlay.isStrike && idx !== 8) {
                        const nextPlay =
                            plays.length > idx + 2 && plays[idx + 2];
                        if (nextPlay) {
                            play.score += nextPlay.hit1;
                        }
                    } else {
                        play.score += nextPlay.hit2;
                    }
                }

                if (idx === 9) {
                    play.score = hit1 + hit2 + hit3;
                }
            }
            gameScore += play.score;
            play.gameScore = gameScore;
        });
        if (this.step === 10) {
            this.finished = true;
        }
    }

    reset(cb?: Function) {
        this.plays = [];
        this.step = 0;
        this.finished = false;
        if (cb) {
            for (let i = 0; i < 10; i++) {
                cb();
            }
        }
    }
}
