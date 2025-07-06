
import { Row, Col, Typography } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined, YoutubeOutlined } from '@ant-design/icons';
import { FooterWrapper, FooterTitle, FooterText, FooterBottom, SocialLinks, SocialIcon } from './style';
import { useNavigate } from 'react-router-dom';
const { Text } = Typography;
const FooterComponent = () => {
    const navigate = useNavigate();
    return (
        <div style={{ backgroundColor: 'rgb(249 250 251)', borderTop: '2px solid #1890ff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <FooterWrapper>
                <Row justify="space-around" gutter={[16, 16]} align="center" style={{ marginBottom: '30px' }}>
                    <Col sm={24} md={12} lg={8} xl={6}>
                        <FooterTitle>Công ty TNHH Medicare</FooterTitle>
                        <FooterText><Text strong>Địa chỉ: </Text> <Text type='secondary'>123 Đường ABC, Quận 1, TP.HCM</Text> </FooterText>
                        <FooterText><Text strong>Điện thoại: </Text> <Text type='secondary'>0123456789</Text></FooterText>
                        <FooterText><Text strong>Email: </Text><Text type='secondary'>abc@gmail.com</Text></FooterText>
                    </Col>

                    <Col sm={24} md={12} lg={8} xl={6}>
                        <FooterTitle>Về Medicare</FooterTitle>
                        <FooterText><Text type='secondary'>Giới thiệu</Text></FooterText>
                        <FooterText><Text type='secondary'>Điều khoản sử dụng</Text></FooterText>
                        <FooterText><Text type='secondary'>Liên hệ</Text></FooterText>
                    </Col>

                    <Col sm={24} md={12} lg={8} xl={6}>
                        <FooterTitle>Dịch vụ</FooterTitle>
                        <FooterText onClick={() => navigate('/search?type=doctor', {
                            replace: true
                        })}><Text type='secondary'>Đặt khám bác sĩ</Text></FooterText>
                        <FooterText onClick={() => navigate('/search?type=hospital', {
                            replace: true
                        })}><Text type='secondary'>Đặt khám phòng khám</Text></FooterText>
                        <FooterText onClick={() => navigate('/search?type=hospital', {
                            replace: true
                        })}><Text type='secondary'>Đặt khám bệnh viện</Text></FooterText>
                    </Col>

                    <Col sm={24} md={12} lg={8} xl={6}>
                        <FooterTitle>Hỗ trợ</FooterTitle>
                        <FooterText><Text type='secondary'>Hướng dẫn sử dụng</Text></FooterText>
                        <FooterText><Text type='secondary'>Câu hỏi thường gặp</Text></FooterText>
                        <FooterText><Text type='secondary'>Chính sách bảo mật</Text></FooterText>
                    </Col>
                </Row>
                <Row justify="space-around" gutter={[16, 16]} align="middle" style={{ marginTop: '30px' }}>
                    <Col span={24}>
                        <FooterTitle>Kết nối với chúng tôi</FooterTitle>
                        <SocialLinks>
                            <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <FacebookOutlined /> Facebook
                            </SocialIcon>
                            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <TwitterOutlined /> Twitter
                            </SocialIcon>
                            <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <InstagramOutlined /> Instagram
                            </SocialIcon>
                            <SocialIcon href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <LinkedinOutlined /> LinkedIn
                            </SocialIcon>
                            <SocialIcon href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                <YoutubeOutlined /> YouTube
                            </SocialIcon>
                        </SocialLinks>
                    </Col>
                </Row>

                <FooterBottom>
                    <FooterText>© 2023 Medicare. All rights reserved.</FooterText>
                    <FooterText>Thiết kế bởi Medicare Team</FooterText>
                </FooterBottom>
            </FooterWrapper>
        </div>
    );
};

export default FooterComponent;
