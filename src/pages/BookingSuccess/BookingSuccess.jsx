import React from 'react'
import DefaultLayout from '../../components/DefaultLayout/DefaultLayout'
import GreenCheckmark from '../../components/GreenCheckmark/GreenCheckmark'
import { Typography, Avatar, Divider, Card, Row, Col } from 'antd'
import { UserOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { addMinutesToTime } from '../../utils/timeUtils'
const { Title, Paragraph, Text } = Typography
const BookingSuccess = () => {
    const doctor = useSelector((state) => state.appointment.doctor)
    const appointment = useSelector((state) => state.appointment)
    const patient = useSelector((state) => state.auth.user)
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
                    <h1 style={{ marginTop: 20, color: "#52c41a", fontWeight: 'bold' }}>Đặt lịch khám thành công!</h1>
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
                        <Text strong style={{ fontSize: "18px" }}>
                            Bác sĩ {doctor?.user?.name}
                        </Text>
                        <Text type="secondary">
                            <Text strong>Phòng mạch:</Text> {doctor?.hospital?.address}
                        </Text>
                    </div>
                    <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 32, marginLeft: "auto" }} />
                </div>

                {/* Nội dung chính */}
                <div style={{ padding: 32, background: "#f5f5f5", minHeight: "100vh" }}>
                    {/* Thông tin đặt lịch */}
                    <Card
                        title={<Title level={4} style={{ margin: 0 }}>Thông tin đặt lịch khám</Title>}
                        style={{ marginBottom: 24 }}
                        bordered={false}
                    >
                        <Row gutter={[16, 8]}>
                            <Col span={12}>
                                <Text strong>Ngày khám:</Text>
                                <Paragraph style={{ color: 'rgb(82, 196, 26)', fontWeight: 'bold', fontSize: '18px' }}>
                                    {new Date(appointment.selectedDate).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    })}
                                </Paragraph>
                            </Col>
                            <Col span={12}>
                                <Text strong>Giờ khám:</Text>
                                <Paragraph style={{ color: 'rgb(82, 196, 26)', fontWeight: 'bold', fontSize: '18px' }}>{`${appointment.selectedTime}-${addMinutesToTime(appointment.selectedTime, 30)}`}</Paragraph>
                            </Col>
                            <Col span={12}>
                                <Text strong>Chuyên khoa:</Text>
                                <Paragraph>{doctor?.specialty?.name}</Paragraph>
                            </Col>
                            <Col span={12}>
                                <Text strong>Phòng khám:</Text>
                                <Paragraph>{doctor?.hospital?.name}</Paragraph>
                            </Col>
                            {appointment?.reason && (
                                <Col span={24}>
                                    <Text strong>Lý do khám:</Text>
                                    <Paragraph>{appointment.reason}</Paragraph>
                                </Col>
                            )}
                        </Row>
                    </Card>

                    {/* Thông tin bệnh nhân */}
                    <Card
                        title={<Title level={4} style={{ margin: 0 }}>Thông tin bệnh nhân</Title>}
                        bordered={false}
                    >
                        <Row gutter={[16, 8]}>
                            <Col span={12}>
                                <Text strong>Tên bệnh nhân:</Text>
                                <Paragraph>{patient?.name}</Paragraph>
                            </Col>
                            <Col span={12}>
                                <Text strong>Số điện thoại:</Text>
                                <Paragraph>{patient?.phone}</Paragraph>
                            </Col>
                            <Col span={12}>
                                <Text strong>Email:</Text>
                                <Paragraph>{patient?.email}</Paragraph>
                            </Col>
                            <Col span={12}>
                                <Text strong>Giới tính:</Text>
                                <Paragraph>{patient?.gender}</Paragraph>
                            </Col>
                            <Col span={12}>
                                <Text strong>Ngày sinh:</Text>
                                <Paragraph>
                                    {new Date(patient?.dateOfBirth).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    })}
                                </Paragraph>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        </DefaultLayout >
    )
}

export default BookingSuccess