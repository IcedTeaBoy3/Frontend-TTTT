import styled from "styled-components";
import { motion } from "framer-motion";
import { Carousel } from "antd";
export const BannerContainer = styled.div`
    background-color: #1890ff;
    position: relative;
    width: 100%;
    height: 400px;
    /* padding: ${({ $padding }) => $padding || "85px 30px"}; */
    display: flex;
    justify-content: center;
    text-align: center;
    overflow: hidden;

    @media (max-width: 768px) {
        
        padding: ${({ $padding }) => $padding || "60px 20px"};
    }

    @media (max-width: 480px) {
        padding: ${({ $padding }) => $padding || "40px 15px"};
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
        background: linear-gradient(
            rgba(0, 0, 0, 0.4),
            rgba(0, 0, 0, 0.2)
        );
        z-index: 1;
    }
`;

export const BannerContent = styled(motion.div)`
    position: relative;
    z-index: 2;
    margin-top: 80px;
`;
export const StyledCarousel = styled(Carousel)`
    .slick-slide {
        transition: transform 0.4s ease;
        will-change: transform;
    }

    .slick-slide:hover {
        transform: scale(1.02);
    }

    .slick-prev:before,
    .slick-next:before {
        font-size: 28px; /* 👈 tăng icon */
        color: #fff;
    }

`;

