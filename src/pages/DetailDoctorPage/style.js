// Styled components
import styled from 'styled-components';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
export const Container = styled.div`
  min-height: 100vh;
  max-width: 1200px;
  padding: 85px 16px;
  margin: 0 auto;
`;

export const ContentBox = styled.div`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DoctorInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: center;
  justify-content: center;
`;

export const InfoSection = styled.div`
  flex: 1;
  min-width: 280px;
`;

export const StickyFooter = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  background-color: #f0f2f5;
  padding: 16px;
  border-radius: 12px;
  position: sticky;
  bottom: 0;
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
`;

export const Hotline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledIframe = styled.iframe`
  width: 100%;
  height: 450px;
  border: 0;
  border-radius: 12px;
`;

export const BookingButton = styled(ButtonComponent)`
  width: 50%;
  font-weight: bold;
  font-size: 16px;
`;