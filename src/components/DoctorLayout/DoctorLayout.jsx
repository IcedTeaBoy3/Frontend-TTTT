import {
    Layout,
    Menu,
    Breadcrumb,
    theme,
    Badge,
    Popover,
    Grid,
    Image,
    Typography,
} from "antd";
import {
    DashboardOutlined,
    CalendarOutlined,
    LogoutOutlined,
    UserOutlined,
    BellOutlined,
    InfoCircleFilled,
    SettingFilled,
    MedicineBoxOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useState, useMemo } from "react";
import { PopupItem } from "./style";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/Slice/authSlice";
import { resetAppointment } from "../../redux/Slice/appointmentSlice";
import { resetDoctor } from "../../redux/Slice/doctorSlice";
import * as AuthService from "../../services/AuthService";
import * as Message from "../Message/Message";

const { Header, Sider, Content, Footer } = Layout;
const { Text, Paragraph } = Typography;

const DoctorLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const [collapsed, setCollapsed] = useState(false);
    const [isOpenPopupUser, setIsOpenPopupUser] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const breadcrumbNameMap = {
        "/doctor": "Quản trị",
        "/doctor/dashboard": "Thống kê",
        "/doctor/appointments": "Lịch hẹn",
        "/doctor/doctor-schedules": "Lịch làm việc",
        "/doctor/profile": "Thông tin cá nhân",
    };

    const pathSnippets = location.pathname.split("/").filter((i) => i);

    const breadcrumbItems = [
        {
            title: "Trang chủ",
            key: "home",
        },
        ...pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
            return {
                title: breadcrumbNameMap[url] || url,
                key: url,
            };
        }),
    ];
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        { key: "/doctor/dashboard", icon: <DashboardOutlined />, label: "Thống kê" },
        { key: "/doctor/appointments", icon: <CalendarOutlined />, label: "Lịch hẹn" },
        { key: "/doctor/doctor-schedules", icon: <MedicineBoxOutlined />, label: "Lịch làm việc" },
        { key: "/doctor/profile", icon: <UserOutlined />, label: "Thông tin cá nhân" },

        { key: "/logout", icon: <LogoutOutlined />, label: "Đăng xuất" },
    ];

    const handleMenuClick = ({ key }) => {
        if (key === "/logout") {
            handleLogoutUser();
            return;
        }
        navigate(key);
    };
    const handleLogoutUser = async () => {
        try {
            const res = await AuthService.logoutUser();
            if (res.status === "success") {
                dispatch(logout());
                dispatch(resetAppointment());
                dispatch(resetDoctor());
                Message.success(res.message || "Đăng xuất thành công");
                navigate("/authentication");
            } else {
                Message.error(res.message || "Đăng xuất không thành công");
            }
        } catch (error) {
            Message.error(error.message);
        }
    }
    const content = useMemo(
        () => (
            <>
                <PopupItem onClick={() => navigate("/profile")}>
                    <InfoCircleFilled
                        style={{ fontSize: "15px", marginRight: "8px" }}
                    />
                    Thông tin người dùng
                </PopupItem>
                {user?.role === "admin" && (
                    <PopupItem
                        $isSelected={location.pathname.includes("admin")}
                        onClick={() => navigate("/admin")}
                    >
                        <SettingFilled
                            style={{ fontSize: "15px", marginRight: "8px" }}
                        />
                        Quản lý hệ thống
                    </PopupItem>
                )}
                <PopupItem onClick={handleLogoutUser}>
                    <LogoutOutlined
                        style={{ fontSize: "15px", marginRight: "8px" }}
                    />
                    Đăng xuất
                </PopupItem>
            </>
        ),
        [user?.role],
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                breakpoint="lg"
                collapsible
                collapsed={collapsed}
                collapsedWidth={0} // Ẩn hoàn toàn khi nhỏ hơn lg
                onCollapse={(collapsed) => setCollapsed(collapsed)}
                style={{
                    backgroundColor: "#fff",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16, // Khoảng cách giữa logo và tên
                        padding: "5px 0px",
                        borderRadius: 8,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/")}
                >
                    <Image
                        width={55}
                        src={`${import.meta.env.VITE_APP_FRONTEND_URL}/mylogo.webp`}
                        preview={false}
                        style={{
                            borderRadius: "50%",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                        alt="Logo Medicare"
                    />
                    <Paragraph
                        style={{
                            margin: 0,
                            fontSize: 22,
                            fontWeight: 'bolder',
                            color: "#1890ff",
                        }}
                    >
                        Medicare
                    </Paragraph>
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    onClick={handleMenuClick}
                    defaultSelectedKeys={["/admin/dashboard"]}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        background: "rgb(25 117 220)",
                        padding: 0,
                        textAlign: "right",
                        paddingRight: 20,
                        borderBottom: "1px solid #e8e8e8",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                    }}
                >
                    {screens.md && (
                        <ButtonComponent
                            type="default"
                            icon={
                                <Badge count={1}>
                                    <BellOutlined
                                        style={{ fontSize: "20px" }}
                                    />
                                </Badge>
                            }
                            styleButton={{
                                marginRight: "16px",
                            }}
                        />
                    )}

                    {user?.access_token && (
                        <Popover
                            content={content}
                            open={isOpenPopupUser}
                            onOpenChange={(visible) =>
                                setIsOpenPopupUser(visible)
                            }
                            placement="bottomRight"
                        >
                            <ButtonComponent
                                type="default"
                                size="middle"
                                styleButton={{

                                    marginRight: "16px",
                                }}
                                icon={<UserOutlined />}
                                onClick={() => navigate("/profile")}
                            >
                                {user?.name ||
                                    user?.email ||
                                    "Xin chào, Admin!"}
                            </ButtonComponent>
                        </Popover>
                    )}
                </Header>
                <Content style={{ margin: 16, overflow: "auto" }}>
                    <Breadcrumb
                        style={{ margin: "16px 0" }}
                        items={breadcrumbItems}
                    ></Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    © {new Date().getFullYear()} Hệ thống đặt lịch khám bệnh |
                    Doctor Dashboard
                </Footer>
            </Layout>
        </Layout>
    )
}

export default DoctorLayout