import { useQuery } from '@tanstack/react-query';
import { Col, Row, Statistic, Typography, Table, Tag } from 'antd';
import StaticService from '../../services/StaticService';
import { CalendarOutlined, SolutionOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { StyledCard } from './style';
import TopDoctorCard from '../TopDoctorCard/TopDoctorCard';
const { Title } = Typography;
const DoctorStats = ({ dataRange }) => {
    const { data: doctorOverviewStats } = useQuery({
        queryKey: ['doctorStats', dataRange],
        queryFn: async () => {
            const startDate = dataRange[0] ? dataRange[0].format('YYYY-MM-DD') : '';
            const endDate = dataRange[1] ? dataRange[1].format('YYYY-MM-DD') : '';
            return await StaticService.getDoctorOverviewStats({
                startDate,
                endDate
            })
        },
        refetchOnWindowFocus: false,
        enabled: dataRange?.length === 2 // chỉ gọi API khi đã chọn đủ ngày
    });
    const { data: doctorStatsBySpecialty } = useQuery({
        queryKey: ['doctorStatsBySpecialty', dataRange],
        queryFn: async () => {
            const startDate = dataRange[0] ? dataRange[0].format('YYYY-MM-DD') : '';
            const endDate = dataRange[1] ? dataRange[1].format('YYYY-MM-DD') : '';
            return await StaticService.getDoctorStatsBySpecialty({
                startDate,
                endDate
            })
        },
        refetchOnWindowFocus: false,
        enabled: dataRange?.length === 2 // chỉ gọi API khi đã chọn đủ ngày
    });
    const columns = [
        {
            title: 'Chuyên khoa',
            dataIndex: 'specialtyName',
            key: 'specialtyName',
        },
        {
            title: 'Số bác sĩ',
            dataIndex: 'doctorCount',
            key: 'doctorCount',
            align: 'center',
        },
        {
            title: 'Lượt hẹn',
            dataIndex: 'totalAppointments',
            key: 'totalAppointments',
            align: 'center',
        },
        {
            title: 'Hoàn tất',
            dataIndex: 'completedAppointments',
            key: 'completedAppointments',
            align: 'center',
        },
        {
            title: 'Tỷ lệ hoàn thành',
            dataIndex: 'completionRate',
            key: 'completionRate',
            align: 'center',
            render: (value) => (
                <Tag color={value >= 80 ? 'green' : value >= 50 ? 'orange' : 'red'}>
                    {value}%
                </Tag>
            ),
        },
    ];
    const statsOverview = doctorOverviewStats?.data || {};
    const statsDoctorBySpecialty = doctorStatsBySpecialty?.data || [];
    return (
        <>
            <Title level={3}>Thống kê tổng quan</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                {[
                    {
                        title: "Tổng số bác sĩ",
                        value: statsOverview.totalDoctors || 0,
                        icon: <SolutionOutlined />,
                    },
                    {
                        title: "Tổng số cuộc hẹn",
                        value: statsOverview.totalAppointments || 0,
                        icon: <CalendarOutlined />,
                    },
                    {
                        title: "Tổng số cuộc hẹn đã hoàn thành",
                        value: statsOverview.totalCompleted || 0,
                        icon: <CheckCircleOutlined />,
                        valueStyle: { color: "#3f8600" },
                    },
                    {
                        title: "Tổng số cuộc hẹn đã huỷ",
                        value: statsOverview.totalCancelled || 0,
                        icon: <CloseCircleOutlined />,
                        valueStyle: { color: "#cf1322" },
                    },
                    {
                        title: "Tỷ lệ hoàn thành",
                        value: statsOverview.averageCompletionRate
                            ? `${statsOverview.averageCompletionRate}%`
                            : "0%",
                        icon: <CheckCircleOutlined />,
                        valueStyle: { color: "#3f8600" },
                    },
                    {
                        title: "Tỷ lệ huỷ",
                        value: statsOverview.averageCancellationRate
                            ? `${statsOverview.averageCancellationRate}%`
                            : "0%",
                        icon: <CloseCircleOutlined />,
                        valueStyle: { color: "#cf1322" },
                    },
                ].map((item, index) => (
                    <Col
                        key={index}
                        xs={24} // full width on mobile
                        sm={12} // 2 columns on small screen
                        md={8} // 3 columns on medium+
                    >
                        <StyledCard>
                            <Statistic
                                title={item.title}
                                value={item.value}
                                prefix={item.icon}
                                valueStyle={item.valueStyle}
                            />
                        </StyledCard>
                    </Col>
                ))}
            </Row>
            {statsOverview.topDoctor && (
                <TopDoctorCard topDoctor={statsOverview.topDoctor} />
            )}
            <Title level={3} style={{ marginTop: '24px' }}>Thống kê theo chuyên khoa</Title>
            <Row gutter={[16, 16]}>

                <Col span={24}>
                    <Table
                        columns={columns}
                        dataSource={statsDoctorBySpecialty}
                        rowKey="specialtyId"
                        pagination={{ pageSize: 8 }}
                    />
                </Col>
                <Col span={24}>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={statsDoctorBySpecialty}>
                            <XAxis dataKey="specialtyName" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="totalAppointments" fill="#1890ff" name="Lượt hẹn" />
                            <Bar dataKey="completedAppointments" fill="#52c41a" name="Hoàn tất" />
                        </BarChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
        </>
    );
}

export default DoctorStats