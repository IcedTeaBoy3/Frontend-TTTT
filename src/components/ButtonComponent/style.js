import styled from "styled-components";
import { Button } from "antd";
export const CustomButton = styled(Button)`
    border: 1px solid #1890ff;
    &:hover {
        background-color: #1890ff;
        color: #fff;
    }
    /* &:focus {
        background-color: #1890ff;
        color: #fff;
    }
    &:active {
        background-color: #1890ff;
        color: #fff;
    } */
`