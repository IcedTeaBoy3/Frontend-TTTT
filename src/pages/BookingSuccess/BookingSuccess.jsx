
import DefaultLayout from '../../components/DefaultLayout/DefaultLayout'
import GreenCheckmark from '../../components/GreenCheckmark/GreenCheckmark'
import { Typography, Avatar, Card, Row, Col } from 'antd'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { UserOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { addMinutesToTime } from '../../utils/timeUtils'
import { convertGender } from '../../utils/convertGender'
const { Title, Paragraph, Text } = Typography
const BookingSuccess = () => {
    const doctor = useSelector((state) => state.appointment.doctor)
    const appointment = useSelector((state) => state.appointment)
    const patient = useSelector((state) => state.auth.user)
    const infoStyle = {
        fontSize: 16,
    };

    const highlightStyle = {
        ...infoStyle,
        color: "rgb(82, 196, 26)",
        fontWeight: "bold",
    };
    const titleStyle = {
        margin: 0,
        color: 'white',
    }
    const headStyle = {
        backgroundColor: 'rgb(25 117 220 / 0.7)',
        borderRadius: '8px',
    }
    return (
        <DefaultLayout>

            <div
                style={{
                    minHeight: "100vh",
                    maxWidth: 1200,
                    width: "100%",
                    padding: "85px 16px",
                    margin: "0 auto",
                    backgroundColor: "#f5f5f5",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                    }}
                >
                    <GreenCheckmark />
                    <Title level={2} style={{ color: "#52c41a", fontWeight: 'bold' }}>Đặt lịch khám thành công!</Title>
                    <Text strong>
                        Cảm ơn bạn đã đặt lịch khám với chúng tôi. Xác nhận và sẽ được gửi đến email của bạn trong thời gian sớm nhất.
                    </Text>
                </div>


                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        margin: "16px 32px",
                        borderRadius: 8,
                        zIndex: 30,
                        background: "#fff",
                        padding: 16,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <Avatar size={80} icon={<UserOutlined />} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Text strong style={infoStyle}>
                            Bác sĩ {doctor?.user?.name}
                        </Text>
                        <Text type="secondary" style={infoStyle}>
                            <Text strong style={infoStyle}>Phòng mạch:</Text> {doctor?.hospital?.address}
                        </Text>
                    </div>
                    <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 32, marginLeft: "auto" }} />
                </div>

                {/* Nội dung chính */}
                <div style={{ padding: 32, background: "#f5f5f5", minHeight: "100vh" }}>
                    {/* Thông tin đặt lịch */}
                    <Card
                        title={<Title level={4} style={titleStyle}>Thông tin đặt lịch khám</Title>}
                        style={{ marginBottom: 24 }}
                        variant="borderless"
                        styles={{ header: headStyle }}
                    >
                        <Row gutter={[16, 12]}>
                            <Col xs={24} sm={12}>
                                <Text strong style={infoStyle}>Ngày khám:</Text>
                                <Paragraph style={highlightStyle} >
                                    {new Date(appointment.selectedDate).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    })}
                                </Paragraph>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Text strong style={infoStyle}>Giờ khám:</Text>
                                <Paragraph style={highlightStyle}>
                                    {`${appointment.selectedTime}-${addMinutesToTime(appointment.selectedTime, 30)}`}
                                </Paragraph>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Text strong style={infoStyle}>Chuyên khoa:</Text>
                                <Paragraph style={infoStyle} type='secondary'>{doctor?.specialty?.name}</Paragraph>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Text strong style={infoStyle}>Phòng khám:</Text>
                                <Paragraph style={infoStyle} type='secondary'>{doctor?.hospital?.name}</Paragraph>
                            </Col>

                            {appointment?.reason && (
                                <Col span={24}>
                                    <Text strong style={infoStyle}>Lý do khám:</Text>
                                    <Paragraph style={infoStyle} type='secondary'>{appointment.reason}</Paragraph>
                                </Col>
                            )}
                        </Row>
                    </Card>

                    {/* Thông tin bệnh nhân */}
                    <Card
                        title={<Title level={4} style={titleStyle}>Thông tin bệnh nhân</Title>}
                        variant="borderless"
                        styles={{ header: headStyle }}
                    >
                        <Row gutter={[16, 12]}>
                            <Col xs={24} sm={12}>
                                <Text strong style={infoStyle}>Tên bệnh nhân:</Text>
                                <Paragraph style={infoStyle} type='secondary'>{patient?.name}</Paragraph>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Text strong style={infoStyle}>Số điện thoại:</Text>
                                <Paragraph style={infoStyle} type='secondary'>{patient?.phone}</Paragraph>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Text strong style={infoStyle}>Email:</Text>
                                <Paragraph style={infoStyle} type='secondary'>{patient?.email}</Paragraph>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Text strong style={infoStyle}>Giới tính:</Text>
                                <Paragraph style={infoStyle} type='secondary'>{convertGender(patient?.gender)}</Paragraph>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Text strong style={infoStyle}>Ngày sinh:</Text>
                                <Paragraph style={infoStyle} type='secondary'>
                                    {patient?.dateOfBirth
                                        ? new Date(patient.dateOfBirth).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })
                                        : ""}
                                </Paragraph>
                            </Col>
                        </Row>
                    </Card>
                    <div
                        style={{
                            display: "flex",
                            gap: 20,
                            flexWrap: "nowrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#f0f2f5",
                            padding: 16,
                            borderRadius: 12,
                            position: "sticky",
                            bottom: 0, // Dính ở cuối màn hình khi cuộn
                            zIndex: 1000, // Đảm bảo không bị che
                            marginTop: 32,
                            boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)", // Đổ bóng cho nổi
                        }}
                    >
                        <ButtonComponent
                            type="default"
                            size="large"
                            style={{
                                width: "50%",
                                fontWeight: "bold",
                                fontSize: 16,
                            }}
                            onClick={() => window.print()} // In phiếu khám
                        >
                            Xem phiếu khám
                        </ButtonComponent>
                        <ButtonComponent
                            type="primary"
                            size="large"
                            style={{
                                width: "50%",
                                fontWeight: "bold",
                                fontSize: 16,
                            }}

                        >
                            Lưu lại phiếu
                        </ButtonComponent>
                    </div>
                </div>
            </div>
        </DefaultLayout >
    )
}

export default BookingSuccess