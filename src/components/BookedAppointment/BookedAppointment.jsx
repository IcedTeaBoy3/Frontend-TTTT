
import { Typography, Divider, Row, Col, Card, Tag, Avatar, Flex, Pagination, Popconfirm } from 'antd'
import { UserOutlined, WarningOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useQuery, useMutation } from '@tanstack/react-query'
import * as AppointmentService from '../../services/AppointmentService'
import * as Message from '../../components/Message/Message'
import { StyledCard } from './style'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { convertGender } from '../../utils/convertGender'
const { Title, Text, Paragraph } = Typography
const BookedAppointment = ({ userId }) => {
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const typeBooked = appointmentDetails?.type || 'default'; // Giả sử type mặc định là 'default'
    // Lấy thông tin người dùng từ Redux store
    const patient = useSelector((state) => state.auth.user);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 3,
        total: 0,
    });
    const getStatusTag = (status) => {
        switch (status) {
            case 'confirmed':
                return <Tag color="blue">Đã xác nhận</Tag>;
            case 'pending':
                return <Tag color="orange">Chờ xác nhận</Tag>;
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
            {appointments && appointments?.data?.length === 0 && <Paragraph style={{ textAlign: 'left', width: '100%' }}>Bạn chưa có lịch hẹn nào.</Paragraph>}
            <Row gutter={[28, 16]}>
                <Col xs={24} md={10} lg={8} >
                    <Row gutter={[16, 16]} justify="space-between" align="center">

                        {appointments && appointments?.data?.map((appointment) => {
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
                                                    Bác sĩ: {appointment.doctor?.user?.name}
                                                </Title>
                                            </Col>

                                            <Col span={24}>
                                                <Paragraph style={{ marginBottom: 0 }}>
                                                    <strong>Ngày khám:</strong>{' '}
                                                    {new Date(appointment?.schedule?.workDate).toLocaleDateString()} - {appointment.timeSlot}
                                                </Paragraph>
                                            </Col>

                                            <Col span={24}>
                                                <Paragraph style={{ marginBottom: 0 }}>
                                                    <strong>Bệnh nhân:</strong> {appointment?.patient.name}
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
                        {(appointments && appointments.total >= 3) && (
                            <Col span={24}>
                                <Pagination
                                    style={{ marginTop: '20px' }}
                                    align="center"
                                    showLessItems
                                    pageSizeOptions={['3', '5', '10']}
                                    current={pagination.current}
                                    pageSize={pagination.pageSize}
                                    total={pagination.total}
                                    onChange={handleChangePage}
                                />
                            </Col>
                        )}

                    </Row>
                </Col >
                <Col xs={24} md={14} lg={16}>
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
                                        <Avatar
                                            size={56}
                                            icon={<UserOutlined />}
                                            src={typeBooked == 'hospital' ? `${import.meta.env.VITE_APP_BACKEND_URL}${appointmentDetails?.hospital?.thumbnail}` :
                                                `${import.meta.env.VITE_APP_BACKEND_URL}${appointmentDetails?.doctor?.user?.avatar}`}
                                        />
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <Text strong style={{ fontSize: "18px" }}>
                                                {typeBooked == 'hospital' ? appointmentDetails?.hospital?.name : appointmentDetails?.doctor?.user?.name}
                                            </Text>
                                            <Text type="secondary">
                                                {typeBooked == 'hospital' ? appointmentDetails?.hospital?.address : appointmentDetails?.doctor?.hospital?.address}
                                            </Text>
                                        </div>
                                    </div>
                                    <Card>
                                        <Title level={5}>Thông tin đặt khám</Title>
                                        <Paragraph>
                                            <strong>Ngày khám:</strong> <Text underline style={{ color: '#52c41a', fontWeight: 'bold' }}>{new Date(appointmentDetails?.schedule?.workDate).toLocaleDateString()}</Text>
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Giờ khám:</strong> <Text underline style={{ color: '#52c41a', fontWeight: 'bold' }}>{appointmentDetails.timeSlot}</Text>
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Chuyên khoa:</strong>{" "}

                                            <Tag color="blue" style={{ marginRight: '4px' }}>
                                                {appointmentDetails?.specialty?.name || 'Chưa có chuyên khoa'}
                                            </Tag>

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
                                            <strong>Giới tính:</strong> {convertGender(patient.gender)}
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Địa chỉ:</strong> {patient.address}
                                        </Paragraph>
                                    </Card>
                                    <Popconfirm
                                        title="Huỷ lịch hẹn"
                                        placement="topRight"
                                        description="Bạn có chắc chắn muốn huỷ lịch hẹn này không?"
                                        onConfirm={() => handleCancelAppointment(appointmentDetails._id)}
                                        okText="Đồng ý"
                                        cancelText="Huỷ"
                                    >

                                        <ButtonComponent
                                            danger
                                            disabled={appointmentDetails.status === 'cancelled' || appointmentDetails.status === 'completed'}
                                            loading={mutationCancelAppointment.isLoading}
                                            styleButton={{
                                                marginTop: '16px',
                                                width: '100%',
                                            }}
                                        >
                                            Huỷ lịch hẹn
                                        </ButtonComponent>
                                    </Popconfirm>
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