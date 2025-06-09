
import InputComponent from "../InputComponent/InputComponent";
import bannerImage from "../../assets/banner_nobackground.png";
import { BannerContainer, BannerImage } from "./style";
import { Typography, Grid } from "antd";
import { useNavigate } from "react-router-dom";
const { Title, Paragraph } = Typography;
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
        <BannerContainer>
            <BannerImage
                $image={bannerImage}
            />
            <Title
                level={2}
                style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: 16,
                }}
            >
                Chào mừng bạn đến với MediCare
            </Title>
            <Paragraph
                style={{
                    color: "white",
                    fontSize: "16px",
                    maxWidth: "600px",
                    margin: "0 auto 24px",
                }}
            >
                Đặt khám với hơn 1000 bác sĩ, 25 bệnh viện, 100 phòng khám trên MediCare
                để có số thứ tự và khung giờ khám trước.
            </Paragraph>
            <InputComponent
                placeholder="Tìm kiếm bác sĩ, phòng khám, bệnh viện"
                onSearch={handleSearch}
                size="large"
            />
        </BannerContainer >
    );
};

export default BannerComponent;
