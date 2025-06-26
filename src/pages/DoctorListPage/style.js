import styled from "styled-components";
import { Card,Typography } from "antd";
const { Title, Text } = Typography;
export const Wrapper = styled.div`
    min-height: 80vh;
    padding-top: 70px;
`;
export const Section = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
    overflow-x: auto;
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
export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;

  img {
    max-width: 100%;
    height: auto;
  }
`;

export const InfoBox = styled.div`
  margin-bottom: 30px;
`;

export const BoldTitle = styled(Text)`
  font-weight: 600;
  font-size: 18px;
`;

export const LightText = styled(Text)`
  font-size: 16px;
  color: #555;
`;
export const FilterCard = styled(Card)`
  background-color: #f9fafc;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
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