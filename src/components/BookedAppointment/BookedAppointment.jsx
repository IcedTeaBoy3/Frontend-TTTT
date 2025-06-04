
import { Typography, Divider, Row, Col, Card, Tag, Avatar, Flex, Pagination } from 'antd'
import { UserOutlined, WarningOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useQuery, useMutation } from '@tanstack/react-query'
import * as AppointmentService from '../../services/AppointmentService'
import * as Message from '../../components/Message/Message'
import { StyledCard } from './style'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
const { Title, Text, Paragraph } = Typography
const BookedAppointment = ({ userId }) => {
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const patient = useSelector((state) => state.auth.user);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const getStatusTag = (status) => {
        switch (status) {
            case 'confirmed':
                return <Tag color="blue">Đã xác nhận</Tag>;
            case 'pending':
                return <Tag color="orange">Đang chờ</Tag>;
            case 'cancelled':
                return <Tag color="red">Đã huỷ</Tag>;
            case 'completed':
                return <Tag color="green">Đã hoàn thành</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };
    const queryGetAllAppointmentByPatient = useQuery({
        queryKey: ['getAllAppointmentByPatient', userId, pagination.current, pagination.pageSize],
        queryFn: () => AppointmentService.getAllAppointmentsByPatient(userId, pagination.current, pagination.pageSize),
        keepPreviousData: true,
    });
    const mutationCancelAppointment = useMutation({
        mutationFn: (appointmentId) => AppointmentService.cancelAppointment(appointmentId),
        onSuccess: () => {
            Message.success("Huỷ lịch hẹn thành công");
            queryGetAllAppointmentByPatient.refetch()
            setSelectedAppointmentId(null); // Reset selected appointment
            setAppointmentDetails(null); // Reset appointment details
        },
        onError: (error) => {
            Message.error(error.message || "Huỷ lịch hẹn thất bại");
        }
    });

    const { data: appointments, isLoading, isError, error } = queryGetAllAppointmentByPatient;

    useEffect(() => {
        if (appointments && appointments.data && appointments.data.length > 0) {
            setSelectedAppointmentId(appointments.data[0]._id); // Mặc định chọn lịch hẹn đầu tiên
            setAppointmentDetails(appointments.data[0]); // Cập nhật thông tin chi tiết lịch hẹn đầu tiên
            pagination.total = appointments?.total || 0; // Cập nhật tổng số lượng lịch hẹn từ dữ liệu trả về
        }
    }, [appointments]);
    const handleSelectAppointment = (appointmentId) => {
        const appointment = appointments.data.find(app => app._id === appointmentId);
        if (appointment) {
            setAppointmentDetails(appointment);
        }
        setSelectedAppointmentId(appointmentId);
    };
    const handleChangePage = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize,
        }));
    }
    const handleCancelAppointment = async (id) => {
        mutationCancelAppointment.mutate(id);
    }
    return (
        <>
            <Title level={3}>Lịch hẹn của bạn</Title>
            <Paragraph style={{ backgroundColor: "#fed7aa", padding: "10px" }}>
                <WarningOutlined /> Nếu không đến khám đúng lịch, vui lòng huỷ lịch hẹn để bác sĩ có thể sắp xếp lại thời gian.
            </Paragraph>
            <Divider />
            {isLoading && <p>Loading...</p>}
            {isError && Message.error(error.message)}
            {appointments && appointments?.data.length === 0 && <Paragraph style={{ textAlign: 'left', width: '100%' }}>Bạn chưa có lịch hẹn nào.</Paragraph>}
            <Row gutter={[28, 16]}>
                <Col span={8} >
                    <Row gutter={[16, 16]} justify="space-between" align="center">

                        {appointments && appointments?.data.map((appointment) => {
                            const isSelected = selectedAppointmentId === appointment._id;
                            return (
                                <Col span={24} key={appointment._id}>
                                    <StyledCard
                                        hoverable
                                        onClick={() => handleSelectAppointment(appointment._id)}
                                        $isSelected={isSelected}
                                        title={<Title level={4} underline style={{ margin: 0, color: "#52c41a" }}>{`STT: ${appointment.stt}`}</Title>}
                                    >
                                        <Row gutter={[16, 8]}>
                                            <Col span={24}>
                                                <Title level={5} style={{ marginBottom: 4 }}>
                                                    Bác sĩ: {appointment.doctor.user.name}
                                                </Title>
                                            </Col>

                                            <Col span={24}>
                                                <Paragraph style={{ marginBottom: 0 }}>
                                                    <strong>Ngày khám:</strong>{' '}
                                                    {new Date(appointment.schedule.workDate).toLocaleDateString()} - {appointment.timeSlot}
                                                </Paragraph>
                                            </Col>

                                            <Col span={24}>
                                                <Paragraph style={{ marginBottom: 0 }}>
                                                    <strong>Bệnh nhân:</strong> {appointment.patient.name}
                                                </Paragraph>
                                            </Col>

                                            <Col span={24}>
                                                <strong>Trạng thái:</strong> {getStatusTag(appointment.status)}
                                            </Col>
                                        </Row>
                                    </StyledCard>

                                </Col>
                            );
                        })}
                        {(appointments && appointments.total >= 5) && (
                            <Col span={24}>
                                <Pagination
                                    style={{ marginTop: '20px' }}
                                    align="center"
                                    showSizeChanger
                                    current={pagination.current}
                                    pageSize={pagination.pageSize}
                                    total={pagination.total}
                                    onChange={handleChangePage}
                                />
                            </Col>
                        )}

                    </Row>
                </Col >
                <Col span={16}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>

                            {(selectedAppointmentId && appointmentDetails) && (
                                <>
                                    <Title level={4}>Thông tin chi tiết</Title>
                                    <Flex justify="space-between" align="center" style={{ marginBottom: '16px' }}>
                                        <Title level={4} style={{ margin: 0, color: "#52c41a" }}>STT: {appointmentDetails.stt}</Title>
                                        <Title level={4} style={{ margin: 0 }}>{getStatusTag(appointmentDetails.status)}</Title>
                                    </Flex>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 16,
                                            padding: "20px 6px",
                                            borderTop: "1px solid #f0f0f0",
                                            borderBottom: "1px solid #f0f0f0",
                                        }}
                                    >
                                        <Avatar size={56} icon={<UserOutlined />} />
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <Text strong style={{ fontSize: "18px" }}>Bác sĩ {appointmentDetails?.doctor?.user?.name}</Text>
                                            <Text type="secondary">{appointmentDetails?.doctor?.hospital?.address}</Text>
                                        </div>
                                    </div>
                                    <Card>
                                        <Title level={5}>Thông tin đặt khám</Title>
                                        <Paragraph>
                                            <strong>Ngày khám:</strong> <Text underline style={{ color: '#52c41a', fontWeight: 'bold' }}>{new Date(appointmentDetails.schedule.workDate).toLocaleDateString()}</Text>
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Giờ khám:</strong> <Text underline style={{ color: '#52c41a', fontWeight: 'bold' }}>{appointmentDetails.timeSlot}</Text>
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Chuyên khoa:</strong> {appointmentDetails.doctor.specialty.name}
                                        </Paragraph>
                                        <Title level={5}>Thông tin bệnh nhân</Title>
                                        <Paragraph>
                                            <strong>Tên bệnh nhân:</strong> {patient.name}
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Ngày sinh:</strong> {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '--'}
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Số điện thoại:</strong> {patient.phone}
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Giới tính:</strong> {patient.gender}
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Địa chỉ:</strong> {patient.address}
                                        </Paragraph>
                                    </Card>
                                    <ButtonComponent
                                        danger
                                        onClick={() => handleCancelAppointment(appointmentDetails._id)}
                                        disabled={appointmentDetails.status === 'cancelled'}
                                        styleButton={{
                                            marginTop: '16px',
                                            width: '100%',
                                        }}
                                    >
                                        Huỷ lịch hẹn
                                    </ButtonComponent>
                                </>
                            )}
                        </Col>
                    </Row>
                </Col>
            </Row >
        </>
    )
}

export default BookedAppointment