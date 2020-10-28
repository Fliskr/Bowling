import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import { MAX_HIT, MAX_STEP } from "../helpers/constants";
import { random } from "../helpers/random";
import Frame from "../stores/FrameStore";
import UserGameStore from "../stores/UserGameStore";

const UsersList = styled.div`
    display: flex;
    flex-direction: row;
    min-height: 60px;
    flex-wrap: wrap;
`;

const Layout = styled.div`
    display: flex;
    flex-direction: column;
    padding: 12px;
    border: 1px solid lightgray;
    margin: 12px 0;
`;

const GameFrame = styled.div<{ borderColor: string }>`
    border: 2px solid ${({ borderColor }) => borderColor};
    flex: 0 1 80px;
    width: 60px;
    margin-right: 4px;
    margin-top: 4px;
    height: 80px;
    h2 {
        display: flex;
        justify-content: center;
        border-bottom: 1px solid black;
        height: 20px;
        padding: 0;
        margin: 0;
        font-size: 18px;
    }
`;

const Hits = styled.div`
    display: flex;
    justify-content: space-around;
    div {
        width: 50px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    div:not(:first-of-type) {
        border-left: 1px solid black;
        border-bottom: 1px solid black;
    }
`;

const Dice = styled.span`
    cursor: pointer;
    font-size: 26px;
    line-height: 26px;
    color: silver;
    margin-left: 4px;
    user-select: none;
`;

const FullScore = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 4px;
`;

export type TUserGame = {
    user: UserGameStore;
};

const UserGame = ({ user }: TUserGame) => {
    const generateRandomHit = () => {
        const playsLength = user.plays.length;
        const hit1 = random(11);
        let hit2, hit3;
        if (playsLength < MAX_STEP - 1) {
            hit2 = random(11 - hit1);
        }
        if (playsLength === MAX_STEP - 1) {
            if (hit1 === MAX_HIT) {
                hit2 = random(11);
                hit3 = random(11 - hit2);
            } else {
                hit2 = random(11 - hit1);
                if (hit1 + hit2 === MAX_HIT) {
                    hit3 = random(11);
                }
            }
        }
        user.hits(hit1, hit2, hit3);
    };

    const hits = ({ hit1, hit2, hit3, idx }: Frame) => {
        const hits = ["", ""];

        if (idx === MAX_STEP) {
            if (hit1 === MAX_HIT) {
                hits[0] = "X";
            } else {
                hits[0] = hit1.toString();
            }
            if (hit2 === 10) {
                hits[1] = "X";
            } else if (hit1 !== MAX_HIT && hit1 + hit2 === MAX_HIT) {
                hits[1] = "/";
            } else {
                hits[1] = hit2.toString();
            }
            if (hit3 === 10) {
                hits.push("X");
            } else {
                hits.push(hit3.toString() || "0");
            }
        } else {
            if (hit1 !== MAX_HIT) {
                hits[0] = hit1.toString();
            }
            if (hit1 === MAX_HIT) {
                hits[1] = "X";
            } else if (hit1 + hit2 === MAX_HIT) {
                hits[1] = "/";
            } else {
                hits[1] = hit2.toString();
            }
        }
        return (
            <Hits>
                {hits.map((item, idx) => (
                    <div key={idx}>{item}</div>
                ))}
            </Hits>
        );
    };
    return (
        <Layout>
            <div>
                {user.name}
                <Dice onClick={() => generateRandomHit()}>
                    {String.fromCharCode(9861)}
                </Dice>
                <Dice
                    onClick={(e) => {
                        e.stopPropagation();
                        user.reset();
                    }}
                >
                    {"\u21BA"}
                </Dice>
            </div>
            <div>Score: {user.score} </div>
            <UsersList>
                {user.plays.map((play: Frame, idx) => (
                    <GameFrame
                        key={idx}
                        borderColor={
                            play.isStrike
                                ? "gold"
                                : play.isSpare
                                ? "brown"
                                : "#000"
                        }
                    >
                        <h2>{play.idx}</h2>
                        {hits(play)}
                        <FullScore>{play.scoreFull}</FullScore>
                    </GameFrame>
                ))}
            </UsersList>

            <hr />
        </Layout>
    );
};

export default observer(UserGame);
