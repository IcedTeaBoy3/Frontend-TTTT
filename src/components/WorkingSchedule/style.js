import styled from 'styled-components';
import { Card } from 'antd';

export const CustomCard = styled(Card)`
    min-width: 200px;
    border: ${({ $isSelected }) => ($isSelected ? '2px solid #1890ff' : '1px solid #f0f0f0')};
    box-shadow: ${({ $isSelected }) => ($isSelected ? '0 0 6px #1890ff55' : 'none')};
    background-color: ${({ $isSelected }) => ($isSelected ? '#rgb(25 117 220)' : '#fff')};
    transition: all 0.3s;
`;