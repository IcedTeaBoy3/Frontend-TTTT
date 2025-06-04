import styled from "styled-components";

export const BookingPageContainer = styled.div`
    min-height: 100vh;
    max-width: 1200px;
    padding: 85px 16px;
    margin: 0 auto;
`;
export const LeftContent = styled.div`
    background-color: #fff;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    border-radius: 12px;
    flex: 1;
`
export const RightContent = styled.div`
    background-color: #fff;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    padding: 32px 24px;
    min-width: 350px;
`
export const WrapperDoctorInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid #e8e8e8;
    border-top: 1px solid #e8e8e8;
`;
export const WrapperAppointmentInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px 0;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 16px;

`