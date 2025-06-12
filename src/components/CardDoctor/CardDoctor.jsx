import { Avatar, Space, Tag } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { Typography } from "antd"
import ButtonComponent from "../ButtonComponent/ButtonComponent"
import { CardDoctorContainer } from "./style"
const { Text, Paragraph } = Typography
const CardDoctor = ({ doctor, isClinic, onClick }) => {
    return (
        <CardDoctorContainer
            onClick={onClick}
        >
            <Space direction="horizontal" style={{ gap: 16 }}>
                <Avatar size={100} icon={<UserOutlined />} src={isClinic ? `${import.meta.env.VITE_APP_BACKEND_URL}${doctor?.thumbnail}` : `${import.meta.env.VITE_APP_BACKEND_URL}${doctor?.image}`} />
                <Space direction="vertical">
                    <Text style={{ fontSize: '20px' }} strong>{isClinic ? 'Phòng khám' : 'Bác sĩ'} {doctor?.user?.name || doctor?.name}</Text>
                    {doctor?.specialties?.length > 0 ? (
                        <Space direction="horizontal" style={{ gap: 8 }}>
                            {doctor?.specialties?.map((item) => (
                                <Tag color="blue">
                                    {item.name}
                                </Tag>
                            ))}
                        </Space>
                    ) : (
                        <Tag color="blue">{doctor.specialty?.name}</Tag>
                    )}
                    <Paragraph>{doctor?.hospital?.address || doctor?.address}</Paragraph>
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