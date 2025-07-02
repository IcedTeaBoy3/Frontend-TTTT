import { Container, ContentBox, HospitalInfo, InfoSection, StickyFooter, Hotline, BookingButton } from "./style"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import * as HospitalService from "../../services/HospitalService"
import { Avatar, Typography, Space } from "antd"
import { PhoneFilled, EnvironmentFilled, HomeOutlined, InfoCircleOutlined, MedicineBoxOutlined } from "@ant-design/icons"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setAppointment, updateAppointment } from "../../redux/Slice/appointmentSlice"
import { CustomTabs } from "../../components/TabsComponent/style"
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent"
import HospitalInfor from "../../components/HospitalInfor/HospitalInfor"
import ServiceHospital from "../../components/ServiceHospital/ServiceHospital"
import CustomBreadcrumb from "../../components/CustomBreadcrumb/CustomBreadcrumb"
import ViewerCKeditorStyled from "../../components/ViewerCKeditorStyled/ViewerCKeditorStyled"
const { Title, Text } = Typography
const DetailHospitalPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const queryGetHospital = useQuery({
        queryKey: ["getHospital", id],
        queryFn: () => HospitalService.getHospital(id),
        enabled: !!id,
    })
    const { data: hospital, isLoading: isLoadingHospital } = queryGetHospital
    useEffect(() => {
        if (hospital && hospital?.data) {
            // Cập nhật thông tin bệnh viện vào appointment nếu có
            dispatch(updateAppointment({
                hospital: hospital.data,
            }))
        } else {
            // Nếu không có bệnh viện, reset appointment
            dispatch(setAppointment({
                hospital: null,
            }))
        }
    }, [hospital])
    const onChange = key => {
        console.log(key);
    };
    const items = [
        {
            key: '1',
            label: 'Thông tin',
            children: <HospitalInfor hospital={hospital} />,
        },
        {
            key: '2',
            label: 'Dịch vụ khám',
            children: <ServiceHospital
                hospitalId={hospital?.data?._id}
                doctors={hospital?.data?.doctors}
            />,
        },
    ];
    const breadcrumbItems = [
        { label: 'Trang chủ', to: '/', icon: <HomeOutlined /> },
        { label: 'Danh sách phòng khám', to: '/doctor-hospital-lists?type=hospitals', icon: <MedicineBoxOutlined /> },
        { label: hospital?.data?.name || 'Chi tiết bệnh viện', to: '', icon: <InfoCircleOutlined /> },
    ];
    return (

        <LoadingComponent isLoading={isLoadingHospital}>
            <Container>
                <CustomBreadcrumb items={breadcrumbItems} />
                <ContentBox>
                    <HospitalInfo>
                        <Avatar
                            shape="square"
                            size={170}
                            src={`${import.meta.env.VITE_APP_BACKEND_URL}${hospital?.data?.thumbnail}`}
                        />
                        <InfoSection>
                            <Title level={3}>Phòng khám {hospital?.data?.name}</Title>

                            <Space direction="horizontal" style={{ marginTop: 16, gap: 16 }}>
                                <ButtonComponent
                                    type="dashed"
                                    onClick={() => {
                                        const address = encodeURIComponent(hospital?.data?.address || '');
                                        window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                                    }}
                                    icon={<EnvironmentFilled />}
                                >

                                    <Text strong>Địa chỉ</Text>
                                </ButtonComponent>
                                <ButtonComponent
                                    type="dashed"
                                    icon={<PhoneFilled />}
                                    onClick={() => {
                                        window.open(`tel:${hospital?.data?.phone}`);
                                    }}
                                >

                                    <Text strong> Gọi ngay</Text>
                                </ButtonComponent>
                            </Space>
                        </InfoSection>
                    </HospitalInfo>
                    <CustomTabs
                        items={items}
                        onChange={onChange}
                        defaultActiveKey="1"
                        style={{ marginBottom: 16 }}
                    />
                    <StickyFooter>
                        <Hotline>
                            <Text strong>Hỗ trợ đặt khám qua hotline:</Text>
                            <Text strong style={{ fontSize: 18, color: "#1890ff" }}>{hospital?.data?.phone}</Text>
                        </Hotline>
                        <BookingButton
                            type="primary"
                            size="large"
                            onClick={() => { navigate(`/booking?type=hospital&&hospitalId=${hospital?.data._id}`) }}
                            disabled={false}
                        >
                            Đặt lịch khám
                        </BookingButton>
                    </StickyFooter>
                </ContentBox>
            </Container>
        </LoadingComponent>

    )
}

export default DetailHospitalPage