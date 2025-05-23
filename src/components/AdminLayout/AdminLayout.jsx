import {
    Layout,
    Menu,
    Breadcrumb,
    theme,
    Avatar,
    Badge,
    Popover,
    Grid,
} from "antd";
import {
    DashboardOutlined,
    CalendarOutlined,
    TeamOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserOutlined,
    CaretDownOutlined,
    BellOutlined,
    InfoCircleFilled,
    CaretRightOutlined,
    SettingFilled,
    MedicineBoxOutlined,
    SolutionOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

import { useState, useMemo } from "react";
import { PopupItem } from "./style";
import { useSelector } from "react-redux";
const { Header, Sider, Content, Footer } = Layout;

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const [collapsed, setCollapsed] = useState(false);
    const [isOpenPopupUser, setIsOpenPopupUser] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const breadcrumbNameMap = {
        "/admin": "Quản trị",
        "/admin/dashboard": "Thống kê",
        "/admin/appointments": "Lịch hẹn",
        "/admin/doctors": "Bác sĩ",
        "/admin/hospitals": "Bệnh viện",
        "/admin/specilties": "Chuyên khoa",
        "/admin/patients": "Người dùng",
        "/admin/doctor-schedules": "Lịch làm việc",
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
        {
            key: "/admin/dashboard",
            icon: <DashboardOutlined />,
            label: "Thống kê",
        },
        {
            key: "/admin/patients",
            icon: <TeamOutlined />,
            label: "Quản lý người dùng",
        },
        {
            icon: <SolutionOutlined />,
            label: "Quản lý bác sĩ",
            children: [
                { key: "/admin/doctors", label: "Bác sĩ" },
                { key: "/admin/specilties", label: "Chuyên khoa" },
                { key: "/admin/doctor-schedules", label: "Lịch làm việc" },
            ],
        },
        {
            key: "/admin/hospitals",
            icon: <MedicineBoxOutlined />,
            label: "Quản lý bệnh viện",
        },
        {
            key: "/admin/appointments",
            icon: <CalendarOutlined />,
            label: "Quản lý Lịch hẹn",
        },

        { key: "/logout", icon: <LogoutOutlined />, label: "Đăng xuất" },
    ];

    const handleMenuClick = ({ key }) => {
        if (key === "/logout") {
            // Xử lý logout nếu cần
            return;
        }
        navigate(key);
    };
    const handleLogoutUser = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };
    // Nội dung dropdown menu
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
                        $isSelected={location.pathname === "/admin"}
                        onClick={() => navigate("/admin")}
                    >
                        <SettingFilled
                            style={{ fontSize: "15px", marginRight: "8px" }}
                        />
                        Quản lý hệ thống
                    </PopupItem>
                )}
                <PopupItem onClick={() => navigate("/order")}>
                    <InfoCircleFilled
                        style={{ fontSize: "15px", marginRight: "8px" }}
                    />
                    Đơn hàng của tôi
                </PopupItem>
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
            >
                <div
                    className="logo"
                    style={{
                        padding: 16,
                        fontSize: 20,
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#1890ff",
                    }}
                >
                    Medicare
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    onClick={handleMenuClick}
                    defaultSelectedKeys={["/admin/dashboard"]}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        background: "#fff",
                        padding: 0,
                        textAlign: "right",
                        paddingRight: 24,
                    }}
                >
                    {screens.md && (
                        <ButtonComponent
                            type="default"
                            icon={
                                <Badge count={1}>
                                    <BellOutlined
                                        style={{ fontSize: "25px" }}
                                    />
                                </Badge>
                            }
                            styleButton={{
                                marginRight: "16px",
                                border: "1px solid #1890ff",
                            }}
                            size="middle"
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
                                    border: "1px solid #1890ff",
                                    marginRight: "16px",
                                }}
                                icon={
                                    <Avatar
                                        size={35}
                                        icon={<UserOutlined />}
                                        style={{ backgroundColor: "#87d068" }}
                                    />
                                }
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
                    Admin Dashboard
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
