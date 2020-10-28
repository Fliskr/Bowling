import styled from "styled-components";

export type IButton = {
    width?: string;
    height?: string;
    color?: string;
    fontSize?: string;
};

const Button = styled.button<IButton>`
    width: ${({ width = "150px" }) => width};
    height: ${({ height = "26px" }) => height};
    border-radius: 5px;
    color: ${({ color = "#333" }) => color};
    font-size: ${({ fontSize = "14px" }) => fontSize};
    font-weight: bolder;
    margin-top: 12px;
    border: none;
    background-color: rgba(55, 55, 155, 0.25);
    display:block;
`;

export default Button;
