import { Avatar, Space, Tag } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { Typography } from "antd"
import ButtonComponent from "../ButtonComponent/ButtonComponent"
import { CardDoctorContainer } from "./style"
import { useNavigate } from "react-router-dom"
const { Text, Paragraph } = Typography
const CardDoctor = ({ doctor }) => {
    const navigate = useNavigate()
    return (
        <CardDoctorContainer
            onClick={() => navigate(`/detail-doctor/${doctor?._id}`)}
        >
            <Space direction="horizontal" style={{ gap: 16 }}>
                <Avatar size={100} icon={<UserOutlined />} />
                <Space direction="vertical">
                    <Text style={{ fontSize: '20px' }} strong>Bác sĩ {doctor?.user?.name}</Text>
                    <Tag>{doctor?.specialty?.name}</Tag>
                    <Paragraph>{doctor?.hospital?.address}</Paragraph>
                </Space>
            </Space>

            <ButtonComponent
                type="primary"
                style={{
                    padding: "8px 16px",
                }}
            >
                Đặt khám
            </ButtonComponent>
        </CardDoctorContainer>
    )
}

export default CardDoctor