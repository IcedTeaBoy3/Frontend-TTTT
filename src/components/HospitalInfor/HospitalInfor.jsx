
import { Row, Col, Typography, Image, Space } from 'antd';
import defaultImage from '../../assets/default_image.png';
import { StyledIframe } from './style';
import SlideComponent from '../SlideComponent/SlideComponent';
import ViewerCKeditorStyled from '../ViewerCKEditorStyled/ViewerCKEditorStyled';
const { Title, Text } = Typography;
const HospitalInfor = ({ hospital }) => {
    const description = hospital?.data?.description || 'Chưa có giới thiệu';
    return (
        <div style={{ margin: '16px 0px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }} gutter={[16, 16]}>
                <Image.PreviewGroup>
                    <Col>
                        <SlideComponent>
                            {hospital?.data?.images?.length > 0 ? (
                                hospital.data.images.map((image, index) => (
                                    <Image
                                        key={index}
                                        width="100%"
                                        height={200}
                                        src={`${import.meta.env.VITE_APP_BACKEND_URL}${image}`}
                                        fallback={defaultImage}
                                        alt={`Hospital Image ${index + 1}`}
                                    />
                                ))
                            ) : (
                                <Image
                                    width={200}
                                    height={200}
                                    src={defaultImage}
                                    alt="Default Hospital Image"
                                />
                            )}
                        </SlideComponent>
                    </Col>
                </Image.PreviewGroup>
            </Row>
            <div>
                <Title level={4}>Giới thiệu</Title>
                <ViewerCKeditorStyled
                    content={description}
                    style={{ minHeight: '100px', marginBottom: '16px' }}
                />

            </div>
            <div>
                <Title level={4}>
                    Địa chỉ: {hospital?.data?.address || 'Chưa có địa chỉ'}
                </Title>
                {hospital?.data?.address ? (
                    <StyledIframe
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(hospital?.data?.address)}&output=embed`}
                    />
                ) : (
                    <p>Không có địa chỉ để hiển thị bản đồ.</p>
                )}
            </div>
        </div>
    )
}

export default HospitalInfor