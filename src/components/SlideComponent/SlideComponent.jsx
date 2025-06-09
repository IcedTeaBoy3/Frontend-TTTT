
import { WrapperSliderStyle } from './style'
const SlideComponent = ({ length, children }) => {
    const isSingle = length === 1;
    const settings = {
        dots: !isSingle,
        arrows: !isSingle,
        infinite: !isSingle,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    }
    return (
        <WrapperSliderStyle {...settings}
        >
            {children}
        </WrapperSliderStyle>
    )
}

export default SlideComponent