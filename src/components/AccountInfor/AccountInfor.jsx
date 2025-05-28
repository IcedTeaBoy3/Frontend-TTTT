
import { formatDateToDDMMYYYY } from "../../utils/dateUtils";
import { convertGender } from "../../utils/convertGender";
import { StyleText } from "./style";
import { UserOutlined, MailOutlined, PhoneOutlined, ManOutlined, EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { Typography, Divider, Flex, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import * as AuthService from "../../services/AuthService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/Slice/authSlice";
import * as Message from "../Message/Message";
const { Title } = Typography;
const AccountInfor = ({ user, handleChangeProfile }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const mutationChangePassword = useMutation({
        mutationFn: (data) => AuthService.changePassword(data),
        onSuccess: (res) => {
            if (res.status === "success") {
                Message.success("Đổi mật khẩu thành công!");
                dispatch(logout());
                navigate("/authentication", {
                    state: {
                        status: "warning",
                        message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại."
                    }
                });
                form.resetFields();
            } else if (res.status === "error") {
                Message.error(res.message || "Đổi mật khẩu thất bại!");
            }
        },
        onError: (error) => {
            Message.error(error?.message || "Đổi mật khẩu thất bại!");
        }
    })
    const onFinish = (values) => {
        mutationChangePassword.mutate({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword
        })
    }

    return (
        <>
            <Title level={3}>Tài khoản</Title>
            <Divider />
            <Flex justify="space-between" align="flex-start" style={{ gap: 48 }}>
                <Flex vertical style={{ flex: 1, borderRight: '1px solid #edebeb' }} gap={8}>

                    <Title level={4}>Thông tin tài khoản</Title>
                    <StyleText><strong><UserOutlined /> Họ và tên:</strong> {user?.name || "--"}</StyleText>
                    <StyleText><strong><MailOutlined /> Email:</strong> {user?.email || "--"}</StyleText>
                    <StyleText><strong><PhoneOutlined /> Số điện thoại:</strong> {user?.phone || "--"}</StyleText>
                    <StyleText><strong><CalendarOutlined /> Ngày sinh:</strong> {formatDateToDDMMYYYY(user?.dateOfBirth) || "--"}</StyleText>
                    <StyleText><strong>	<ManOutlined /> Giới tính:</strong> {convertGender(user?.gender) || "--"}</StyleText>
                    <StyleText><strong><EnvironmentOutlined /> Địa chỉ:</strong> {user?.address || "--"}</StyleText>
                    <ButtonComponent
                        type="default"
                        size="large"
                        style={{ marginTop: 16, width: "50%" }}
                        onClick={handleChangeProfile}
                    >
                        Thay đổi thông tin
                    </ButtonComponent>
                </Flex>
                <Flex vertical style={{ flex: 1 }} gap={8}>
                    <Title level={4}>Thay đổi mật khẩu</Title>
                    <Form
                        form={form}
                        layout="vertical"
                        style={{ width: "100%" }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="currentPassword"
                            label="Mật khẩu hiện tại"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu mới" />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input placeholder="Xác nhận mật khẩu mới" />
                        </Form.Item>
                        <LoadingComponent isLoading={mutationChangePassword.isPending}>

                            <ButtonComponent
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{ width: "100%" }}
                            >
                                Thay đổi
                            </ButtonComponent>
                        </LoadingComponent>
                    </Form>
                </Flex>
            </Flex>
        </>
    )
}

export default AccountInfor