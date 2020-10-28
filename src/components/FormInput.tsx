import React from "react";
import { FieldError, UseFormMethods, ValidationRules } from "react-hook-form";
import styled from "styled-components";

export interface IFormInput {
    id: string;
    disabled: boolean;
    type: string;
    step?: number;
    placeholder: string;
    label: string;
    register: UseFormMethods["register"];
    registerObject: ValidationRules;
    error?: FieldError | null;
}

const Layout = styled.div`
    position: relative;
    padding-bottom: 14px;
`;

const Error = styled.div`
    color: #c00;
    font-size: 12px;
    margin-top: 10px;
    position: absolute;
    bottom: 0px;
`;

const Input = styled.input<{ error?: boolean }>`
    border: 1px solid ${({ error }) => (error ? "#e88" : "#000")};
    padding: 4px;
    border-radius: 5px;
    &:focus {
        outline: none;
        border-width: 1px;
    }
`;

const FormInput = ({
    id,
    type,
    step = 0,
    disabled,
    registerObject,
    register,
    placeholder,
    label,
    error,
}: IFormInput) => {
    let msg = "";
    if (error) {
        switch (error.type) {
            case "min":
                msg = "Input number should be more or equal than 0";
                break;
            case "max":
                msg = "Input number should be less or equal than 10";
                break;
            case "validate":
                msg = error.message || "Validation failed";
                break;
            case "required":
                msg = "Required field";
                break;
            default:
                msg = "Incorrect input";
        }
    }
    return (
        <Layout>
            <label htmlFor={id}>{label}</label>
            <Input
                type={type}
                step={step}
                disabled={disabled}
                placeholder={placeholder}
                id={id}
                name={id}
                ref={register(registerObject)}
                error={!!error}
            />
            {msg && <Error>*{msg}</Error>}
        </Layout>
    );
};

export default FormInput;
