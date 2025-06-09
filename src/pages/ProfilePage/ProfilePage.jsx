import DefaultLayout from "../../components/DefaultLayout/DefaultLayout";
import {
    AppstoreOutlined,
    InfoCircleOutlined,
    LoginOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Menu, Avatar, Typography, Divider, Flex, Upload } from "antd";
import * as AuthService from "../../services/AuthService";
import * as UserService from "../../services/UserService";
import * as Message from "../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "../../redux/Slice/authSlice";
import { resetAppointment } from "../../redux/Slice/appointmentSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ModalUpdateUser from "../../components/ModalUpdateUser/ModalUpdateUser";
import { useMutation } from "@tanstack/react-query";
import PersonalProfile from "../../components/PersonalProfile/PersonalProfile";
import AccountInfor from "../../components/AccountInfor/AccountInfor";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import BookedAppointment from "../../components/BookedAppointment/BookedAppointment";
import { ProfilePageContainer, ProfilePageContent, LeftContent, RightContent } from "./style";
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
    const user = useSelector((state) => state.auth?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    // Kiểm tra xem có state từ navigation không
    const initialTab = location?.state?.tab || "profile"; // Mặc định là "profile" nếu không có state
    const [selectedKey, setSelectedKey] = useState(initialTab);
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
    useEffect(() => {
        // Cập nhật selectedKey khi có thay đổi từ location state
        if (location?.state?.tab && location.pathname === "/profile" && location.state.tab !== selectedKey) {
            setSelectedKey(location.state.tab);
        }
    }, [location?.state])
    const renderContent = () => {
        switch (selectedKey) {
            case "profile":
                return (
                    <PersonalProfile user={user} onClick={() => setIsModalOpen(true)} />
                )
            case "account":
                return (
                    <AccountInfor
                        user={user}
                        handleChangeProfile={() => setSelectedKey('profile')}
                    />
                )
            case "appointments":
                return (
                    <BookedAppointment userId={user?.id} />
                )
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
    const handleUpload = async (file) => {
        const formData = new FormData();

        formData.append("avatar", file?.file);
        try {
            const res = await UserService.uploadAvatar(user.id, formData);
            if (res.status === "success") {
                Message.success("Cập nhật ảnh đại diện thành công");
                const updatedUser = { ...user, avatar: res.data.avatar };
                dispatch(updateUser(updatedUser));
            } else {
                Message.error(res.message || "Cập nhật ảnh đại diện thất bại");
            }
        } catch (error) {
            Message.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật ảnh đại diện");
        }
    }
    return (
        <DefaultLayout>
            <ProfilePageContainer>
                <ProfilePageContent>
                    {/* Left: Avatar + Menu */}
                    <LeftContent>
                        <Avatar
                            size={80}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: "#1890ff", marginBottom: "10px" }}
                            src={user?.avatar?.startsWith("https") ? user?.avatar : `${import.meta.env.VITE_APP_BACKEND_URL}${user?.avatar}`}
                        />
                        <Upload
                            showUploadList={false}
                            beforeUpload={() => false} // Chặn auto upload
                            onChange={handleUpload}
                            accept="image/*"
                            style={{ marginBottom: "10px" }}
                        >
                            <ButtonComponent type="primary" size="small">
                                Cập nhật ảnh đại diện
                            </ButtonComponent>
                        </Upload>
                        <Title level={5} style={{ margin: 0 }}>
                            {user?.name || "Người dùng"}
                        </Title>
                        <Text type="secondary">Bệnh nhân</Text>
                        <Divider />
                        <Menu
                            onClick={handleMenuClick}
                            defaultOpenKeys={["info"]}
                            selectedKeys={[selectedKey]}
                            mode="inline"
                            items={items}
                        />
                    </LeftContent>
                    {/* Right: Content */}
                    <RightContent>
                        {renderContent()}
                    </RightContent>
                </ProfilePageContent>
            </ProfilePageContainer>
            <ModalUpdateUser
                isModalOpen={isModalOpen}
                handleUpdateProfile={handleUpdateProfile}
                isPendingUpdateProfile={isPendingUpdateProfile}
                patient={user}
                onCancel={() => setIsModalOpen(false)}
            />
        </DefaultLayout>
    );
};

export default ProfilePage;
