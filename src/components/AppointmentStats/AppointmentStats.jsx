
import { Card, Col, Row, Statistic, Typography, Table, Tag } from 'antd';
import { Pie, Line } from '@ant-design/charts';
import { CalendarOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import StaticService from '../../services/StaticService';
import { useQuery } from '@tanstack/react-query';
import { StyledCard } from './style';
const { Title } = Typography;
const AppointmentStats = ({ dataRange }) => {
    const { data: overviewStats, isLoading } = useQuery({
        queryKey: ['overviewStats', dataRange],
        queryFn: async () => {
            const startDate = dataRange[0] ? dataRange[0].format('YYYY-MM-DD') : '';
            const endDate = dataRange[1] ? dataRange[1].format('YYYY-MM-DD') : '';
            return await StaticService.getAppointmentStats(startDate, endDate);
        },
        refetchOnWindowFocus: false,
        enabled: dataRange?.length === 2 // chỉ gọi API khi đã chọn đủ ngày
    });
    const { data: trendData } = useQuery({
        queryKey: ['appointmentTrend', dataRange],
        queryFn: async () => {
            const startDate = dataRange[0] ? dataRange[0].format('YYYY-MM-DD') : '';
            const endDate = dataRange[1] ? dataRange[1].format('YYYY-MM-DD') : '';
            return await StaticService.getAppointmentTrend({ startDate, endDate, groupBy: 'day' });
        },
        refetchOnWindowFocus: false,
        enabled: dataRange?.length === 2 // chỉ gọi API khi đã chọn đủ ngày
    });
    // Lấy dữ liệu thống kê từ API
    const totalAppointments = overviewStats?.data.totalAppointments || 0;
    const completedAppointments = overviewStats?.data.completedAppointments || 0;
    const cancelledAppointments = overviewStats?.data.cancelledAppointments || 0;
    const pendingAppointments = overviewStats?.data.pendingAppointments || 0;
    const confirmedAppointments = overviewStats?.data.confirmedAppointments || 0;
    const completionRate = overviewStats?.data.completionRate || 0;
    const cancellationRate = overviewStats?.data.cancellationRate || 0;

    const pieData = [
        { key: 'completed', type: 'Đã hoàn thành', value: completedAppointments },
        { key: 'cancelled', type: 'Đã hủy', value: cancelledAppointments },
        { key: 'pending', type: 'Chờ xác nhận', value: pendingAppointments },
        { key: 'confirmed', type: 'Đã xác nhận', value: confirmedAppointments },
    ];
    // Chuyển đổi dữ liệu xu hướng thành định dạng phù hợp với biểu đồ
    const trendDataFormatted = trendData?.data?.map(item => ({
        date: item.date,
        count: item.count,
        completed: item.completed,
    })) || [];
    const pieConfig = {
        data: pieData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'spider',
            content: (datum) => {
                const type = datum?.type ?? 'Không rõ';
                const value = typeof datum?.value === 'number' ? datum.value : 0;
                return `${type}: ${value}`;
            },
        },
        interactions: [{ type: 'element-active' }],
    };
    const lineConfig = {
        data: trendDataFormatted || [],
        xField: 'date',
        yField: 'count',
        point: { size: 4, shape: 'diamond' },
    };
    return (
        <>
            <Title level={3}>Thống kê tổng quan</Title>
            <Row gutter={16}>
                <Col span={8}>
                    <StyledCard>
                        <Statistic
                            title="Tổng số lịch hẹn"
                            value={totalAppointments}
                            prefix={<CalendarOutlined />}
                        />
                    </StyledCard>
                </Col>
                <Col span={8}>
                    <StyledCard>
                        <Statistic
                            title="Tỷ lệ hoàn thành"
                            value={completionRate}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </StyledCard>
                </Col>
                <Col span={8}>
                    <StyledCard>
                        <Statistic
                            title="Tỷ lệ huỷ"
                            value={cancellationRate}
                            prefix={<CloseCircleOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </StyledCard>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }} gutter={16}>
                <Col span={12}>
                    <Card title="Phân bổ trạng thái">
                        {overviewStats && overviewStats.data && (

                            <Pie {...pieConfig} />
                        )}
                    </Card>

                </Col>
                <Col span={12}>
                    <Card title="Xu hướng đặt lịch">
                        {trendData && trendData.data.length > 0 && (

                            <Line {...lineConfig} />
                        )}
                    </Card>
                </Col>
                {/* Bảng chi tiết */}

            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col span={24}>
                    <Card title="Chi tiết">
                        <Table
                            rowKey="key"
                            columns={[
                                { title: 'Trạng thái', dataIndex: 'type' },
                                { title: 'Số lượng', dataIndex: 'value' },
                                {
                                    title: 'Tỷ lệ',
                                    render: (_, record) => (
                                        <Tag color={
                                            record.type === 'Đã hủy' ? 'red' :
                                                record.type === 'Đã hoàn thành' ? 'green' : 'orange'
                                        }>
                                            {Math.round((record.value / totalAppointments) * 100) || 0}%
                                        </Tag>
                                    )
                                }
                            ]}
                            dataSource={pieData}
                            pagination={false}
                            loading={isLoading}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default AppointmentStats