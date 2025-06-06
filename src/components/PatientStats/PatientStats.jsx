import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import StaticService from '../../services/StaticService';
import { CalendarOutlined } from '@ant-design/icons';
import { Pie } from '@ant-design/charts';
const { Title } = Typography;
const PatientStats = () => {
    const { data: overviewPatientStats, isLoading, error } = useQuery({
        queryKey: ['patientOverviewStats'],
        queryFn: StaticService.getPatientOverviewStats,
        refetchOnWindowFocus: false,
    });
    const pieConfig = {
        data: overviewPatientStats?.data?.genderDistribution || [],
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

    return (
        <>
            <Title level={3}>Thống kê tổng quan</Title>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng số bệnh nhân"
                            value={overviewPatientStats?.data?.totalPatients || 0}
                            prefix={<CalendarOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Bệnh nhân đã kích hoạt tài khoản"
                            value={overviewPatientStats?.data?.patientsActiveAccounts || 0}
                            prefix={<CalendarOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }} gutter={16}>
                <Col span={12}>
                    <Card title="Phân bổ Giới tính">
                        {overviewPatientStats && overviewPatientStats.data && (

                            <Pie {...pieConfig} />
                        )}
                    </Card>

                </Col>

            </Row>
        </>
    )
}

export default PatientStats