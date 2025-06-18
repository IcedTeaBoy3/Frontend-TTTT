
import { Row, Col } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined, YoutubeOutlined } from '@ant-design/icons';
import { FooterWrapper, FooterTitle, FooterText, FooterBottom, SocialLinks, SocialIcon } from './style';
import { useNavigate } from 'react-router-dom';
const FooterComponent = () => {
    const navigate = useNavigate();
    return (
        <div style={{ backgroundColor: 'rgb(249 250 251)', borderTop: '2px solid #1890ff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <FooterWrapper>
                <Row justify="space-around" gutter={[16, 16]} align="middle">
                    <Col sm={24} md={12} lg={8} xl={6}>
                        <FooterTitle>Công ty TNHH Medicare</FooterTitle>
                        <FooterText><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</FooterText>
                        <FooterText><strong>Điện thoại:</strong> 0123456789</FooterText>
                        <FooterText><strong>Email:</strong> abc@gmail.com</FooterText>
                    </Col>

                    <Col sm={24} md={12} lg={8} xl={6}>
                        <FooterTitle>Về Medicare</FooterTitle>
                        <FooterText>Giới thiệu</FooterText>
                        <FooterText>Điều khoản sử dụng</FooterText>
                        <FooterText>Liên hệ</FooterText>
                    </Col>

                    <Col sm={24} md={12} lg={8} xl={6}>
                        <FooterTitle>Dịch vụ</FooterTitle>
                        <FooterText onClick={() => navigate('/search?type=doctor', {
                            replace: true
                        })}>Đặt khám bác sĩ</FooterText>
                        <FooterText onClick={() => navigate('/search?type=hospital', {
                            replace: true
                        })}>Đặt khám phòng khám</FooterText>
                    </Col>

                    <Col sm={24} md={12} lg={8} xl={6}>
                        <FooterTitle>Hỗ trợ</FooterTitle>
                        <FooterText>Hướng dẫn sử dụng</FooterText>
                        <FooterText>Câu hỏi thường gặp</FooterText>
                        <FooterText>Chính sách bảo mật</FooterText>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ marginTop: '20px' }} span={24}>
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
