import styled from "styled-components";
import { Card} from "antd";

export const StyledCard = styled(Card)`
    border-color: ${props => props.$isSelected ? '#1890ff' : 'inherit'};
    box-shadow: ${props => props.$isSelected ? '0 0 8px rgba(24, 144, 255, 0.6)' : 'none'};
    transition: border-color 0.3s, box-shadow 0.3s;
    &:hover {
        border-color: ${props => props.$isSelected ? '#1890ff' : '#d9d9d9'};
        box-shadow: ${props => props.$isSelected ? '0 0 8px rgba(24, 144, 255, 0.6)' : '0 0 4px rgba(0, 0, 0, 0.1)'};
    }
    .ant-card-head {
        background-color: ${props => props.$isSelected ? '#e6f7ff' : 'inherit'};
    }
    .ant-card-body {
        padding: 16px;
    }
    .ant-card-head-title {
        font-weight: bold;
    }
    .ant-card-extra {
        color: ${props => props.$isSelected ? '#1890ff' : 'inherit'};
    }
    .ant-card-meta-title {
        font-weight: bold;
    }
    .ant-card-meta-description {
        color: rgba(0, 0, 0, 0.45);
    }

`