
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
import { jwtDecode } from "jwt-decode";
const AuthenticationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isRegister, setIsRegister] = useState(false);
    useEffect(() => {
        if (location.state?.message) {
            Message.warning(location.state.message);
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
        onSuccess: (data) => {
            if (data?.status === "success") {
                Message.success(data?.message);
                if (!isRegister) {
                    if (data?.access_token) {
                        const decode = jwtDecode(data?.access_token);
                        const { id } = decode;
                        dispatch(setUser({ id, access_token: data.access_token }));
                        getDetailUser(id, data?.access_token);
                    }
                    navigate("/");
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
            dispatch(updateUser(user));
        }
    };
    return (
        <DefaultLayout>
            <div
                style={{
                    backgroundColor: "#e5e7eb",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",

                }}
            >
                <img src="mylogo.webp" alt="" width={400} />
                <FormLogin
                    isRegister={isRegister}
                    setIsRegister={setIsRegister}
                    dataUser={dataUser}
                    isPending={isPending}
                    onSubmit={(data) => {
                        mutationAuth.mutate(data);
                    }}
                />
            </div>
        </DefaultLayout>
    );
};

export default AuthenticationPage;
