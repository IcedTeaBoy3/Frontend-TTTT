import styled from "styled-components";
import Slider from "react-slick";

export const WrapperSliderStyle = styled(Slider)`
    & .slick-arrow.slick-prev,
    & .slick-arrow.slick-next {
        z-index: 10;
        top: 50%;
        transform: translateY(-50%);

        &::before {
            font-size: 30px;
            color: #ccc;
            transition: color 0.3s ease;
        }

        &:hover::before {
            color: #1890ff;
        }
    }

    & .slick-arrow.slick-prev {
        left: 10px;
    }

    & .slick-arrow.slick-next {
        right: 10px;
    }

    & .slick-slide {
        padding: 0 10px;
        box-sizing: border-box;
    }

    & .slick-dots {
        bottom: -25px;

        li button:before {
            font-size: 10px;
            color: #ccc;
        }

        li.slick-active button:before {
            color: #1890ff;
        }
    }

    /* ✅ Responsive cho mobile */
    @media (max-width: 576px) {
        & .slick-arrow.slick-prev,
        & .slick-arrow.slick-next {
            display: none; /* Ẩn mũi tên trên mobile để không cấn UI */
        }

        & .slick-slide {
            padding: 0 5px;
        }
    }
`;
