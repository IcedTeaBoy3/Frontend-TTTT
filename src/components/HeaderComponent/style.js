import styled from "styled-components";

// Styled Components
export const HeaderContainer = styled.header`
    width: 100%;
    background-color: #ffffff;
    padding: 5px 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const LogoSection = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
`;

export const BrandTitle = styled.h3`
    font-weight: bold;
    font-size: 28px;
    color: #1890ff;
    margin: 0;
    font-family: "Poppins", sans-serif;
    /* text-transform: uppercase; */
    letter-spacing: 1px;
`;

export const NavButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    height: 100%;
    @media (max-width: 768px) {
        display: none;
    }
`;

export const PopupItem = styled.p`
    margin: 0;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 4px;
    background-color: ${(props) =>
        props.$isSelected ? "#f0f0f0" : "transparent"};
    color: ${(props) => (props.$isSelected ? "#1890ff" : "inherit")};
    &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
    }
    &:hover {
        background-color: #f0f0f0;
        color: #1890ff;
    }
`;
export const MobileMenuButton = styled.div`
    display: none;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    height: 100%;
    @media (max-width: 768px) {
        display: flex;
    }
`;
