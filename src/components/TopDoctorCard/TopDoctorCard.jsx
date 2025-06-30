import { Card, Typography, Tag, Statistic, Row, Col, Avatar } from "antd";
import styled from "styled-components";
import {
    UserOutlined,
    MailOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
`;

const TagContainer = styled.div`
  margin-top: 8px;
`;

const TopDoctorCard = ({ topDoctor }) => {
    return (
        <StyledCard title="Bác sĩ nổi bật" variant="outlined">
            <Title level={4}>
                <Avatar
                    size={64}
                    src={`${import.meta.env.VITE_APP_BACKEND_URL}${topDoctor.avatar}`}
                    icon={<UserOutlined />}
                    style={{ marginRight: "8px" }}
                />
                {topDoctor.name}
            </Title>
            <Text type="secondary">
                <MailOutlined /> {topDoctor.email}
            </Text>

            <TagContainer>
                {topDoctor.specialties.map((specialty, index) => (
                    <Tag color="blue" key={index}>
                        {specialty}
                    </Tag>
                ))}
            </TagContainer>

            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col span={8}>
                    <Statistic
                        title="Tổng cuộc hẹn"
                        value={topDoctor.totalAppointments}
                        prefix={<CalendarOutlined />}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="Hoàn thành"
                        value={`${topDoctor.completionRate}%`}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: "#3f8600" }}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="Đã huỷ"
                        value={`${topDoctor.cancellationRate}%`}
                        prefix={<CloseCircleOutlined />}
                        valueStyle={{ color: "#cf1322" }}
                    />
                </Col>
            </Row>
        </StyledCard>
    );
};

export default TopDoctorCard;
