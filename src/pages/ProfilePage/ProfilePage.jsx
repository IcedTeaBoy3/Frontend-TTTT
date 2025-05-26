import DefaultLayout from "../../components/DefaultLayout/DefaultLayout";
import {
    AppstoreOutlined,
    InfoCircleOutlined,
    LoginOutlined,
    UserOutlined,
    WarningOutlined,
    MailOutlined,
    PhoneOutlined,
    ManOutlined,
    IdcardOutlined,
    CreditCardOutlined,
    FlagOutlined,
    ToolOutlined,
    EnvironmentOutlined,
    CalendarOutlined
} from "@ant-design/icons";
import { Menu, Avatar, Typography, Divider, Flex } from "antd";
import { useSelector } from "react-redux";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import * as AuthService from "../../services/AuthService";
import * as UserService from "../../services/UserService";
import * as Message from "../../components/Message/Message";
import { useDispatch } from "react-redux";
import { logout, updateUser } from "../../redux/Slice/authSlice";
import { resetAppointment } from "../../redux/Slice/appointmentSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ModalUpdateUser from "../../components/ModalUpdateUser/ModalUpdateUser";
import { useMutation } from "@tanstack/react-query";
import { formatDateToDDMMYYYY } from "../../utils/dateUtils";
import { convertGender } from "../../utils/convertGender";
const { Title, Text, Paragraph } = Typography;

const items = [
    {
        key: "info",
        label: "Thông tin cá nhân",
        icon: <InfoCircleOutlined />,
        children: [
            { key: "profile", label: "Hồ sơ" },
            { key: "account", label: "Tài khoản" },
        ],
    },
    {
        key: "appointments",
        label: "Lịch hẹn đã đặt",
        icon: <AppstoreOutlined />,
    },
    {
        type: "divider",
    },
    {
        key: "logout",
        label: "Đăng xuất",
        icon: <LoginOutlined />,
    },
];

