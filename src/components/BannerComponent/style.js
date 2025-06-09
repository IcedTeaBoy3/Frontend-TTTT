import styled from "styled-components";

export const BannerContainer = styled.div`
    background-color: #1890ff;
    position: relative;
    width: 100%;
    height: 450px;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    @media (max-width: 768px) {
        height: 320px;
        padding: 30px 15px;
    }

    @media (max-width: 480px) {
        height: 280px;
        padding: 20px 10px;
    }
`;
export const BannerImage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${(props) => props.$image});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: right;
    opacity: 0.1;
`;