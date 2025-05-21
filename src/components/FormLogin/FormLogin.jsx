import React, { useState, useEffect } from "react";
import { Form, Input, Checkbox, Button } from "antd";
import TabsComponent from "../TabsComponent/TabsComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { FormContainer } from "./style";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as AuthService from "../../services/AuthService";
import * as UserService from "../../services/UserService";
import * as Message from "../Message/Message";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/Slice/authSlice";
import { jwtDecode } from "jwt-decode";
const FormLogin = () => {
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const mutation = useMutationHook((data) => {
        if (isRegister) {
            return AuthService.registerUser(data);
        } else {
            return AuthService.loginUser(data);
        }
    });
    const { data, isPending, isError, error } = mutation;
    useEffect(() => {
        if (data?.status == "success") {
            Message.success(data?.message);
            if (!isRegister) {
                if (data?.access_token) {
                    const decode = jwtDecode(data?.access_token); // Truy cập qua `.default`
                    const { id } = decode;
                    // Có thể lưu sơ bộ trước nếu cần
                    dispatch(setUser({ id, access_token: data.access_token }));
                    getDetailUser(id, data?.access_token);
                }
                navigate("/");
            } else {
                setIsRegister((prev) => !prev);
            }
            formLogin.resetFields();
        } else if (data?.status == "error") {
            Message.error(data?.message);
        }
    }, [data]);

    const getDetailUser = async (id, access_token) => {
        const res = await UserService.getUser(id);
        if (res?.status == "success") {
            const { email, name, role, phone, address } = res?.data;
            const user = {
                id,
                access_token,
                email,
                name,
                role,
                phone,
                address,
            };
            dispatch(setUser(user));
        }
    };

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
    const [formLogin] = Form.useForm();
    // Theo dõi giá trị email và password
    const email = Form.useWatch("email", formLogin);
    const password = Form.useWatch("password", formLogin);
    const handleSubmitForm = (values) => {
        if (values.remember) {
            localStorage.setItem("email", values.email);
        } else {
            localStorage.removeItem("email");
        }
        mutation.mutate({
            email: values.email,
            password: values.password,
            ...(isRegister && { confirmPassword: values.confirmPassword }),
        });
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
                    <Input placeholder="Email" autoComplete="username" />
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
            </Form>
        </FormContainer>
    );
};

export default FormLogin;
