import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { CheckCircleOutlined, TeamOutlined } from '@ant-design/icons';
import StaticService from '../../services/StaticService';
import { Pie } from '@ant-design/charts';
const { Title } = Typography;
const PatientStats = () => {
    const { data: overviewPatientStats } = useQuery({
        queryKey: ['patientOverviewStats'],
        queryFn: StaticService.getPatientOverviewStats,
        refetchOnWindowFocus: false,
    });
    const pieGenderData = [
        { type: 'Nam', value: overviewPatientStats?.data?.malePatients || 0 },
        { type: 'Nữ', value: overviewPatientStats?.data?.femalePatients || 0 },
        { type: 'Khác', value: overviewPatientStats?.data?.otherPatients || 0 },
        { type: 'Không rõ', value: overviewPatientStats?.data?.unknownPatients || 0 },
    ];
    const pieAccountData = [
        { type: 'Đã kích hoạt', value: overviewPatientStats?.data?.verifiedPatients || 0 },
        { type: 'Chưa kích hoạt', value: overviewPatientStats?.data?.unverifiedPatients || 0 },
        { type: 'Không rõ', value: overviewPatientStats?.data?.unknownPatients || 0 },
    ];

    const pieConfig = {
        data: pieGenderData,
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
                            prefix={<TeamOutlined />}
                            suffix="người"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Bệnh nhân đã kích hoạt tài khoản"
                            value={overviewPatientStats?.data?.verifiedPatients || 0}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }} gutter={16}>
                <Col span={12}>
                    <Card title="Phân bổ Giới tính">
                        <Pie {...pieConfig} />
                    </Card>

                </Col>
                <Col span={12}>
                    <Card title="Thống kê tài khoản">
                        <Pie
                            {...{
                                ...pieConfig,
                                data: pieAccountData,
                                label: {
                                    ...pieConfig.label,
                                    content: (datum) => {
                                        const type = datum?.type ?? 'Không rõ';
                                        const value = typeof datum?.value === 'number' ? datum.value : 0;
                                        return `${type}: ${value}`;
                                    },
                                },
                            }}
                        />
                    </Card>
                </Col>

            </Row>
        </>
    )
}

export default PatientStats