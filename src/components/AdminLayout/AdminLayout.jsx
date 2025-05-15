
import { Layout, Menu,Breadcrumb,theme,Avatar,Badge,Popover  } from 'antd';
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

} from '@ant-design/icons';
import { Outlet, useNavigate,useLocation } from 'react-router-dom';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

import { useState,useMemo } from 'react';
import { PopupItem } from './style';
import { useSelector } from 'react-redux';
const { Header, Sider, Content,Footer  } = Layout;

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpenPopupUser,setIsOpenPopupUser] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const breadcrumbNameMap = {
        '/admin': 'Quản trị',
        '/admin/dashboard': 'Thống kê',
        '/admin/appointments': 'Lịch hẹn',
        '/admin/doctors': 'Bác sĩ',
        '/admin/patients': 'Người dùng',
    };

    const pathSnippets = location.pathname.split('/').filter(i => i);

    const breadcrumbItems = [
        {
            title: 'Trang chủ',
            key: 'home',
        },
        ...pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
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
        { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Thống kê' },
        { key: '/admin/patients', icon: <TeamOutlined />, label: 'Người dùng' },
        { key: '/admin/doctors', icon: <TeamOutlined />, label: 'Bác sĩ' },
        { key: '/admin/appointments', icon: <CalendarOutlined />, label: 'Lịch hẹn' },

        { key: '/logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
    ];


    const handleMenuClick = ({ key }) => {
        if (key === '/logout') {
            // Xử lý logout nếu cần
            return;
        }
        navigate(key);
    };
    const handleLogoutUser = () => {
        localStorage.removeItem('user');
        navigate('/login');
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
        <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible>
            <div className="logo" style={{ color: '#fff', padding: 16, fontSize: 20, textAlign: 'center', fontWeight: 'bold',color:'#1890ff' }}>
                Medicare
            </div>
            <Menu
                theme="dark"
                mode="inline"
                onClick={handleMenuClick}
                defaultSelectedKeys={['/admin/dashboard']}
                items={menuItems}
            />
        </Sider>
        <Layout>
            <Header style={{ background: '#fff', padding: 0, textAlign: 'right', paddingRight: 24 }}>
                <ButtonComponent
                    icon={<Badge count={1}><BellOutlined style={{fontSize:'25px'}}/></Badge>}
                    styleButton={{ backgroundColor: '#fff', color: '#1890ff', marginRight: '16px' }}
                    size="middle"
                >

                </ButtonComponent>
                {user?.access_token && (
                    <Popover
                        content={content}
                        open={isOpenPopupUser}
                        onOpenChange={(visible) => setIsOpenPopupUser(visible)}
                        
                        placement="bottomRight"
                    >
                        <ButtonComponent
                            size="middle"
                            styleButton={{ backgroundColor: '#fff', color: '#1890ff' }}
                            icon={<Avatar size={35} icon={<UserOutlined />} style={{backgroundColor:'#87d068'}}/>}
                            onClick={() => navigate('/profile')}
                        >
                            
                            {user?.name || user?.email || 'Xin chào, Admin!'} <CaretDownOutlined />
                        </ButtonComponent>
                
                    </Popover>
                )}
                
            </Header>
            <Content style={{ margin: 16 }}>
                <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems}>
                   
                </Breadcrumb>
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
            <Footer style={{ textAlign: 'center' }}>
            © {new Date().getFullYear()} Hệ thống đặt lịch khám bệnh | Admin Dashboard
            </Footer>
        </Layout>
        </Layout>
    );
};

export default AdminLayout;
