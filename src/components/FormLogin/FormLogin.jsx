
import { Form, Input, Checkbox } from "antd";
import TabsComponent from "../TabsComponent/TabsComponent";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { FormContainer } from "./style";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
const FormLogin = ({ isRegister, setIsRegister, onSubmit, isPending }) => {
    const location = useLocation();
    const [formLogin] = Form.useForm();
    useEffect(() => {
        if (location.state?.email) {
            formLogin.setFieldsValue({
                email: location.state.email
            });
        }
    }, [location.state?.email])
    const onChange = (key) => {
        setIsRegister((prev) => !prev);
    };
    const items = [
        {
            key: "1",
            label: "Đăng nhập",
        },
        {
            key: "2",
            label: "Đăng ký",
        },
    ];

    // Theo dõi giá trị email và password
    const email = Form.useWatch("email", formLogin);
    const password = Form.useWatch("password", formLogin);
    const handleSubmitForm = (values) => {
        if (values.remember) {
            localStorage.setItem("email", values.email);
        } else {
            localStorage.removeItem("email");
        }
        const data = {
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
        }
        onSubmit(data);
    };
    return (
        <FormContainer>
            <TabsComponent
                items={items}
                onChange={onChange}
                defaultActiveKey="2"
                activeKey={isRegister ? "2" : "1"}
                style={{ width: "100%" }}
            />

            <Form
                name="formLogin"
                form={formLogin}
                layout="vertical"
                initialValues={{
                    email: localStorage.getItem("email") || "",

                    remember: true,
                }}
                onFinish={handleSubmitForm}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"

                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập email!",
                        },
                        {
                            type: "email",
                            message: "Email không hợp lệ!",
                        },
                    ]}
                >
                    <Input placeholder="Email" autoComplete="username" prefix={<MailOutlined />} />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"

                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập mật khẩu!",
                        },
                        {
                            min: 6,
                            message: "Mật khẩu phải có ít nhất 6 ký tự!",
                        },
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
                >
                    <Input.Password
                        placeholder="Password"
                        prefix={<LockOutlined />}
                        autoComplete="current-password"
                    />
                </Form.Item>
                {isRegister && (
                    <Form.Item
                        label="Nhập lại mật khẩu"
                        name="confirmPassword"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập lại mật khẩu!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("password") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("Mật khẩu không khớp!"),
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập lại mật khẩu"
                            autoComplete="new-password"
                        />
                    </Form.Item>
                )}
                {!isRegister && (
                    <Form.Item>
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            noStyle
                        >
                            <Checkbox>Ghi nhớ tôi</Checkbox>
                        </Form.Item>

                        <span style={{ float: "right", color: "#1890ff" }}>
                            Quên mật khẩu?
                        </span>
                    </Form.Item>
                )}
                <LoadingComponent isLoading={isPending} >

                    <Form.Item>
                        <ButtonComponent
                            type="primary"
                            htmlType="submit"
                            size="large"
                            disabled={!email || !password}
                            styleButton={{
                                width: "100%",
                                backgroundColor: "#1890ff",
                                fontWeight: 500,
                            }}
                        >
                            {isRegister ? "Đăng ký" : "Đăng nhập"}
                        </ButtonComponent>
                    </Form.Item>
                </LoadingComponent>
            </Form>
        </FormContainer>
    );
};

export default FormLogin;
