
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
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useState } from "react";
import CardComponent from "../../components/CardComponent/CardComponent";
const { Text } = Typography;
const HomePage = () => {
    const [limit, setLimit] = useState(6)
    const queryGetAllSpecialties = useQuery({
        queryKey: ["getAllSpecialties", limit],
        queryFn: () => SpecialtyService.getAllSpecialties(0, limit),
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    })
    const handleLoadMore = () => {
        setLimit((prev) => prev + 6);
    };
    const queryGetAllHospitals = useQuery({
        queryKey: ["getAllHospitals"],
        queryFn: () => HospitalService.getAllHospitals(),
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    })
    const queryGetAllDoctors = useQuery({
        queryKey: ["getAllDoctors"],

        queryFn: () => DoctorService.getAllDoctors(),
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    })
    const { data: specialties, isLoading: isLoadingSpecialty } = queryGetAllSpecialties;
    const { data: hospitals, isLoading: isLoadingHospital } = queryGetAllHospitals;
    const { data: doctors, isLoading: isLoadingDoctor } = queryGetAllDoctors;
    return (
        <>
            <DefaultLayout>

                <BannerComponent />
                <div
                    style={{

                        minHeight: "80vh",
                        paddingTop: "20px",
                    }}
                >
                    <div
                        style={{

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",

                        }}
                    >
                        <h1 style={{ color: "black", textAlign: "center", fontWeight: "bold" }}>
                            Đặt lịch khám trực tuyến
                        </h1>
                        <Text
                            type="secondary"
                        >
                            Tìm bác sĩ chính xác, đặt lịch khám dễ dàng và nhanh chóng
                        </Text>

                    </div>


                    <div
                        style={{
                            width: '100%',
                            maxWidth: '1200px',     // Giới hạn chiều rộng
                            margin: '0 auto',// Căn giữa ngang
                            padding: '30px 20px',
                            overflowX: 'auto',
                        }}
                    >
                        <Flex justify="space-between" align="center">

                            <h3 style={{ fontWeight: 'bold' }}>Đặt khám bác sĩ</h3>
                            <ButtonComponent
                                type="primary"
                                hoverable
                            >
                                Xem tất cả <RightOutlined />
                            </ButtonComponent>
                        </Flex>
                        <Text type="secondary">Phiếu khám kèm số thứ tự và thời gian của bạn được xác nhận.</Text>
                        <LoadingComponent isLoading={isLoadingDoctor}>
                            <SlideComponent>
                                {doctors?.data.map((item, index) => {
                                    return (
                                        <CardComponent
                                            key={item._id}
                                            avatar={item.image}
                                            name={item.user.name}
                                            specialty={item.specialty.name}
                                            hospital={item.hospital.name}

                                        >

                                        </CardComponent>
                                    )
                                })}
                            </SlideComponent>
                        </LoadingComponent>

                    </div>
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '1200px',     // Giới hạn chiều rộng
                            margin: '0 auto',// Căn giữa ngang
                            padding: '30px 20px',
                            overflowX: 'auto',
                        }}
                    >
                        <Flex justify="space-between" align="center">


                            <h3 style={{ fontWeight: 'bold' }}>Đặt khám bệnh viện</h3>
                            <ButtonComponent
                                type="primary"
                                hoverable
                            >
                                Xem tất cả <RightOutlined />
                            </ButtonComponent>
                        </Flex>
                        <Text type="secondary">Đa dạng bệnh viện khác nhau</Text>
                        <LoadingComponent isLoading={isLoadingHospital}>
                            <SlideComponent >

                                {hospitals?.data.map((item, index) => (

                                    <Card
                                        hoverable
                                        key={item._id}
                                        style={{ width: 200 }}
                                        cover={<img
                                            alt="example"
                                            src={`${import.meta.env.VITE_APP_BACKEND_URL}${item.image}`}
                                            style={{
                                                height: 200, // 👈 chỉnh chiều cao nhỏ lại
                                            }}
                                        />}
                                    >
                                        <Card.Meta title={item.name} description={item.address} />

                                    </Card>

                                ))}

                            </SlideComponent>
                        </LoadingComponent>

                    </div>
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '1200px',     // Giới hạn chiều rộng
                            margin: '0 auto',// Căn giữa ngang
                            padding: '30px 20px',
                            overflowX: 'auto',
                        }}
                    >
                        <h3 style={{ fontWeight: 'bold' }}>Đặt khám theo chuyên khoa</h3>
                        <Text type="secondary">Đa dạng chuyên khoa khác nhau</Text>
                        <LoadingComponent isLoading={isLoadingSpecialty}>
                            <Row gutter={[16, 24]} justify="center" style={{ marginTop: '20px' }}>
                                {specialties?.data.map((item, index) => (
                                    <Col key={item._id} xs={12} sm={8} md={8} lg={4} xl={4}>
                                        <Card hoverable style={{ width: '100%', textAlign: 'center' }}>
                                            <img
                                                alt="example"
                                                src={`${import.meta.env.VITE_APP_BACKEND_URL}${item.image}`}
                                                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                                            />
                                            <Card.Meta title={item.name} />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </LoadingComponent>
                        {specialties?.total >= limit ? (

                            <Flex justify="center" align="center" style={{ marginTop: '20px' }}>

                                <ButtonComponent
                                    type="primary"
                                    hoverable
                                    onClick={handleLoadMore}
                                >
                                    Xem thêm
                                </ButtonComponent>
                            </Flex>
                        ) : (
                            <Flex justify="center" align="center" style={{ marginTop: '20px' }}>
                                <ButtonComponent
                                    type="primary"
                                    hoverable
                                    onClick={() => setLimit(6)}
                                >
                                    Thu hẹp danh sách
                                </ButtonComponent>
                            </Flex>
                        )}
                    </div>

                </div>


            </DefaultLayout>
        </>
    );
};

export default HomePage;
