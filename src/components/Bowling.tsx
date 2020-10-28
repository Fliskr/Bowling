import React, { useContext, useState } from "react";
import { observer } from "mobx-react";
import { useForm } from "react-hook-form";
import UsersStore from "../stores/UsersStore";
import UserGameStore from "../stores/UserGameStore";
import UserGame from "./UserGame";
import Button from "./Button";
import Select from "./Select";
import styled from "styled-components";
import FormInput from "./FormInput";
import { MAX_HIT } from "../helpers/constants";

type FormData = {
    hit1: number;
    hit2: number;
    hit3: number;
};

const Layout = styled.div`
    margin: 12px;
    form {
        border: 1px solid lightgray;
        padding: 12px;
    }

    label {
        display: inline-block;
        font-size: 14px;
        margin-right: 12px;
        margin-top: 12px;
        min-width: 150px;
    }
`;

const BowlingGame = () => {
    const usersStore = useContext(UsersStore);
    const { users } = usersStore;
    const { register, handleSubmit, errors, getValues } = useForm<FormData>();
    const [user, setUser] = useState<UserGameStore>(users[0]);
    const onSubmit = handleSubmit(({ hit1, hit2, hit3 }) => {
        user.hits(+hit1, +hit2, +hit3);
    });
    const winner =
        users.every((user) => user.finished) &&
        users.reduce((winner, user) => {
            if (!winner || winner.score < user.score) {
                return user;
            }
            return winner;
        });
    return (
        <Layout>
            <form onSubmit={onSubmit}>
                <Button
                    onClick={() => users.forEach((user) => user.reset())}
                    type="button"
                >
                    Reset all
                </Button>
                <label htmlFor="user">Select user:</label>
                <Select
                    name="user"
                    id="user"
                    onChange={(e) => {
                        const newUser =
                            users.find(
                                (user) => e.target.value === user.name
                            ) || users[0];
                        setUser(newUser);
                    }}
                >
                    {users.map((user) => (
                        <option
                            key={user.name}
                            value={user.name}
                            onClick={(e) => console.log(e)}
                        >
                            {user.name}
                        </option>
                    ))}
                </Select>
                <FormInput
                    error={errors.hit1}
                    type="number"
                    placeholder="0-10"
                    registerObject={{ required: true, max: 10, min: 0 }}
                    register={register}
                    label="Hit 1:"
                    id="hit1"
                    disabled={user.step > 9}
                />
                <FormInput
                    error={errors.hit2}
                    type="number"
                    id="hit2"
                    placeholder="0-10, but summ of hit1 and hit should be below 11"
                    disabled={user.step > 9}
                    label="Hit 2:"
                    register={register}
                    registerObject={{
                        required: true,
                        max: 10,
                        min: 0,
                        validate: (value) => {
                            if (
                                user.step === 9 &&
                                getValues().hit1 === MAX_HIT
                            ) {
                                return value >= 0 && value <= MAX_HIT;
                            }
                            return MAX_HIT - getValues().hit1 - value >= 0
                                ? true
                                : `Summ of hit 1 and hit 2 shouldn't be more than ${MAX_HIT}.`;
                        },
                    }}
                />
                <FormInput
                    error={errors.hit3}
                    type="number"
                    placeholder="0-10"
                    register={register}
                    registerObject={{ required: false, max: 10, min: 0 }}
                    label="Hit 3:"
                    id="hit3"
                    disabled={user.step !== 9}
                />
                <Button type="submit">Submit</Button>
            </form>
            <h2>
                {winner
                    ? `${winner.name} wins with scores of ${winner.score}`
                    : "Finish all games to see who wins"}
            </h2>
            {users.map((user: UserGameStore) => (
                <UserGame key={user.name} user={user} />
            ))}
        </Layout>
    );
};

export default observer(BowlingGame);
