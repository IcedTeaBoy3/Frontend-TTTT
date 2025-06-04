import { Form, Input, Button, Card, Typography, Layout } from 'antd';
import * as Message from '../../components/Message/Message';
import * as AuthService from '../../services/AuthService';
import { useMutation } from '@tanstack/react-query';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Title } = Typography;
const { Content } = Layout;

const ForgotPassword = () => {
    const [form] = Form.useForm();
    const mutationForgotPassword = useMutation({
        mutationFn: async (email) => {
            return await AuthService.forgotPassword(email);
        },
        onSuccess: (data) => {
            if (data?.status === 'success') {
                Message.success(data?.message || 'Yêu cầu đặt lại mật khẩu đã được gửi thành công. Vui lòng kiểm tra email của bạn.');
                form.resetFields();
            } else if (data?.status === 'error') {
                Message.error(data?.message || 'Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu.');
            }
        },
        onError: (error) => {
            Message.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    })
    const onFinish = async (values) => {
        const { email } = values;
        mutationForgotPassword.mutate({ email });
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card
                    style={{ width: 400 }}
                    bordered={false}
                    hoverable
                >
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={3}>Quên mật khẩu</Title>
                        <p>Vui lòng nhập email để nhận liên kết đặt lại mật khẩu</p>
                    </div>

                    <Form
                        form={form}
                        name="forgot_password"
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email của bạn" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={mutationForgotPassword.isPending}
                            >
                                Gửi yêu cầu
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            <Link to="/authentication">Quay lại đăng nhập</Link>
                        </div>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};

export default ForgotPassword;