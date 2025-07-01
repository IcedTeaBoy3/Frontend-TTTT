import { formatDateToDDMMYYYY } from "../../utils/dateUtils";
import { convertGender } from "../../utils/convertGender";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { UserOutlined, WarningOutlined, MailOutlined, PhoneOutlined, ManOutlined, IdcardOutlined, CreditCardOutlined, FlagOutlined, ToolOutlined, EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import { Typography, Divider, Flex, Row, Col } from "antd";
import { StyleText } from "./style";
const { Title, Text, Paragraph } = Typography;

const PersonalProfile = ({ user, onClick }) => {
    return (
        <>
            <Title level={3}>Thông tin của bạn</Title>
            <Text type="secondary">
                Đây là nơi bạn có thể xem và chỉnh sửa thông tin cá nhân của mình.
            </Text>
            <Paragraph style={{ backgroundColor: "#fed7aa", padding: "10px" }}>
                <WarningOutlined /> Hoàn thiện thông tin để đặt khám và quản lý hồ sơ y tế được tốt hơn.
            </Paragraph>
            <Divider></Divider>
            <Row gutter={[32, 16]}>
                <Col xs={24} md={12}>
                    <Flex vertical gap={8}>
                        <Title level={4}>Thông tin cơ bản</Title>
                        <StyleText><strong><UserOutlined /> Họ và tên:</strong> {user?.name || "--"}</StyleText>
                        <StyleText><strong><MailOutlined /> Email:</strong> {user?.email || "--"}</StyleText>
                        <StyleText><strong><PhoneOutlined /> Số điện thoại:</strong> {user?.phone || "--"}</StyleText>
                        <StyleText><strong><CalendarOutlined /> Ngày sinh:</strong> {formatDateToDDMMYYYY(user?.dateOfBirth) || "--"}</StyleText>
                        <StyleText><strong><ManOutlined /> Giới tính:</strong> {convertGender(user?.gender) || "--"}</StyleText>
                        <StyleText><strong><EnvironmentOutlined /> Địa chỉ:</strong> {user?.address || "--"}</StyleText>
                    </Flex>
                    <ButtonComponent
                        type="primary"
                        style={{ marginTop: 24, width: "100%" }}
                        onClick={onClick}
                    >
                        <UserOutlined style={{ marginRight: 8 }} />
                        Chỉnh sửa thông tin
                    </ButtonComponent>
                </Col>

                <Col xs={24} md={12}>
                    <Flex vertical gap={8}>
                        <Title level={4}>Thông tin bổ sung</Title>
                        <StyleText><strong><IdcardOutlined /> Mã BHYT:</strong> {user?.insuranceCode || "--"}</StyleText>
                        <StyleText><strong><CreditCardOutlined /> Số CMND/CCCD:</strong> {user?.idCard || "--"}</StyleText>
                        <StyleText><strong><FlagOutlined /> Dân tộc:</strong> {user?.ethnic || "--"}</StyleText>
                        <StyleText><strong><ToolOutlined /> Nghề nghiệp:</strong> {user?.job || "--"}</StyleText>
                    </Flex>
                </Col>
            </Row>

        </>
    )
}

export default PersonalProfile