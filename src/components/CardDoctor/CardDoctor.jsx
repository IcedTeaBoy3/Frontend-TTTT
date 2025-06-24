import { Avatar, Col, Row, Space, Tag, Typography } from "antd"
import { UserOutlined } from "@ant-design/icons"
import ButtonComponent from "../ButtonComponent/ButtonComponent"
import { CardDoctorContainer } from "./style"

const { Text, Paragraph } = Typography

const CardDoctor = ({ doctor, isClinic, onClick }) => {
    return (
        <CardDoctorContainer onClick={onClick}>
            <Row gutter={[16, 16]} align="middle">
                {/* Cột avatar */}
                <Col xs={24} sm={6} md={5} lg={4}>
                    <Avatar
                        size={100}
                        icon={<UserOutlined />}
                        src={
                            isClinic
                                ? `${import.meta.env.VITE_APP_BACKEND_URL}${doctor?.thumbnail}`
                                : `${import.meta.env.VITE_APP_BACKEND_URL}${doctor?.user?.avatar}`
                        }
                    />
                </Col>

                {/* Cột thông tin bác sĩ/phòng khám */}
                <Col xs={24} sm={12} md={14} lg={16}>
                    <Text strong style={{ fontSize: "20px" }}>
                        {isClinic ? "Phòng khám" : "Bác sĩ"} {doctor?.user?.name || doctor?.name}
                    </Text>

                    {doctor?.specialties?.length > 0 && (
                        <div style={{ marginTop: 4 }}>
                            <Space wrap>
                                {doctor?.specialties.map((item, index) => (
                                    <Tag color="blue" key={index}>
                                        {item.name}
                                    </Tag>
                                ))}
                            </Space>
                        </div>
                    )}

                    <Paragraph style={{ margin: "8px 0 0" }}>
                        {doctor?.hospital?.address || doctor?.address}
                    </Paragraph>
                </Col>

                {/* Cột nút đặt khám */}
                <Col xs={24} sm={6} md={5} lg={4}>
                    <ButtonComponent
                        type="primary"
                        style={{ width: "100%", padding: "8px 16px" }}
                    >
                        Đặt khám
                    </ButtonComponent>
                </Col>
            </Row>
        </CardDoctorContainer>
    )
}

export default CardDoctor
