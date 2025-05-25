import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as AuthService from '../../services/AuthService'; // Adjust the import path as necessary
import * as Message from '../../components/Message/Message'; // Adjust the import path as necessary
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const token = searchParams.get('token');
    const navigate = useNavigate()

    const handleVerifyEmail = async (token) => {
        try {
            const response = await AuthService.verifyEmail(token);
            if (response.status === 'success') {
                Message.success(response.message);
                navigate("/authentication", {
                    state: {
                        email: response?.data?.email
                    }
                })
            } else {
                Message.error(response.message);
            }
        } catch (error) {
            Message.error('Xác thực email thất bại. Vui lòng thử lại sau.' + error.message);
        }
    }

    useEffect(() => {
        if (token) {
            handleVerifyEmail(token);
            setLoading(false);
        }
    }, [token]);

    return (
        <Flex
            align="center"
            justify="center"
            style={{ height: '100vh' }}
            direction="column"
            gap="20px"
        >

            <LoadingComponent loading={loading}>
                <p>Đang xác thực email...</p>
            </LoadingComponent>
        </Flex>
    );
};

export default VerifyEmail;
