import styled from "styled-components";
import { motion } from "framer-motion";
export const BannerContainer = styled.div`
    background-color: #1890ff;
    position: relative;
    width: 100%;
    height: 450px;
    padding: ${({ $padding }) => $padding || "85px"};
    justify-content: center;
    text-align: center;
    overflow: hidden;

    @media (max-width: 768px) {
        height: 320px;
        padding: ${({ $padding }) => $padding || "30px 15px"};
    }

    @media (max-width: 480px) {
        height: 280px;
        padding: ${({ $padding }) => $padding || "20px 10px"};
    }
`;

export const BannerImage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-image: url(${(props) => props.$image});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 0;
    opacity: 0.5;
    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.3); // overlay làm rõ nội dung
    }
`;
export const BannerContent = styled(motion.div)`
    position: relative;
    z-index: 2;
    margin-top: 80px;
`;