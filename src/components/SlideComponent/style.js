import styled from "styled-components";
import Slider from "react-slick";
export const WrapperSliderStyle = styled(Slider)`
    & .slick-arrow.slick-prev,
    & .slick-arrow.slick-next {
        z-index: 10;
        top: 50%;

        &::before {
        font-size: 40px;
        color: #ccc; /* ❄️ Màu mặc định là trắng */
        transition: color 0.3s ease;
        }

        &:hover::before {
        color: #1890ff; /* 💙 Khi hover chuyển sang xanh */
        }
    }

    & .slick-arrow.slick-prev {
        left: 10px;
    }

    & .slick-arrow.slick-next {
        right: 20px;
    }
`;