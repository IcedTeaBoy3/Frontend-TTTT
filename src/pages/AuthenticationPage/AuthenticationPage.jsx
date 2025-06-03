
import FormLogin from "../../components/FormLogin/FormLogin";
import DefaultLayout from "../../components/DefaultLayout/DefaultLayout";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as Message from "../../components/Message/Message";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as AuthService from "../../services/AuthService";
import * as UserService from "../../services/UserService";
import { setUser, updateUser } from "../../redux/Slice/authSlice";
import backgroundImage from "../../assets/anh_dang_nhap.png";
import { jwtDecode } from "jwt-decode";
const AuthenticationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const from = location.state?.from?.pathname || "/"

    const [isRegister, setIsRegister] = useState(false);
    useEffect(() => {
        if (location.state?.message) {
            switch (location.state?.status) {
                case "success":
                    Message.success(location.state?.message);
                    break;
                case "info":
                    Message.info(location.state?.message);
                    break;
                case "warning":
                    Message.warning(location.state?.message);
                    break;
                case "error":
                    Message.error(location.state?.message);
                    break;
            }
        }
    }, [location.state]);
    const mutationAuth = useMutation({
        mutationFn: (data) => {
            if (isRegister) {
                return AuthService.registerUser(data);
            } else {
                return AuthService.loginUser(data);
            }
        },
        onSuccess: async (data) => {
            if (data?.status === "success") {
                Message.success(data?.message);
                if (!isRegister) {
                    if (data?.access_token) {

                        const decode = jwtDecode(data?.access_token);
                        const { id } = decode;
                        dispatch(setUser({ id, access_token: data.access_token }));
                        const user = await getDetailUser(id, data?.access_token);
                        dispatch(updateUser(user));
                        if (user.role === "admin") {
                            navigate("/admin/dashboard");
                        }
                        else {
                            navigate(from, { replace: true });
                        }
                    }
                } else {
                    setIsRegister((prev) => !prev);
                }
            } else if (data?.status === "error") {
                Message.error(data?.message);
            }
        },
        onError: (error) => {
            Message.error(error.message);
        },
    })
    const mutationGoogleLogin = useMutation({
        mutationFn: (data) => {
            return AuthService.googleLogin(data);
        },
        onSuccess: async (data) => {
            if (data?.status === "success") {
                Message.success(data?.message);
                const { access_token } = data;
                const decode = jwtDecode(access_token);
                const { id } = decode;
                dispatch(setUser({ id, access_token }));
                const user = await getDetailUser(id, access_token);
                dispatch(updateUser(user));
                if (user.role === "admin") {
                    navigate("/admin/dashboard");
                }
                else {
                    navigate(from, { replace: true });
                }
            } else if (data?.status === "error") {
                Message.error(data?.message);
            }
        },
        onError: (error) => {
            Message.error(error.message);
        },
    });
    const { data: dataUser, isPending } = mutationAuth;
    const getDetailUser = async (id, access_token) => {
        const res = await UserService.getUser(id);
        if (res?.status == "success") {
            const { email, name, role, phone, address, dateOfBirth, gender, avatar, ethnic, idCard, insuranceCode, job } = res.data;
            const user = {
                id,
                access_token,
                email,
                name,
                role,
                phone,
                address,
                dateOfBirth,
                gender,
                avatar,
                ethnic,
                idCard,
                insuranceCode,
                job,
            };
            return user;
        }
    };
    const handleGoogleLogin = async (data) => {
        mutationGoogleLogin.mutate({
            idToken: data,
        });
    }
    return (
        <DefaultLayout>
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: `url(${backgroundImage})`,
                }}
            >
                <FormLogin
                    isRegister={isRegister}
                    dataUser={dataUser}
                    isPending={isPending}
                    onSubmit={(data) => {
                        mutationAuth.mutate(data);
                    }}
                    onChangeForm={() => setIsRegister((prev) => !prev)}
                    handleGoogleLogin={handleGoogleLogin}
                />
            </div>
        </DefaultLayout>
    );
};

export default AuthenticationPage;
