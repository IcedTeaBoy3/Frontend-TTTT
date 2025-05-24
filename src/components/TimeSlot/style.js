import styled from "styled-components";
import { Button } from "antd";
export const CustomButton = styled(Button)`
    font-weight: ${({$isSelected}) => ($isSelected ? "bolder" : "500")};
    background-color: ${({$isSelected}) => ($isSelected ? "#1890ff" : "rgb(25 117 220 / 0.7)")};
    border: none;
    &:hover {
        background-color: #40a9ff;
        color: #fff;
    }
`