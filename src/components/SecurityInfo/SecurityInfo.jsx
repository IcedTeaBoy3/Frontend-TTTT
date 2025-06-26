
import { Typography, Row, Col } from "antd";
import {
    SafetyCertificateOutlined,
    CreditCardOutlined,
    TeamOutlined,
    RadarChartOutlined,
} from "@ant-design/icons";
import { Wrapper, IconCircle, HoverCard, BottomText } from "./style";
const { Title, Text } = Typography;


const SecurityInfo = () => {
    return (
        <Wrapper>
            <Title level={2} style={{ fontWeight: 'bold' }}>
                Bảo mật dữ liệu
            </Title>
            <Text style={{ fontSize: 16 }} type="secondary">
                An toàn dữ liệu của bạn là ưu tiên hàng đầu của chúng tôi
            </Text>

            <Row gutter={[24, 24]} justify="center" style={{ marginTop: 48 }}>
                <Col xs={24} sm={12} md={6}>
                    <HoverCard>
                        <IconCircle>
                            <SafetyCertificateOutlined />
                        </IconCircle>
                        <Title level={5}>Hạ tầng đạt tiêu chuẩn</Title>
                        <Text type="secondary">ISO 27001:2013</Text>
                    </HoverCard>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <HoverCard>
                        <IconCircle>
                            <CreditCardOutlined />
                        </IconCircle>
                        <Title level={5}>Thông tin sức khỏe được bảo mật</Title>
                        <Text type="secondary">theo quy chuẩn HIPAA</Text>
                    </HoverCard>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <HoverCard>
                        <IconCircle>
                            <TeamOutlined />
                        </IconCircle>
                        <Title level={5}>Thành viên</Title>
                        <Text type="secondary">VNISA</Text>
                    </HoverCard>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <HoverCard>
                        <IconCircle>
                            <RadarChartOutlined />
                        </IconCircle>
                        <Title level={5}>Pentest định kỳ</Title>
                        <Text type="secondary">hằng năm</Text>
                    </HoverCard>
                </Col>
            </Row>

            <BottomText>
                Với nhiều năm kinh nghiệm trong lĩnh vực Y tế, chúng tôi hiểu rằng,
                dữ liệu sức khỏe của bạn chỉ thuộc về bạn, YouMed tuân thủ các chính sách bảo mật
                dữ liệu cao nhất trên thế giới.
            </BottomText>
        </Wrapper>
    );
};

export default SecurityInfo;
