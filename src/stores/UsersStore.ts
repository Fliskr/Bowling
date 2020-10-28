import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import UserGameStore from "./UserGameStore";

export class Users {
    users: UserGameStore[] = [];
    constructor(users: UserGameStore[]) {
        makeAutoObservable(this);
        this.users = users;
    }
}

export default createContext(
    new Users([
        new UserGameStore("Jack"),
        new UserGameStore("Don"),
        new UserGameStore("Andy"),
    ])
);
