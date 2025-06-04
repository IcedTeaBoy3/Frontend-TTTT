
import { Form, Input, Button, Card, Typography, Layout } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import * as AuthService from '../../services/AuthService';
import * as Message from '../../components/Message/Message';
import { useMutation } from '@tanstack/react-query';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/Slice/authSlice';

const { Title } = Typography;
const { Content } = Layout;

const ResetPassword = () => {
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token'); // Lấy token từ query string
    const dispatch = useDispatch();
    const mutationResetPassword = useMutation({
        mutationFn: async (values) => {
            return await AuthService.resetPassword(token, values);
        },
        onSuccess: (data) => {
            if (data?.status === 'success') {
                dispatch(logout()); // Đăng xuất người dùng sau khi đặt lại mật khẩu
                navigate('/authentication', {
                    state: {
                        status: 'success',
                        message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.'
                    }
                })
                form.resetFields();
            } else if (data?.status === 'error') {
                Message.error(data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu.');
            }
        },
        onError: (error) => {
            Message.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    })
    const onFinish = async (values) => {
        if (values.password !== values.confirmPassword) {
            Message.error('Mật khẩu không khớp!');
            return;
        }
        const { password } = values;
        mutationResetPassword.mutate({ password });

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
                        <Title level={3}>Đặt lại mật khẩu</Title>
                        <p>Vui lòng nhập mật khẩu mới của bạn</p>
                    </div>

                    <Form
                        form={form}
                        name="reset_password"
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="password"
                            label="Mật khẩu mới"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                                {
                                    max: 20,
                                    message: "Mật khẩu không được quá 20 ký tự!",
                                },
                                {
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                                    message:
                                        "Mật khẩu phải có ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt!",
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Mật khẩu mới"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Xác nhận mật khẩu"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={mutationResetPassword.isPending}
                            >
                                Đặt lại mật khẩu
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

export default ResetPassword;