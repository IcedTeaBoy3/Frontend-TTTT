import styled from 'styled-components';
import { Card } from 'antd';
export const StyledCard = styled(Card)`
    background-color: #e6f7ff;
    color: #1890ff;
    &:hover {
        border-color: #91d5ff;
        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
        background-color: #bae7ff;
    }
`