const ProfilePage = () => {
    const user = useSelector((state) => state.auth.user);
    const patient = useSelector((state) => state.appointment.patient);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedKey, setSelectedKey] = useState("profile");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const mutationUpdateUpdateProfile = useMutation({
        mutationFn: (data) => {
            const { id, ...updateData } = data;
            return UserService.updateUser(id, updateData);
        },
        onSuccess: (res) => {
            if (res?.status === "success") {
                Message.success(res?.message);
                setIsModalOpen(false);
                const { _id, createdAt, updatedAt, __v, password, ...updatedData } = res.data;
                dispatch(updateUser(updatedData));
            } else {
                Message.error(res?.message);
            }
        },
        onError: (error) => {
            Message.error(error?.response?.data?.message || "Có lỗi xảy ra");
        }
    })
    const { isPending: isPendingUpdateProfile } = mutationUpdateUpdateProfile;
    const renderContent = () => {
        switch (selectedKey) {
            case "profile":
                return (
                    <>
                        <Title level={3}>Thông tin của bạn</Title>
                        <Text type="secondary">
                            Đây là nơi bạn có thể xem và chỉnh sửa thông tin cá nhân của mình.
                        </Text>
                        {/* Nội dung chi tiết từng mục sẽ hiển thị tại đây */}
                        <Paragraph style={{ backgroundColor: "#fed7aa", padding: "10px" }}>
                            <WarningOutlined /> Hoàn thiện thông tin để đặt khám và quản lý hồ sơ y tế được tốt hơn.
                        </Paragraph>
                        <Divider></Divider>
                        <Flex justify="space-between" align="flex-start" style={{ gap: 48 }}>
                            {/* Cột Thông tin cơ bản */}
                            <Flex vertical style={{ flex: 1, borderRight: '1px solid #dfdfdf' }} gap={8}>
                                <Title level={4}>Thông tin cơ bản</Title>
                                <Text style={{ fontSize: 16 }}><strong><UserOutlined /> Họ và tên:</strong> {user?.name || "--"}</Text>
                                <Text style={{ fontSize: 16 }}><strong><MailOutlined /> Email:</strong> {user?.email || "--"}</Text>
                                <Text style={{ fontSize: 16 }}><strong><PhoneOutlined /> Số điện thoại:</strong> {user?.phone || "--"}</Text>
                                <Text style={{ fontSize: 16 }}><strong><CalendarOutlined /> Ngày sinh:</strong> {formatDateToDDMMYYYY(user?.dateOfBirth) || "--"}</Text>
                                <Text style={{ fontSize: 16 }}><strong>	<ManOutlined /> Giới tính:</strong> {convertGender(user?.gender) || "--"}</Text>
                                <Text style={{ fontSize: 16 }}><strong><EnvironmentOutlined /> Địa chỉ:</strong> {user?.address || "--"}</Text>
                            </Flex>

                            {/* Cột Thông tin bổ sung */}
                            <Flex vertical style={{ flex: 1 }} gap={8}>
                                <Title level={4}>Thông tin bổ sung</Title>
                                <Text style={{ fontSize: 16 }}><strong><IdcardOutlined /> Mã BHYT:</strong> {user?.insuranceCode || "--"}</Text>
                                <Text style={{ fontSize: 16 }}><strong><CreditCardOutlined /> Số CMND/CCCD:</strong> {user?.idCard || "--"}</Text>
                                <Text style={{ fontSize: 16 }}><strong><FlagOutlined /> Dân tộc:</strong> {user?.ethnic || "--"}</Text>
                                <Text style={{ fontSize: 16 }}><strong><ToolOutlined /> Nghề nghiệp:</strong> {user?.job || "--"}</Text>
                            </Flex>
                        </Flex>
                        <ButtonComponent
                            type="primary"
                            style={{ marginTop: 24, width: "30%" }}
                            size="large"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <UserOutlined style={{ marginRight: 8 }} />
                            Chỉnh sửa thông tin
                        </ButtonComponent>
                    </>
                )
            case "account":
                return <div>💳 Thông tin bảo hiểm</div>;
            case "appointments":
                return <div>📅 Lịch sử khám</div>;
            default:
                return <div>Chọn một mục từ menu</div>;
        }
    };
    const handleMenuClick = ({ key }) => {
        setSelectedKey(key);
        if (key === "logout") {
            handleLogoutUser();
        }
    };
    const handleLogoutUser = async () => {
        try {
            const res = await AuthService.logoutUser();
            if (res.status === "success") {
                dispatch(logout());
                dispatch(resetAppointment());
                navigate("/", {
                    state: {
                        message: "Đăng xuất thành công",
                    },
                });
            } else {
                Message.error(res.message || "Đăng xuất không thành công");
            }
        } catch (error) {
            Message.error("Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại sau." + error.message);
        }
    }
    const handleUpdateProfile = async (data) => {
        mutationUpdateUpdateProfile.mutate(data);
    }
    return (
        <DefaultLayout>
            <div
                style={{
                    minHeight: "100vh",
                    maxWidth: "1200px",
                    width: "100%",
                    padding: "85px 0px",
                    margin: "0 auto",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                        width: "100%",
                        flexWrap: "wrap",
                    }}
                >
                    {/* Left: Avatar + Menu */}
                    <div
                        style={{
                            padding: "24px",
                            minWidth: "260px",
                            backgroundColor: "#f0f0f0",
                            borderRight: "1px solid #e0e0e0",
                        }}
                    >
                        <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <Avatar
                                size={80}
                                icon={<UserOutlined />}
                                style={{ backgroundColor: "#1890ff", marginBottom: "10px" }}
                            />

                            <Title level={5} style={{ margin: 0 }}>
                                {user?.name || "Người dùng"}
                            </Title>
                            <Text type="secondary">Bệnh nhân</Text>
                            <Divider></Divider>
                        </div>
                        <Menu
                            onClick={handleMenuClick}
                            defaultOpenKeys={["info"]}
                            selectedKeys={[selectedKey]}
                            mode="inline"
                            items={items}
                        />
                    </div>

                    {/* Right: Content */}
                    <div style={{ flex: 1, padding: "30px" }}>
                        {renderContent()}

                    </div>
                </div>
            </div>
            <ModalUpdateUser
                isModalOpen={isModalOpen}
                handleUpdateProfile={handleUpdateProfile}
                isPendingUpdateProfile={isPendingUpdateProfile}
                onCancel={() => setIsModalOpen(false)}
            />
        </DefaultLayout>
    );
};

export default ProfilePage;
