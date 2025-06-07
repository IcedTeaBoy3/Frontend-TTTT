
import DefaultLayout from '../../components/DefaultLayout/DefaultLayout'
import GreenCheckmark from '../../components/GreenCheckmark/GreenCheckmark'
import { Typography, Avatar, Card, Row, Col } from 'antd'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { UserOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { addMinutesToTime } from '../../utils/timeUtils'
import { convertGender } from '../../utils/convertGender'
import { useNavigate } from 'react-router-dom'
import {
    Wrapper, CenteredBox,
    DoctorCard,
    MainContent,
    StickyFooter,
    InfoText,
    Highlight,
    SectionTitle
} from './style'
const { Title, Paragraph, Text } = Typography
const BookingSuccess = () => {
    const doctor = useSelector((state) => state.appointment.doctor)
    const appointment = useSelector((state) => state.appointment)
    const patient = useSelector((state) => state.auth.user)
    const navigate = useNavigate()
    const handleViewAppointment = () => {
        navigate('/profile', {
            state: {
                tab: 'appointments',
            },
        })
    }
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

            <Wrapper>
                <CenteredBox>
                    <GreenCheckmark />
                    <Title level={2} style={{ color: "#52c41a", fontWeight: "bold" }}>
                        Đặt lịch khám thành công!
                    </Title>
                    <Title level={2} style={{ color: "#52c41a", fontWeight: "bold", margin: 0 }}>
                        STT: {appointment?.stt}
                    </Title>
                    <Text strong>
                        Cảm ơn bạn đã đặt lịch khám với chúng tôi. Thông tin về lịch khám bệnh đã được gửi đến email của bạn.
                    </Text>
                </CenteredBox>

                <DoctorCard>
                    <Avatar size={80} icon={<UserOutlined />} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <InfoText strong>Bác sĩ {doctor?.user?.name}</InfoText>
                        <Text type="secondary">
                            <Text strong>Phòng mạch:</Text> {doctor?.hospital?.address}
                        </Text>
                    </div>
                    <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 32, marginLeft: "auto" }} />
                </DoctorCard>

                <MainContent>
                    <Card
                        title={<SectionTitle level={4}>Thông tin đặt lịch khám</SectionTitle>}
                        style={{ marginBottom: 24 }}
                        bordered={false}
                    >
                        <Row gutter={[16, 12]}>
                            <Col xs={24} sm={12}>
                                <InfoText strong>Ngày khám:</InfoText>
                                <Highlight>
                                    {new Date(appointment.selectedDate).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    })}
                                </Highlight>
                            </Col>
                            <Col xs={24} sm={12}>
                                <InfoText strong>Giờ khám:</InfoText>
                                <Highlight>
                                    {`${appointment.selectedTime}-${addMinutesToTime(appointment.selectedTime, 30)}`}
                                </Highlight>
                            </Col>
                            <Col xs={24} sm={12}>
                                <InfoText strong>Chuyên khoa:</InfoText>
                                <Paragraph type="secondary">{doctor?.specialty?.name}</Paragraph>
                            </Col>
                            <Col xs={24} sm={12}>
                                <InfoText strong>STT:</InfoText>
                                <Paragraph type="success">{appointment.stt}</Paragraph>
                            </Col>
                            {appointment?.reason && (
                                <Col span={24}>
                                    <InfoText strong>Lý do khám:</InfoText>
                                    <Paragraph type="secondary">{appointment.reason}</Paragraph>
                                </Col>
                            )}
                        </Row>
                    </Card>

                    <Card
                        title={<SectionTitle level={4}>Thông tin bệnh nhân</SectionTitle>}
                        bordered={false}
                    >
                        <Row gutter={[16, 12]}>
                            <Col xs={24} sm={12}>
                                <InfoText strong>Tên bệnh nhân:</InfoText>
                                <Paragraph type="secondary">{patient?.name}</Paragraph>
                            </Col>
                            <Col xs={24} sm={12}>
                                <InfoText strong>Số điện thoại:</InfoText>
                                <Paragraph type="secondary">{patient?.phone}</Paragraph>
                            </Col>
                            <Col xs={24} sm={12}>
                                <InfoText strong>Email:</InfoText>
                                <Paragraph type="secondary">{patient?.email}</Paragraph>
                            </Col>
                            <Col xs={24} sm={12}>
                                <InfoText strong>Giới tính:</InfoText>
                                <Paragraph type="secondary">{convertGender(patient?.gender)}</Paragraph>
                            </Col>
                            <Col xs={24} sm={12}>
                                <InfoText strong>Ngày sinh:</InfoText>
                                <Paragraph type="secondary">
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

                    <StickyFooter>
                        <ButtonComponent
                            type="default"
                            size="large"
                            style={{ width: "50%", fontWeight: "bold", fontSize: 16 }}
                            onClick={handleViewAppointment}
                        >
                            Xem phiếu khám
                        </ButtonComponent>
                        <ButtonComponent
                            type="primary"
                            size="large"
                            style={{ width: "50%", fontWeight: "bold", fontSize: 16 }}
                        >
                            Lưu lại phiếu
                        </ButtonComponent>
                    </StickyFooter>
                </MainContent>
            </Wrapper>
        </DefaultLayout >
    )
}

export default BookingSuccess