
import BannerComponent from "../../components/BannerComponent/BannerComponent";
import DefaultLayout from "../../components/DefaultLayout/DefaultLayout";
import SlideComponent from "../../components/SlideComponent/SlideComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Typography, Card, Row, Col, Flex } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useQuery } from "@tanstack/react-query";
import * as SpecialtyService from "../../services/SpecialtyService";
import * as HospitalService from "../../services/HospitalService";
import * as DoctorService from "../../services/DoctorService";
import * as Message from "../../components/Message/Message";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CardComponent from "../../components/CardComponent/CardComponent";
import { SpecialtyCard, SpecialtyImage, HospitalCard, HospitalImage, TwoLineDescription } from "./style";
import { Wrapper, CenteredTitleWrapper, Section } from "./style";
const { Text, Title, Paragraph } = Typography;
const HomePage = () => {
    const [limit, setLimit] = useState(12)
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (location.state?.message) {
            Message.success(location.state.message);
        }
    }, [location.state])

    const queryGetAllSpecialties = useQuery({
        queryKey: ["getAllSpecialties", limit],
        queryFn: () => SpecialtyService.getAllSpecialties('active', 1, limit),
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    })
    const handleLoadMore = () => {
        setLimit(specialties?.total);
    };
    const queryGetAllHospitals = useQuery({
        queryKey: ["getAllHospitals"],
        queryFn: () => HospitalService.getAllHospitals('hospital', 'active', 1, 10),
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    })
    const queryGetAllDoctors = useQuery({
        queryKey: ["getAllDoctors"],
        queryFn: () => DoctorService.getAllDoctors(true, 1, 10),
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    })
    const { data: specialties, isLoading: isLoadingSpecialty } = queryGetAllSpecialties;
    const { data: hospitals, isLoading: isLoadingHospital } = queryGetAllHospitals;
    const { data: doctors, isLoading: isLoadingDoctor } = queryGetAllDoctors;
    const handleNavigate = (path) => {
        navigate(path);
    };
    const handleSearchSpecialty = (specialtyId) => {
        navigate(`/search?specialty=${specialtyId}`);
    }

    return (
        <>
            <BannerComponent />
            <Wrapper>
                <CenteredTitleWrapper>
                    <Title level={2} style={{ fontWeight: 'bold' }}>
                        Đặt lịch khám trực tuyến
                    </Title>
                    <Text type="secondary">
                        Tìm bác sĩ chính xác, đặt lịch khám dễ dàng và nhanh chóng
                    </Text>
                </CenteredTitleWrapper>

                {/* Đặt khám bác sĩ */}
                <Section id="doctors-section">
                    <Flex justify="space-between" align="center">
                        <Title level={3} style={{ fontWeight: 'bold' }}>Đặt khám bác sĩ</Title>
                        <ButtonComponent
                            type="primary"
                            hoverable="true"
                            onClick={() => handleNavigate('/search?type=doctor')}
                        >
                            Xem tất cả <RightOutlined />
                        </ButtonComponent>
                    </Flex>
                    <Paragraph type="secondary">
                        Phiếu khám kèm số thứ tự và thời gian của bạn được xác nhận.
                    </Paragraph>
                    <LoadingComponent isLoading={isLoadingDoctor}>
                        <SlideComponent length={doctors?.data.length}>
                            {doctors?.data.map((item) => (
                                <CardComponent
                                    key={item._id}
                                    avatar={item.user?.avatar}
                                    name={item.user?.name}
                                    specialty={item.specialties[0]?.name}
                                    hospital={item.hospital?.name}
                                    onClick={() => handleNavigate(`/detail-doctor/${item._id}`)}
                                />
                            ))}
                        </SlideComponent>
                    </LoadingComponent>
                </Section>

                {/* Bác sĩ theo phòng khám */}
                <Section>
                    <Flex justify="space-between" align="center">
                        <Title level={3} style={{ fontWeight: 'bold' }}>Đặt khám phòng khám</Title>
                        <ButtonComponent
                            type="primary"
                            hoverable="true"
                            onClick={() => handleNavigate('/search?type=hospital')}
                        >
                            Xem tất cả <RightOutlined />
                        </ButtonComponent>
                    </Flex>
                    <Paragraph type="secondary">Nhiều phòng khám khác nhau với nhiều bác sĩ kinh nghiệm</Paragraph>
                    <LoadingComponent isLoading={isLoadingHospital}>
                        <SlideComponent length={hospitals?.data.length}>
                            {hospitals?.data.map((item) => (
                                <HospitalCard
                                    hoverable="true"
                                    variant="outlined"
                                    key={item._id}
                                    cover={
                                        <HospitalImage
                                            src={`${import.meta.env.VITE_APP_BACKEND_URL}${item.thumbnail}`}
                                            alt={item.name}
                                        />
                                    }
                                    onClick={() => handleNavigate(`/detail-hospital/${item._id}`)}
                                >
                                    <Card.Meta
                                        title={item.name}
                                        description={<TwoLineDescription>{item.address}</TwoLineDescription>}
                                    />
                                </HospitalCard>
                            ))}
                        </SlideComponent>
                    </LoadingComponent>
                </Section>

                {/* Đặt khám theo chuyên khoa */}
                <Section>
                    <Title level={3} style={{ fontWeight: 'bold' }}>Đặt khám theo chuyên khoa</Title>
                    <Text type="secondary">Đa dạng chuyên khoa khác nhau</Text>
                    <LoadingComponent isLoading={isLoadingSpecialty}>
                        <Row gutter={[16, 24]} justify="center" style={{ marginTop: '20px' }}>
                            {specialties?.data.map((item) => (
                                <Col key={item._id} xs={12} sm={8} md={8} lg={4} xl={4}>
                                    <SpecialtyCard
                                        hoverable="true"
                                        onClick={() => handleSearchSpecialty(item._id)}
                                    >
                                        <SpecialtyImage
                                            src={`${import.meta.env.VITE_APP_BACKEND_URL}${item.image}`}
                                            alt={item.name}
                                        />
                                        <Card.Meta title={item.name} />
                                    </SpecialtyCard>
                                </Col>
                            ))}
                        </Row>
                    </LoadingComponent>

                    <Flex justify="center" align="center" style={{ marginTop: '20px' }}>
                        {specialties?.total > limit ? (
                            <ButtonComponent type="primary" hoverable="true" onClick={handleLoadMore}>
                                Xem thêm
                            </ButtonComponent>
                        ) : (
                            <ButtonComponent type="primary" hoverable="true" onClick={() => setLimit(12)}>
                                Thu hẹp danh sách
                            </ButtonComponent>
                        )}
                    </Flex>
                </Section>
            </Wrapper>
        </>
    );
};

export default HomePage;
