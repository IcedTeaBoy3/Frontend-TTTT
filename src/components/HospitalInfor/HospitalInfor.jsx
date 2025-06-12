
import { useState } from 'react';
import { Row, Col, Typography, Image, Space } from 'antd';
import defaultImage from '../../assets/default_image.png';
import { StyledIframe } from './style';
const { Title, Text } = Typography;
const HospitalInfor = ({ hospital }) => {
    const maxLength = 300;
    const description = hospital?.data?.description || 'Chưa có giới thiệu';
    const [expanded, setExpanded] = useState(false);
    const displayedText = expanded ? description : (description.length > maxLength ? description.slice(0, maxLength) + '...' : description);
    return (
        <div style={{ margin: '16px 0px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }} gutter={[16, 16]}>
                <Image.PreviewGroup>
                    <Col span={14}>
                        <Image
                            src={`${import.meta.env.VITE_APP_BACKEND_URL}${hospital?.data?.images?.[0]}`}
                            alt={hospital?.data?.name}
                            style={{ width: '100%', maxHeight: '400px', height: 'auto', borderRadius: '8px' }}
                            fallback={defaultImage}
                            preview={{
                                mask: 'Xem ảnh',
                                icons: {
                                    rotateRight: <span style={{ fontSize: '16px' }}>⟳</span>,
                                    rotateLeft: <span style={{ fontSize: '16px' }}>⟲</span>,
                                    zoomIn: <span style={{ fontSize: '16px' }}>🔍</span>,
                                    zoomOut: <span style={{ fontSize: '16px' }}>🔎</span>,
                                },
                            }}
                        />
                    </Col>

                    <Col span={10}>
                        <Row gutter={[8, 8]} justify="start" align="top">
                            {hospital?.data?.images?.slice(1).map((image, index) => (
                                <Col span={12} key={`image-${index}`}
                                >
                                    <Image
                                        src={`${import.meta.env.VITE_APP_BACKEND_URL}${image}`}
                                        fallback={defaultImage}
                                        alt={`Hospital image ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: 'auto',       // tự động tính chiều cao theo tỷ lệ
                                            maxHeight: '400px',   // không cho vượt quá chiều cao này
                                            borderRadius: '8px',
                                        }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Image.PreviewGroup>
            </Row>
            <Space direction="vertical" style={{ marginBottom: 16 }}>
                <Title level={4}>Giới thiệu</Title>
                <Text style={{ fontSize: '16px', whiteSpace: 'pre-line' }}>
                    {displayedText}
                    {description.length > maxLength && (
                        <a type="primary" onClick={() => setExpanded(!expanded)}>
                            {expanded ? 'Thu gọn' : 'Xem thêm'}
                        </a>

                    )}
                </Text>

            </Space>
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