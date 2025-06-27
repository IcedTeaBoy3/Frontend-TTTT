
import { Row, Col, Pagination, Typography, Select, Input, Radio, Flex, Card, Divider, Carousel, Image, Rate, Space } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as DoctorService from '../../services/DoctorService'
import * as SpecialtyService from '../../services/SpecialtyService'
import * as HospitalService from '../../services/HospitalService'
import CardComponent from "../../components/CardComponent/CardComponent";
import { useNavigate } from 'react-router-dom';
import { FilterOutlined } from '@ant-design/icons';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import { Wrapper, Section, SpecialtyCard, SpecialtyImage, InfoBox, BoldTitle, LightText, FilterCard, HospitalCard, HospitalImage, TwoLineDescription } from './style'
import { HomeOutlined, SolutionOutlined, MedicineBoxOutlined } from '@ant-design/icons'
import bookingDoctorImage1 from '../../assets/dat_kham_bac_si_2.webp'
import bookingDoctorImage2 from '../../assets/dat_kham_bac_si.webp'
import TabsComponent from '../../components/TabsComponent/TabsComponent'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/CustomBreadcrumb'
import { useDebounce } from '../../hooks/useDebounce'
const { Title, Text } = Typography;
const options = [
    { label: "Cử nhân", value: "Cử nhân" },
    { label: "Bác sĩ đa khoa", value: "Bác sĩ đa khoa" },
    { label: "Thạc sĩ", value: "Thạc sĩ" },
    { label: "Tiến sĩ", value: "Tiến sĩ" },
    { label: "Bác sĩ CKI", value: "CKI" },
    { label: "Bác sĩ CKII", value: "CKII" },
    { label: "Giáo sư - Tiến sĩ", value: "GS.TS" },
    { label: "Phó giáo sư - Tiến sĩ", value: "PGS.TS" },
];
const DoctorHospitalLists = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedTab, setSelectedTab] = useState('doctors');
    const [selectedQualification, setSelectedQualification] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });
    const debouncedSearchValue = useDebounce(searchValue, 500);
    useEffect(() => {
        if (type === 'hospitals') {
            setSelectedTab('hospitals');
        } else {
            setSelectedTab('doctors');
        }
    }, [type]);
    const queryGetAllDoctors = useQuery({
        queryKey: ["getAllDoctors", pagination.current, pagination.pageSize, selectedSpecialty, selectedQualification, debouncedSearchValue],
        queryFn: () => DoctorService.getAllDoctors(
            true,
            pagination.current,
            pagination.pageSize,
            selectedSpecialty,
            selectedQualification,
            debouncedSearchValue
        ),
        enabled: selectedTab === 'doctors' || selectedTab === 'hospitals',
    })
    const queryGetAllSpecialties = useQuery({
        queryKey: ["getAllSpecialties"],
        queryFn: () => SpecialtyService.getAllSpecialties('active'),
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
        enabled: selectedTab === 'doctors'
    })
    const queryGetAllHospitals = useQuery({
        queryKey: ["getAllHospitals", pagination.current, pagination.pageSize, selectedSpecialty, debouncedSearchValue],
        queryFn: () => HospitalService.getAllHospitals('hospital', 'active',
            pagination.current,
            pagination.pageSize,
            selectedSpecialty,
            debouncedSearchValue,
        ),
        enabled: selectedTab === 'hospitals',

    })

    const { data: doctors, isLoading: isLoadingDoctor, isError: isErrorDoctor } = queryGetAllDoctors;
    const { data: specialties, isLoading: isLoadingSpecialty } = queryGetAllSpecialties;
    const { data: hospitals, isLoading: isLoadingHospital, isError: isErrorHospital } = queryGetAllHospitals;
    pagination.total = selectedTab === 'doctors' ? doctors?.total : hospitals?.total || 0;
    const handleOnchangePage = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize,
        }));
    }
    const isFiltering = selectedSpecialty || selectedQualification || searchValue;
    const handleSearchSpecialty = (specialtyId) => {
        navigate(`/search?specialty=${specialtyId}`);
    }
    const handleClearFilters = () => {
        setSelectedSpecialty(null);
        setSelectedQualification(null);
        setSearchValue('');
        setPagination(prev => ({
            ...prev,
            current: 1, // Reset to first page when filters are cleared
        }));
    }
    const items = [
        {
            key: 'doctors',
            label: 'Tất cả bác sĩ',
        },
        {
            key: 'hospitals',
            label: 'Tất cả phòng khám',
        },
    ]
    const handleOnchangeTab = (key) => {
        setSelectedTab(key);
        setPagination({
            current: 1,
            pageSize: 6,
            total: 0,
        });
    }
    const renderDoctors = () => {
        if (isErrorDoctor) {
            return (
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Text type="danger">Đã xảy ra lỗi khi tải danh sách bác sĩ. Vui lòng thử lại sau.</Text>
                </Col>
            );
        }

        return (

            doctors?.data?.map((doctor) => (
                <Col key={doctor._id} xs={24} sm={12} md={8} lg={8}>
                    <CardComponent
                        name={doctor.user?.name}
                        avatar={doctor.user?.avatar}
                        specialty={doctor.specialties?.[0]?.name}
                        hospital={doctor.hospital?.name}
                        onClick={() => navigate(`/detail-doctor/${doctor._id}`)}
                    />
                </Col>
            ))
        )

    };

    const renderHospitals = () => {
        if (isErrorHospital) {
            return (
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Text type="danger">Đã xảy ra lỗi khi tải danh sách phòng khám. Vui lòng thử lại sau.</Text>
                </Col>
            );
        }

        return (
            hospitals?.data?.map((hospital) => (
                <Col key={hospital._id} xs={24} sm={12} md={8} lg={8}>
                    <HospitalCard
                        hoverable
                        variant="outlined"
                        cover={
                            <HospitalImage
                                src={`${import.meta.env.VITE_APP_BACKEND_URL}${hospital.thumbnail}`}
                                alt={hospital.name}
                            />
                        }
                        onClick={() => navigate(`/detail-hospital/${hospital._id}`)}
                    >
                        <Card.Meta
                            title={hospital.name}
                            description={<TwoLineDescription>{hospital.address}</TwoLineDescription>}
                        />
                    </HospitalCard>
                </Col>
            ))

        )
    };

    const renderEmptyState = () => {
        if (selectedTab === 'doctors' && (!doctors || doctors?.data?.length === 0)) {
            return (
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Text type="secondary">Không có bác sĩ nào phù hợp với tiêu chí tìm kiếm của bạn.</Text>
                </Col>
            );
        }

        if (selectedTab === 'hospitals' && (!hospitals || hospitals?.data?.length === 0)) {
            return (
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Text type="secondary">Không có phòng khám nào phù hợp với tiêu chí tìm kiếm của bạn.</Text>
                </Col>
            );
        }

        return null;
    };
    return (
        <Wrapper>
            <TabsComponent
                items={items}
                activeKey={selectedTab}
                onChange={handleOnchangeTab}
            />
            <Section>
                <CustomBreadcrumb
                    items={[
                        { label: 'Trang chủ', to: '/', icon: <HomeOutlined /> },
                        { label: `Danh sách ${selectedTab === 'hospitals' ? 'phòng khám' : 'bác sĩ'}`, to: '/doctor-hospital-lists', icon: selectedTab === 'hospitals' ? <MedicineBoxOutlined /> : <SolutionOutlined /> }
                    ]}
                />
                <Row gutter={[16, 16]} justify="center">
                    <Col md={6} sm={12} xs={24}>
                        <FilterCard>
                            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                                <Title level={4} style={{ margin: 0 }}>
                                    <FilterOutlined style={{ color: isFiltering ? "#1890ff" : "#000" }} /> Bộ lọc
                                </Title>
                                {isFiltering && (
                                    <ButtonComponent danger size="small" onClick={handleClearFilters}>
                                        Xóa bộ lọc
                                    </ButtonComponent>
                                )}
                            </Flex>

                            <Divider style={{ margin: '8px 0' }} />

                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <Text strong>Tìm theo tên:</Text>
                                <Input
                                    placeholder="Nhập tên"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </Space>

                            <Divider style={{ margin: '16px 0' }} />

                            <Text strong>Chuyên khoa:</Text>
                            <Select
                                mode="single"
                                placeholder="Chọn chuyên khoa"
                                style={{ width: '100%' }}
                                value={selectedSpecialty}
                                options={specialties?.data?.map(specialty => ({
                                    label: specialty.name,
                                    value: specialty._id
                                }))}
                                showSearch
                                optionFilterProp="children"
                                onChange={(value) => {
                                    setSelectedSpecialty(value);
                                    setPagination(prev => ({ ...prev, current: 1 }));
                                }}
                            />

                            <Divider style={{ margin: '16px 0' }} />

                            <Text strong>Trình độ chuyên môn:</Text>
                            <Radio.Group
                                options={options}
                                optionType="button"
                                buttonStyle="solid"
                                style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}
                                value={selectedQualification}
                                onChange={(e) => {
                                    setSelectedQualification(e.target.value);
                                    setPagination(prev => ({ ...prev, current: 1 }));
                                }}
                            />

                            <Divider style={{ margin: '16px 0' }} />

                            <Text strong>Đánh giá:</Text>
                            <Rate allowHalf defaultValue={2.5} style={{ marginTop: 4 }} />
                        </FilterCard>
                    </Col>


                    <Col md={18} sm={12} xs={24}>
                        <LoadingComponent isLoading={isLoadingDoctor || isLoadingHospital || isLoadingSpecialty}>

                            <Row gutter={[16, 16]} justify="start" >
                                {selectedTab === "doctors" && renderDoctors()}
                                {selectedTab === "hospitals" && renderHospitals()}
                            </Row>

                            {pagination.total > pagination.pageSize && (
                                <Row justify="center" style={{ marginTop: '20px' }}>
                                    <Pagination
                                        current={pagination.current}
                                        pageSize={pagination.pageSize}
                                        total={pagination.total}
                                        showSizeChanger={false}
                                        onChange={handleOnchangePage}
                                    />
                                </Row>
                            )}

                        </LoadingComponent>
                        {renderEmptyState()}
                    </Col>

                </Row>
            </Section>

            <Section>
                <Title level={2} style={{ marginTop: '40px', fontWeight: 'bold', textAlign: 'center' }}>
                    Đa dạng chuyên khoa khám
                </Title>
                <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 40 }}>Đa dạng chuyên khoa khác nhau</Text>
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
            </Section>
            <Section>
                <Title level={2} style={{ textAlign: "center" }}>
                    An tâm tìm và đặt bác sĩ
                </Title>
                <Text style={{ display: "block", textAlign: "center", marginBottom: 40 }} type="secondary">
                    Hơn 600 bác sĩ liên kết chính thức với YouMed
                </Text>
                <Row gutter={[40, 40]} align="middle">
                    <Col xs={24} md={12}>

                        <Carousel autoplay dotPosition={"right"} style={{ width: '100%' }} >
                            <Image
                                src={bookingDoctorImage1}
                                alt="Đặt khám bác sĩ"
                                preview={false}
                                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                            />
                            <Image
                                src={bookingDoctorImage2}
                                alt="Đặt khám bác sĩ"
                                preview={false}
                                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                            />
                        </Carousel>

                    </Col>
                    <Col xs={24} md={12}>
                        <InfoBox>
                            <BoldTitle>Đội ngũ bác sĩ</BoldTitle>
                            <br />
                            <LightText>
                                Tất cả các bác sĩ đều có liên kết chính thức với YouMed để bảo đảm lịch đặt khám của bạn được xác nhận.
                            </LightText>
                        </InfoBox>
                        <Divider />
                        <InfoBox>
                            <BoldTitle>Đặt khám dễ dàng, nhanh chóng, chủ động</BoldTitle>
                            <br />
                            <LightText>
                                Chỉ với 1 phút, bạn có thể đặt khám thành công với bác sĩ. Phiếu khám bao gồm số thứ tự và khung thời gian dự kiến.
                            </LightText>
                        </InfoBox>
                    </Col>
                </Row>
            </Section>
        </Wrapper >
    )
}

export default DoctorHospitalLists