import styled from "styled-components";

import { Card } from 'antd'
export const WarpperCardStyle = styled(Card)`
    
    background-color: ${props => props.disable ? '#ccc' : 'white'};
    cursor: ${props => props.disable ? 'not-allowed' : 'pointer'};
    border: 1px solid #ccc;
    & .ant-card-body {
        padding: 8px;
    }
`
export const WarpperCardBottom = styled.div`
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
`