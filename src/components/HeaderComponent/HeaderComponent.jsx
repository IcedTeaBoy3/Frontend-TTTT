
import React from 'react'
import { useState,useMemo } from 'react'
import { Row, Col,Image, Popover  } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HeaderContainer,LogoSection,BrandTitle,NavButtons,PopupItem } from './style';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { CustomerServiceOutlined, UserOutlined,InfoCircleFilled,SettingFilled,LogoutOutlined } from '@ant-design/icons';
import { useSelector,useDispatch } from 'react-redux';
import { logout,setUser } from '../../redux/Slice/authSlice';
import * as Message from '../Message/Message';
import * as AuthService from '../../services/AuthService';
const HeaderComponent = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [isOpenPopupUser,setIsOpenPopupUser] = useState(false);
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
    // Nội dung dropdown menu
    const content = useMemo(
        () => (
        <>
            <PopupItem  
                onClick={() => navigate('/profile')}
                className="hover:bg-gray-200 rounded-md"
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
                <Col span={12}>
                    <LogoSection onClick={() => navigate('/')}>
                        <Image
                            width={70}
                            src="mylogo.webp"
                            preview={false}
                            style={{ cursor: 'pointer', borderRadius: '50%' }}
                            
                        />
                        <BrandTitle>Medicare</BrandTitle>
                    </LogoSection>
                </Col>
                <Col span={12}>
                    <NavButtons>
                        <ButtonComponent 
                            size="large" 
                            icon={<CustomerServiceOutlined />}
                            styleButton={{ backgroundColor: '#fff',color: '#1890ff', border: '1px solid #1890ff' }}
                        >
                            Đặt khám
                        </ButtonComponent>
                        <ButtonComponent size="large" onClick={() => navigate('/register')}>
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
                                    size="large" 
                                    icon={<UserOutlined />}
                                    styleButton={{ backgroundColor: '#fff',color: '#1890ff', border: '1px solid #1890ff' }}
                                >
                                    {user?.name || user?.email}
                                </ButtonComponent>
                            </Popover>
                        ) : (
                            <ButtonComponent size="large" onClick={() => navigate('/authentication')}>
                                Đăng nhập
                            </ButtonComponent>
                        )}
                       
                    </NavButtons>
                </Col>
            </Row>
        </HeaderContainer>

    )
}

export default HeaderComponent