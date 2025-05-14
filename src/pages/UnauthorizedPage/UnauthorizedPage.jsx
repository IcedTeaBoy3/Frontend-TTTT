import React from 'react'
import { Result } from "antd";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { Container } from './style';
import { useNavigate } from "react-router-dom";
const UnauthorizedPage = () => {
 
    const navigate = useNavigate();

    return (
        <Container>
            <Result
                status="403"
                title="403 - Truy cập bị từ chối"
                subTitle="Bạn không có quyền truy cập vào trang này. Vui lòng quay lại trang chủ."
                extra={
                <ButtonComponent type="primary" onClick={() => navigate("/")}>
                    Quay về Trang chủ
                </ButtonComponent>
                }
            />
        </Container>
    );
}

export default UnauthorizedPage