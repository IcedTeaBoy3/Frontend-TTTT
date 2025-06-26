import styled from "styled-components";
import { Card } from "antd";
import { Typography } from "antd";
const { Title, Text, Paragraph } = Typography;
export const Wrapper = styled.div` 
  min-height: 100vh;
  max-width: 1200px;
  width: 100%;
  padding: 85px 16px;
  margin: 0 auto;
  background-color: #f5f5f5;
`;

export const CenteredBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const DoctorCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 32px;
  border-radius: 8px;
  background: #fff;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 30;
`;

export const MainContent = styled.div`
  padding: 32px;
  background: #f5f5f5;
  min-height: 100vh;
`;

export const StickyFooter = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  background-color: #f0f2f5;
  padding: 16px;
  border-radius: 12px;
  position: sticky;
  bottom: 0;
  z-index: 1000;
  margin-top: 32px;
`;

export const InfoText = styled(Text)`
  font-size: 15px;
`;

export const Highlight = styled(Paragraph)`
  font-weight: 500;
  font-size: 16px;
`;

export const SectionTitle = styled(Title)`
  margin: 0;
  font-size: 20px;
`;