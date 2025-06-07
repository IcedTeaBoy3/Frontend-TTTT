import styled from "styled-components";
import { Card } from "antd";
export const StyledCard = styled(Card)`

    border: ${({isSelected}) => (isSelected ? "2px solid #1890ff" : "1px solid #d9d9d9")};
    border-radius: 8px;
    margin: 0 8px 8px 0;
    &:hover {
        background-color: #f0f0f0;
    }
`