import { useState, useMemo } from "react";
import React from "react";
import { Row, Col, Image, Popover, Drawer, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
    HeaderContainer,
    LogoSection,
    BrandTitle,
    NavButtons,
    PopupItem,
    MobileMenuButton,
} from "./style";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import {
    CustomerServiceOutlined,
    UserOutlined,
    InfoCircleFilled,
    SettingFilled,
    LogoutOutlined,
    CaretDownOutlined,
    MenuOutlined,
    HistoryOutlined,
    HomeFilled,
    MedicineBoxOutlined,
    SolutionOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/Slice/authSlice";
import { resetAppointment } from "../../redux/Slice/appointmentSlice";
import { resetDoctor } from "../../redux/Slice/doctorSlice";
import * as Message from "../Message/Message";
import * as AuthService from "../../services/AuthService";
const HeaderComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.role === "admin";
    const isDoctor = user?.role === "doctor";
    const [isOpenPopupUser, setIsOpenPopupUser] = useState(false);
    const [isOpenPopupBooked, setIsOpenPopupBooked] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleNavigate = (path) => {
        navigate(path);
        setIsDrawerOpen(false);
    }
    const handleLogoutUser = async () => {
        const res = await AuthService.logoutUser();
        if (res?.status == "success") {
            Message.success(res?.message);
            navigate("/authentication");
            setIsOpenPopupUser(false);
            dispatch(logout());
            dispatch(resetAppointment());
            dispatch(resetDoctor());
        } else if (res?.status == "error") {
            Message.error(res?.message);
        }
    };
    const bookedMenuItems = [
        {
            key: "booked-doctor",
            label: "Đặt khám bác sĩ",
            icon: <SolutionOutlined />,
            onClick: () => handleNavigate("/search?type=doctor"),
        },
        {
            key: "booked-hospital",
            label: "Đặt khám phòng khám",
            icon: <MedicineBoxOutlined />,
            onClick: () => handleNavigate("/search?type=hospital"),
        },
    ];
    const getMenuItems = () => {
        const menu = [
            {
                key: "profile",
                label: "Thông tin người dùng",
                icon: <InfoCircleFilled />,
                onClick: () => {
                    navigate("/profile", {
                        state: { tab: "profile" },
                    });
                    setIsDrawerOpen(false);
                },
                isSelected: location.pathname === "/profile",
            },
            isAdmin && {
                key: "admin",
                label: "Quản lý hệ thống",
                icon: <SettingFilled />,
                onClick: () => handleNavigate("/admin"),
                isSelected: location.pathname.includes("/admin"),
            },
            isDoctor && {
                key: "doctor",
                label: "Bác sĩ",
                icon: <SettingFilled />,
                onClick: () => handleNavigate("/doctor"),
                isSelected: location.pathname.includes("/doctor"),
            },
            {
                key: "appointments",
                label: "Lịch sử đặt khám",
                icon: <HistoryOutlined />,
                onClick: () => {
                    navigate("/profile", {
                        state: { tab: "appointments" },
                    });
                    setIsDrawerOpen(false);
                },
                isSelected: location.state?.tab === "appointments",
            },
            {
                key: "logout",
                label: "Đăng xuất",
                icon: <LogoutOutlined />,
                onClick: handleLogoutUser,
            },
        ];
        return menu.filter(Boolean);
    };
    const menuItems = useMemo(() => getMenuItems(), [navigate, location.pathname, isAdmin, isDoctor, handleLogoutUser]);
    const popupContent = useMemo(() => (
        <>
            {menuItems.map(({ key, label, icon, onClick, isSelected }) => (
                <PopupItem key={key} onClick={onClick} $isSelected={isSelected}>
                    {icon && React.cloneElement(icon, { style: { fontSize: 15, marginRight: 8 } })}
                    {label}
                </PopupItem>
            ))}
        </>
    ), [menuItems]);

    const contentBooked = (
        <Menu
            items={bookedMenuItems.map(({ key, label, icon, onClick }) => ({
                key,
                label: <p onClick={onClick}>{icon} {label}</p>,
            }))}
        />
    );
    const itemsMenuMobile = [
        {
            key: "home",
            label: "Trang chủ",
            icon: <HomeFilled />,
            onClick: () => handleNavigate("/"),
        },
        {
            type: "divider",
        },
        {
            key: "booked",
            label: "Đặt khám",
            icon: <CustomerServiceOutlined />,
            children: bookedMenuItems,
        },
        {
            type: "divider",
        },
        user?.access_token ? (
            {
                key: "info",
                label: user?.name || user?.email,
                icon: <UserOutlined />,
                children: menuItems,

            }
        ) : (
            {
                key: "login",
                label: "Đăng nhập",
                icon: <UserOutlined />,
                onClick: () => handleNavigate("/authentication"),
            }
        )
    ].filter(Boolean);

    return (
        <HeaderContainer>
            <Row justify="space-between">
                <Col xs={12}>
                    <LogoSection onClick={() => navigate("/")}>
                        <Image
                            width={55}
                            src={`${import.meta.env.VITE_APP_FRONTEND_URL}` + "/mylogo.webp"}
                            preview={false}
                            style={{ cursor: "pointer", borderRadius: "50%" }}
                        />
                        <BrandTitle>Medicare</BrandTitle>
                    </LogoSection>
                </Col>
                {/* Desktop Menu */}
                <Col xs={0} md={12}>
                    <NavButtons>
                        <Popover
                            content={contentBooked}
                            placement="bottomLeft"
                            open={isOpenPopupBooked}
                            onOpenChange={(visible) => setIsOpenPopupBooked(visible)}
                            trigger="click"
                            getPopupContainer={(trigger) => trigger.parentNode}
                        >
                            <ButtonComponent
                                type="dashed"
                                icon={<CustomerServiceOutlined />}
                            >
                                Đặt khám
                            </ButtonComponent>
                        </Popover>

                        {user?.access_token ? (
                            <Popover
                                content={popupContent}
                                open={isOpenPopupUser}
                                onOpenChange={(visible) =>
                                    setIsOpenPopupUser(visible)
                                }
                                placement="bottomRight"
                                getPopupContainer={(trigger) => trigger.parentNode}
                            >
                                <ButtonComponent
                                    size="middle"
                                    type="dashed"
                                    icon={<UserOutlined />}
                                >
                                    {user?.name || user?.email}{" "}
                                    <CaretDownOutlined />
                                </ButtonComponent>
                            </Popover>
                        ) : (
                            <ButtonComponent
                                size="middle"
                                type="dashed"
                                onClick={() => navigate("/authentication")}
                            >
                                Đăng nhập
                            </ButtonComponent>
                        )}
                    </NavButtons>
                </Col>
                {/* Mobile Menu */}
                <Col xs={12} md={0}>
                    <MobileMenuButton>
                        <ButtonComponent
                            size="middle"
                            icon={<MenuOutlined />}
                            onClick={() => setIsDrawerOpen(true)}
                            styleButton={{
                                backgroundColor: "#fff",
                                color: "#1890ff",
                                border: "1px solid #1890ff",
                            }}
                            type="text"
                        ></ButtonComponent>
                    </MobileMenuButton>
                </Col>
            </Row>
            {/* Mobile Drawer Menu */}
            <Drawer
                title="Menu"
                placement="right"
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                forceRender
                style={{
                    backgroundColor: "#f0f2f5",
                }}
            >
                <Menu
                    mode="inline"
                    items={itemsMenuMobile}
                    theme="light"
                    defaultSelectedKeys={["home"]}
                />
            </Drawer>
        </HeaderContainer>
    );
};

export default HeaderComponent;
