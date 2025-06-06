import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Row, Statistic, Typography, Table, Tag } from 'antd';
import StaticService from '../../services/StaticService';
import { CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
const { Title } = Typography;
const DoctorStats = ({ dataRange }) => {
    const { data: doctorStats, isLoading } = useQuery({
        queryKey: ['doctorStats', dataRange],
        queryFn: async () => {
            const startDate = dataRange[0] ? dataRange[0].format('YYYY-MM-DD') : '';
            const endDate = dataRange[1] ? dataRange[1].format('YYYY-MM-DD') : '';
            return await StaticService.getDoctorStats(startDate, endDate);
        },
        refetchOnWindowFocus: false,
        enabled: dataRange?.length === 2 // chỉ gọi API khi đã chọn đủ ngày
    });
    const {
        totalDoctors = 0,
        stats,
    } = doctorStats?.data || {};
    const columns = [
        { title: 'Bác sĩ', dataIndex: 'doctorName' },
        { title: 'Chuyên khoa', dataIndex: 'specialty' },
        { title: 'Tổng lượt khám', dataIndex: 'totalAppointments' },
        {
            title: 'Tỷ lệ hoàn thành',
            dataIndex: 'completionRate',
            render: rate => (
                <Tag color={rate > 80 ? 'green' : rate > 50 ? 'orange' : 'red'}>
                    {rate}%
                </Tag>
            )
        }
    ];
    return (
        <>
            <Title level={3}>Thống kê tổng quan</Title>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng số bác sĩ"
                            value={totalDoctors}
                            prefix={<CalendarOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            <Card title="Thống kê bác sĩ">
                <Table
                    columns={columns}
                    dataSource={stats || []}
                    loading={isLoading}
                    rowKey="doctorId"
                />
            </Card>
        </>
    )
}

export default DoctorStats