
import React from 'react'
import { useState,useMemo } from 'react'
import { Row, Col,Image, Popover ,Drawer, Menu, Dropdown  } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HeaderContainer,LogoSection,BrandTitle,NavButtons,PopupItem,MobileMenuButton } from './style';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { CustomerServiceOutlined, UserOutlined,InfoCircleFilled,SettingFilled,LogoutOutlined,CaretDownOutlined,MenuOutlined } from '@ant-design/icons';
import { useSelector,useDispatch } from 'react-redux';
import { logout } from '../../redux/Slice/authSlice';
import * as Message from '../Message/Message';
import * as AuthService from '../../services/AuthService';
const HeaderComponent = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.role === 'admin';
    const [isOpenPopupUser,setIsOpenPopupUser] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleLogoutUser = async () => {
        const res = await AuthService.logoutUser();
        if(res?.status == 'success'){
            Message.success(res?.message);
            setIsOpenPopupUser(false);
            dispatch(logout());
            navigate('/');
        }else if(res?.status == 'error'){
            Message.error(res?.message);
        }
    }
    const menu = (
        <Menu
            items={[
            { 
                label: <PopupItem  onClick={() => navigate('/profile')} $isSelected={location.pathname === '/profile' }><InfoCircleFilled style={{fontSize:'15px',marginRight:'8px'}}/>
                        Thông tin người dùng
                    </PopupItem>, 
                key: '1' },
            isAdmin && { label: <PopupItem $isSelected={location.pathname === '/admin' } onClick={() => navigate('/admin')}><SettingFilled style={{fontSize:'15px',marginRight:'8px'}}/>Quản lý hệ thống</PopupItem>, key: '2' },
            { label: <PopupItem onClick={() => navigate('/order')}><InfoCircleFilled style={{fontSize:'15px',marginRight:'8px'}}/>Đơn hàng của tôi</PopupItem>, key: '3' },
            { label: <PopupItem onClick={handleLogoutUser}><LogoutOutlined style={{fontSize:'15px',marginRight:'8px'}}/>Đăng xuất</PopupItem>, key: '4' },
            ]}
        />
    );

    
    // Nội dung dropdown menu
    const content = useMemo(
        () => (
        <>
            <PopupItem  
                onClick={() => navigate('/profile')}
                $isSelected={location.pathname === '/profile' }
            >
                <InfoCircleFilled style={{fontSize:'15px',marginRight:'8px'}}/>

                Thông tin người dùng
            </PopupItem>
            {user?.role === "admin" && <PopupItem $isSelected={location.pathname === '/admin' } onClick={() => navigate('/admin')}><SettingFilled style={{fontSize:'15px',marginRight:'8px'}}/>Quản lý hệ thống</PopupItem>}
            <PopupItem onClick={() => navigate('/order')}><InfoCircleFilled style={{fontSize:'15px',marginRight:'8px'}}/>Đơn hàng của tôi</PopupItem>
            <PopupItem onClick={handleLogoutUser}><LogoutOutlined style={{fontSize:'15px',marginRight:'8px'}}/>Đăng xuất</PopupItem>

        </>
    ),[user?.role]);
    return (
        <HeaderContainer>
            <Row justify="space-between">
                <Col xs={12}>
                    <LogoSection onClick={() => navigate('/')}>
                        <Image
                            width={55}
                            src="mylogo.webp"
                            preview={false}
                            style={{ cursor: 'pointer', borderRadius: '50%' }}
                            
                        />
                        <BrandTitle>Medicare</BrandTitle>
                    </LogoSection>
                </Col>
                {/* Desktop Menu */}
                <Col xs={0} md={12} >
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
                            onClick={() => navigate('/register')}
                            
                        >
                            Tin y tế
                        </ButtonComponent>
                        {user?.access_token ? (
                            <Popover
                                content={content}
                                
                                open={isOpenPopupUser}
                                onOpenChange={(visible) => setIsOpenPopupUser(visible)}
                                
                                placement="bottomRight"
                            >
                                <ButtonComponent 
                                    size="middle" 
                                    type="default"
                                    icon={<UserOutlined />}
                                >
                                    {user?.name || user?.email} <CaretDownOutlined />
                                </ButtonComponent>
                            </Popover>
                        ) : (
                            <ButtonComponent size="middle" onClick={() => navigate('/authentication')}>
                                Đăng nhập
                            </ButtonComponent>
                        )}
                       
                    </NavButtons>
                </Col>
                {/* Mobile Menu */}
                <Col xs={12} md={0} >
                    <MobileMenuButton>

                        <ButtonComponent
                            size="middle" 
                            icon={<MenuOutlined />}
                            onClick={() => setIsDrawerOpen(true)}
                            styleButton={{ backgroundColor: '#fff',color: '#1890ff', border: '1px solid #1890ff' }}
                            type="text"
                        >
                            
                        </ButtonComponent>
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
                    style={{ width: '100%', marginBottom: 10 }}
                >
                Đặt khám
                </ButtonComponent>
                <ButtonComponent
                    type="default"
                    onClick={() => {
                        navigate('/register');
                        setIsDrawerOpen(false);
                    }}
                    style={{ width: '100%', marginBottom: 10 }}
                >
                Tin y tế
                </ButtonComponent>
                {user?.access_token ? (
                    <Dropdown overlay={menu} trigger={['click']}>
                        
                        <ButtonComponent
                            type="default"
                            icon={<UserOutlined />}
                            style={{ width: '100%', marginBottom: 10 }}
                            
                        >
                            {user?.name || user?.email}  ▼
                        </ButtonComponent>
                    </Dropdown>
                ) : (
                <ButtonComponent
                    size="middle"
                    onClick={() => {
                        navigate('/authentication');
                        setIsDrawerOpen(false);
                    }}
                    style={{ width: '100%', marginBottom: 10 }}
                >
                    Đăng nhập
                </ButtonComponent>
                )}
            </Drawer>
        </HeaderContainer>

    )
}

export default HeaderComponent