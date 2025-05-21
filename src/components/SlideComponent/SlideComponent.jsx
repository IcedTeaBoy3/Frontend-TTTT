
import CardComponent from '../CardComponent/CardComponent'
import { WrapperSliderStyle } from './style'
const SlideComponent = ({ children }) => {
    const settings = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,

    }
    return (
        <WrapperSliderStyle {...settings}>
            {children}
        </WrapperSliderStyle>
    )
}

export default SlideComponent