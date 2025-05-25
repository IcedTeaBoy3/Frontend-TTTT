import React from "react";
import { useState, useMemo } from "react";
import { Row, Col, Image, Popover, Drawer, Menu, Dropdown } from "antd";
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
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/Slice/authSlice";
import { resetAppointment } from "../../redux/Slice/appointmentSlice";
import * as Message from "../Message/Message";
import * as AuthService from "../../services/AuthService";

const HeaderComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.role === "admin";
    const [isOpenPopupUser, setIsOpenPopupUser] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleLogoutUser = async () => {
        const res = await AuthService.logoutUser();
        if (res?.status == "success") {
            setIsOpenPopupUser(false);
            dispatch(logout());
            dispatch(resetAppointment());
            navigate("/", {
                state: {
                    message: "Đăng xuất thành công",
                },
            });
        } else if (res?.status == "error") {
            Message.error(res?.message);
        }
    };
    const menuItems = useMemo(() => {
        const items = [
            {
                key: "1",
                label: (
                    <PopupItem
                        onClick={() => navigate("/profile")}
                        $isSelected={location.pathname === "/profile"}
                    >
                        <InfoCircleFilled style={{ fontSize: 15, marginRight: 8 }} />
                        Thông tin người dùng
                    </PopupItem>
                ),
            },
            isAdmin && {
                key: "2",
                label: (
                    <PopupItem
                        onClick={() => navigate("/admin")}
                        $isSelected={location.pathname === "/admin"}
                    >
                        <SettingFilled style={{ fontSize: 15, marginRight: 8 }} />
                        Quản lý hệ thống
                    </PopupItem>
                ),
            },
            {
                key: "3",
                label: (
                    <PopupItem onClick={() => navigate("/order")}>
                        <InfoCircleFilled style={{ fontSize: 15, marginRight: 8 }} />
                        Đơn hàng của tôi
                    </PopupItem>
                ),
            },
            {
                key: "4",
                label: (
                    <PopupItem onClick={handleLogoutUser}>
                        <LogoutOutlined style={{ fontSize: 15, marginRight: 8 }} />
                        Đăng xuất
                    </PopupItem>
                ),
            },
        ].filter(Boolean); // loại bỏ false nếu isAdmin === false

        return items;
    }, [navigate, location.pathname, isAdmin, handleLogoutUser]);
    const dropdownMenu = useMemo(() => <Menu items={menuItems} />, [menuItems]);

    const popupContent = useMemo(() => (
        <>
            {menuItems.map((item) => (
                <div key={item.key}>{item.label}</div>
            ))}
        </>
    ), [menuItems])
    return (
        <HeaderContainer>
            <Row justify="space-between">
                <Col xs={12}>
                    <LogoSection onClick={() => navigate("/")}>
                        <Image
                            width={55}
                            src="http://localhost:4000/mylogo.webp"
                            preview={false}
                            style={{ cursor: "pointer", borderRadius: "50%" }}
                        />
                        <BrandTitle>Medicare</BrandTitle>
                    </LogoSection>
                </Col>
                {/* Desktop Menu */}
                <Col xs={0} md={12}>
                    <NavButtons>
                        <ButtonComponent
                            size="middle"
                            type="default"
                            icon={<CustomerServiceOutlined />}
                        >
                            Đặt khám
                        </ButtonComponent>
                        <ButtonComponent
                            type="default"
                            icon={<CustomerServiceOutlined />}
                            size="middle"
                            onClick={() => navigate("/register")}
                        >
                            Tin y tế
                        </ButtonComponent>
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
                                    type="default"
                                    icon={<UserOutlined />}
                                >
                                    {user?.name || user?.email}{" "}
                                    <CaretDownOutlined />
                                </ButtonComponent>
                            </Popover>
                        ) : (
                            <ButtonComponent
                                size="middle"
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
            >
                <ButtonComponent
                    type="default"
                    icon={<CustomerServiceOutlined />}
                    style={{ width: "100%", marginBottom: 10 }}
                >
                    Đặt khám
                </ButtonComponent>
                <ButtonComponent
                    type="default"
                    onClick={() => {
                        navigate("/register");
                        setIsDrawerOpen(false);
                    }}
                    style={{ width: "100%", marginBottom: 10 }}
                >
                    Tin y tế
                </ButtonComponent>
                {user?.access_token ? (
                    <Dropdown
                        menu={dropdownMenu}
                        trigger={["click"]}
                        getPopupContainer={(trigger) => trigger.parentNode}
                    >
                        <ButtonComponent
                            type="default"
                            icon={<UserOutlined />}
                            style={{ width: "100%", marginBottom: 10 }}
                        >
                            {user?.name || user?.email} ▼
                        </ButtonComponent>
                    </Dropdown>
                ) : (
                    <ButtonComponent
                        size="middle"
                        onClick={() => {
                            navigate("/authentication");
                            setIsDrawerOpen(false);
                        }}
                        style={{ width: "100%", marginBottom: 10 }}
                    >
                        Đăng nhập
                    </ButtonComponent>
                )}
            </Drawer>
        </HeaderContainer>
    );
};

export default HeaderComponent;
