import styled from "styled-components";
import { Button } from "antd";
export const CustomButton = styled(Button)`
    font-weight: bold;
    background-color: ${({$isSelected}) => ($isSelected ? "#1890ff" : "rgb(25 117 220 / 0.7)")};
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    border: none;
`