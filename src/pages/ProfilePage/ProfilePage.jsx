import DefaultLayout from "../../components/DefaultLayout/DefaultLayout";
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Menu, Avatar, Typography, Divider } from "antd";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

const items = [
    {
        key: "sub1",
        label: "Thông tin cá nhân",
        icon: <MailOutlined />,
        children: [
            { key: "1", label: "Hồ sơ" },
            { key: "2", label: "Đổi mật khẩu" },
        ],
    },
    {
        key: "sub2",
        label: "Lịch hẹn đã đặt",
        icon: <AppstoreOutlined />,
    },
    {
        type: "divider",
    },
    {
        key: "sub4",
        label: "Cài đặt khác",
        icon: <SettingOutlined />,
        children: [
            { key: "9", label: "Tùy chọn 1" },
            { key: "10", label: "Tùy chọn 2" },
        ],
    },
];

const ProfilePage = () => {
    const user = useSelector((state) => state.auth.user);

    const onClick = ({ key }) => {
        console.log("click ", key);
    };

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
                            backgroundColor: "#fafafa",
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
                            onClick={onClick}
                            defaultSelectedKeys={["1"]}
                            defaultOpenKeys={["sub1"]}
                            mode="inline"
                            items={items}
                        />
                    </div>

                    {/* Right: Content */}
                    <div style={{ flex: 1, padding: "30px" }}>
                        <Title level={3}>Thông tin của bạn</Title>
                        <Text type="secondary">
                            Đây là nơi bạn có thể xem và chỉnh sửa thông tin cá nhân của mình.
                        </Text>
                        {/* Nội dung chi tiết từng mục sẽ hiển thị tại đây */}
                        <Divider></Divider>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ProfilePage;
