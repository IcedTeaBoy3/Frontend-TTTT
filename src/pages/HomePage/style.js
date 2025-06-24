 // ==== Styled Components ====
import styled from 'styled-components';
import { Card, Typography } from 'antd';
export const Wrapper = styled.div`
    min-height: 80vh;
    padding-top: 20px;
`;

export const CenteredTitleWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

export const Section = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
    overflow-x: auto;
`;

export const HospitalCard = styled(Card)`
    height: 280px;
`;
export const TwoLineDescription = styled.div`
    display: -webkit-box;
    -webkit-line-clamp: 2;       // số dòng muốn hiển thị
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;
export const SpecialtyCard = styled(Card)`
    width: 100%;
    text-align: center;
`;

export const HospitalImage = styled.img`
    height: 200px;
    object-fit: cover;
`;

export const SpecialtyImage = styled.img`
    width: 64px;
    height: 64px;
    object-fit: cover;
`;