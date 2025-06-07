import styled from "styled-components";

// Container chính
export const BookingPageContainer = styled.div`
    min-height: 100vh;
    max-width: 1200px;
    padding: 85px 16px;
    margin: 0 auto;
`;

// Cột trái (Collapse)
export const LeftContent = styled.div`
    background-color: #fff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    flex: 1;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

// Cột phải (Thông tin đặt khám)
export const RightContent = styled.div`
    background-color: #fff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    padding: 32px 24px;
    min-width: 350px;

    @media (max-width: 992px) {
        min-width: 100%;
        margin-top: 24px;
    }
`;

// Thông tin bác sĩ
export const WrapperDoctorInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid #e8e8e8;
    border-top: 1px solid #e8e8e8;

    @media (max-width: 576px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

// Thông tin cuộc hẹn
export const WrapperAppointmentInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px 0;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 16px;
`;
