
import InputComponent from "../InputComponent/InputComponent";
import { BannerContainer, BannerImage, BannerContent } from "./style";
import { Typography, Grid, Carousel } from "antd";
import { useNavigate } from "react-router-dom";
import banner1 from "../../assets/banner_2.jpg";
import banner2 from "../../assets/banner_1.webp";
import banner3 from "../../assets/banner_3.png";
const { Title, Paragraph } = Typography;
const banners = [
    {
        image: banner1,
        title: "Chào mừng bạn đến với MediCare",
        description: "Đặt khám với hơn 1000 bác sĩ, 25 bệnh viện, 100 phòng khám trên MediCare để có số thứ tự và khung giờ khám trước.",
    },
    {
        image: banner2,
        title: "Khám bệnh nhanh chóng – Tiện lợi – Chính xác",
        description: "Đặt lịch và tra cứu thông tin bệnh viện dễ dàng.",
    },
    {
        image: banner3,
        title: "Trải nghiệm dịch vụ y tế hiện đại",
        description: "Liên kết với các bác sĩ đầu ngành và cơ sở y tế chất lượng cao.",
    },
];
const animationVariant = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};
const BannerComponent = () => {
    const screens = Grid.useBreakpoint();
    const navigate = useNavigate();
    const handleSearch = (value) => {
        // Handle search logic here
        if (value) {
            navigate(`/search?keyword=${encodeURIComponent(value)}&type=all`);
        }
    }
    return (
        <div style={{ paddingTop: screens.md ? "60px" : "15px" }}>
            <Carousel autoplay={{ dotDuration: true }} speed={500}>
                {banners.map((banner, index) => (
                    <BannerContainer key={banner.image + index} $padding={screens.md ? "15px 30px" : "0 15px"}>
                        <BannerImage
                            $image={banner.image}
                        />
                        <BannerContent
                            initial="initial"
                            animate="animate"
                            variants={animationVariant}
                            key={banner.title}
                        >

                            <Title
                                level={2}
                                style={{
                                    color: "white",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    marginBottom: 16,
                                }}
                            >
                                {banner.title}
                            </Title>
                            <Paragraph
                                style={{
                                    color: "white",
                                    fontSize: "16px",
                                    maxWidth: "600px",
                                    margin: "0 auto 24px",
                                }}
                            >
                                {banner.description}
                            </Paragraph>
                            <InputComponent
                                placeholder="Tìm kiếm bác sĩ, phòng khám, bệnh viện"
                                onSearch={handleSearch}
                                size="large"
                            />
                        </BannerContent>
                    </BannerContainer>
                ))}
            </Carousel>
        </div>
    );
};

export default BannerComponent;
