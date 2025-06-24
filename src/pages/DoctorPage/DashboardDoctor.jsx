
import { useDispatch, useSelector } from 'react-redux'
import { setDoctor } from '../../redux/Slice/doctorSlice'
import * as DoctorService from '../../services/DoctorService'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Card, Col, Row, Table, Typography, Select, Statistic, Space, DatePicker, Tag } from 'antd';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDebounce } from '../../hooks/useDebounce';
import { Line } from '@ant-design/charts';
import { CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const DashboardDoctor = () => {
    const dispatch = useDispatch();
    const doctorId = useSelector(state => state.doctor.doctorId);
    const queryGetDoctor = useQuery({
        queryKey: ['getDoctor'],
        queryFn: DoctorService.getDoctorByUserId,

    });
    const { data: doctor, isLoading: isLoadingDoctor } = queryGetDoctor;

    useEffect(() => {
        if (doctor && doctor.data) {
            dispatch(setDoctor({
                doctorId: doctor.data._id,
                hospital: doctor.data.hospital,
                specialties: doctor.data.specialties,
                position: doctor.data.position,
                qualification: doctor.data.qualification,
                yearExperience: doctor.data.yearExperience,
                detailExperience: doctor.data.detailExperience,
                description: doctor.data.description,
            }));
        }
    }, [doctor, dispatch]);


    const [dateRange, setDateRange] = useState([]);
    const debouncedDateRange = useDebounce(dateRange, 500);
    const handleDateChange = (dates) => {
        setDateRange(dates);
    };
    const queryGetDoctorStatistics = useQuery({
        queryKey: ['getDoctorStatistics', doctorId, debouncedDateRange],
        queryFn: ({ queryKey }) => {
            const [_, doctorId, dateRange] = queryKey;
            const startDate = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '';
            const endDate = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '';
            return DoctorService.getDoctorStatistics(doctorId, startDate, endDate);
        },
        refetchOnWindowFocus: false,
        enabled: !!doctorId
    });
    const { data: doctorStatistics, isLoading: isLoadingDoctorStatistics } = queryGetDoctorStatistics;
    const overviewData = doctorStatistics?.data?.overview;
    const chartData = doctorStatistics?.data?.chartData || [];
    const recentAppointments = doctorStatistics?.data?.recentAppointments || [];
    const columns = [
        {
            title: 'Bệnh nhân',
            dataIndex: 'patient',
            key: 'patient'
        },
        {
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time'
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text) => {
                const statusMap = {
                    pending: {
                        label: "Chờ xác nhận",
                        color: "orange",
                    },
                    confirmed: {
                        label: "Đã xác nhận",
                        color: "blue",
                    },
                    cancelled: {
                        label: "Đã huỷ",
                        color: "red",
                    },
                    completed: {
                        label: "Đã hoàn thành",
                        color: "green",
                    },
                };

                const status = statusMap[text];

                return (
                    <Tag color={status?.color || "default"}>
                        {status?.label || text}
                    </Tag>
                );
            },
            filters: [
                { text: "Chờ xác nhận", value: "pending" },
                { text: "Đã xác nhận", value: "confirmed" },
                { text: "Đã huỷ", value: "cancelled" },
                { text: "Đã hoàn thành", value: "completed" },
            ],
            onFilter: (value, record) => record.status.includes(value),
            filterMode: "tree",
            filterMultiple: false,
        },
    ];

    const config = {
        data: chartData,
        xField: 'date',
        yField: 'appointments',
        smooth: true,
        height: 300,
        lineStyle: {
            stroke: '#1890ff',
            lineWidth: 2,
        },
        point: {
            size: 5,
            shape: 'diamond',
            style: {
                fill: 'white',
                stroke: '#1890ff',
                lineWidth: 2,
            },
        },
        tooltip: {
            showMarkers: true,
        },
    };
    return (
        <div style={{ padding: 24 }}>
            {/* Header: Title + Select filter */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={3} style={{ margin: 0 }}>Thống kê hoạt động</Title>
                </Col>
                <Col>
                    <Space direction="horizontal">
                        <RangePicker
                            format="DD/MM/YYYY"
                            style={{ width: '300px' }}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            value={dateRange}
                            onChange={handleDateChange}
                        />
                        <ButtonComponent
                            type="primary"
                            style={{ marginLeft: '10px' }}
                            onClick={() => setDateRange([])}
                        >
                            Xóa bộ lọc
                        </ButtonComponent>
                    </Space>
                </Col>
            </Row>

            {/* Thống kê nhanh */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            value={overviewData?.todayCount}
                            title="Lượt khám hôm nay"
                            prefix={<CalendarOutlined />}
                        />
                    </Card>

                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>

                        <Statistic
                            value={overviewData?.monthCount}
                            title="Tổng lượt khám"
                            prefix={<CalendarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>

                        <Statistic
                            value={overviewData?.completeCount}
                            title="Đã hoàn thành"
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>

                        <Statistic
                            value={overviewData?.cancelCount}
                            title="Đã huỷ"
                            prefix={<CloseCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            {/* <Card
                title="Lượt khám kế tiếp"
                style={{ marginBottom: 24 }}
            >
                <Row justify="space-between">
                    <Col>
                        <div>
                            <strong>Bệnh nhân:</strong> Nguyễn Văn A<br />
                            <strong>Thời gian:</strong> 08:00 ngày 25/06/2025<br />
                            <strong>Trạng thái:</strong> Đã xác nhận
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <strong>Lý do khám:</strong> Khám tổng quát
                        </div>
                    </Col>
                </Row>
            </Card> */}

            {/* Biểu đồ */}
            <Card title="Biểu đồ lượt khám theo ngày" style={{ marginBottom: 24 }}>
                <Line {...config} />
            </Card>

            {/* Bảng lịch hẹn */}
            <Card title="Lịch hẹn gần đây">
                <Table dataSource={recentAppointments} columns={columns} pagination={false} />
            </Card>
        </div>

    )
}

export default DashboardDoctor