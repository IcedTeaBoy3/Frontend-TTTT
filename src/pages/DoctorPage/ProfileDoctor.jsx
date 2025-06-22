import { Card, Avatar, Button, Image, Tag, Form, Input, Select, InputNumber, Divider, Upload, Row, Col, Typography } from 'antd';
import { EditOutlined, EyeFilled, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../assets/avatar-default-icon.png';
import defaultImage from '../../assets/default_image.png';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useSpecialtyData } from '../../hooks/useSpecialtyData';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as UserService from '../../services/UserService';
import * as HospitalService from '../../services/HospitalService';
import * as DoctorService from '../../services/DoctorService';
import * as Message from '../../components/Message/Message';
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '../../redux/Slice/authSlice';
import { updateDoctor } from '../../redux/Slice/doctorSlice';
import { Wrapper, AvatarWrapper, UploadButton, AddClinicButton } from './style';
import { formatValue } from '../../utils/formatValue';
const { Text, Paragraph } = Typography;
const ProfileDoctor = () => {
    const { user } = useSelector(state => state.auth);
    const doctor = useSelector(state => state.doctor);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { queryGetAllSpecialties } = useSpecialtyData({
        filterStatus: 'active',
    });
    const [isOpenModalDoctor, setIsOpenModalDoctor] = useState(false);
    const [isOpenModalClinic, setIsOpenModalClinic] = useState(false);
    const [formClinic] = Form.useForm();
    const [formUpdateDoctor] = Form.useForm();

    const handleUpdateDoctorRedux = (data) => {
        dispatch(updateDoctor({
            doctorId: doctor?.doctorId,
            position: data?.position,
            qualification: data?.qualification,
            experience: data?.experience,
            description: data?.description,
            specialties: data?.specialties,
            hospital: data?.hospital,
        }));
        dispatch(updateUser({
            name: data?.user.name,
            email: data?.user.email,
            avatar: data?.user.avatar,
        }));
    }
    const mutationUpdateHospital = useMutation({
        mutationFn: ({ id, formData }) => HospitalService.updateHospital(id, formData),
        onSuccess: (data) => {
            Message.success(data?.message || "Cập nhật phòng khám thành công");
            setIsOpenModalClinic(false);
            dispatch(updateDoctor({
                hospital: data?.data
            }));
        },
        onError: (error) => {
            Message.error(error?.response?.data?.message || "Cập nhật phòng khám thất bại");
        }
    })
    const mutationCreateHospital = useMutation({
        mutationFn: (formData) => HospitalService.createHospital(formData),
        onSuccess: (data) => {
            Message.success(data?.message || "Tạo phòng khám thành công");
            setIsOpenModalClinic(false);
            dispatch(updateDoctor({
                hospital: data?.data
            }));
        },
        onError: (error) => {
            Message.error(error?.response?.data?.message || "Tạo phòng khám thất bại");
        }
    })
    const mutationUpdateDoctor = useMutation({
        mutationFn: ({ id, formData }) => DoctorService.updateDoctor(id, formData),
        onSuccess: (data) => {
            Message.success(data?.message || "Cập nhật hồ sơ bác sĩ thành công");
            setIsOpenModalDoctor(false);
            handleUpdateDoctorRedux(data?.data);
        },
        onError: (error) => {
            Message.error(error?.response?.data?.message || "Cập nhật hồ sơ bác sĩ thất bại");
        }
    })

    const { data: specialties, isLoading: isLoadingSpecialties } = queryGetAllSpecialties;
    const { isPending: isPendingUpdateDoctor } = mutationUpdateDoctor;
    const { isPending: isPendingUpdateHospital } = mutationUpdateHospital;
    const { isPending: isPendingCreateHospital } = mutationCreateHospital;
    const handleFinish = (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("position", values.position);
        formData.append("qualification", values.qualification);
        formData.append("experience", values.experience);
        formData.append("description", values.description);
        formData.append("specialties", JSON.stringify(values.specialties));
        if (values.hospital) {
            formData.append("hospitalId", values.hospital);
        }
        mutationUpdateDoctor.mutate({ id: doctor?.doctorId, formData });
    }
    const handleNavigateDetails = () => {
        navigate('/detail-doctor/' + doctor?.doctorId);
    }
    const handleUploadAvatar = async (file) => {
        const formData = new FormData();

        formData.append("avatar", file?.file);
        try {
            const res = await UserService.uploadAvatar(user.id, formData);
            if (res.status === "success") {
                Message.success("Cập nhật ảnh đại diện thành công");
                const updatedUser = { ...user, avatar: res.data.avatar };
                dispatch(updateUser(updatedUser));
            } else {
                Message.error(res.message || "Cập nhật ảnh đại diện thất bại");
            }
        } catch (error) {
            Message.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật ảnh đại diện");
        }
    }
    useEffect(() => {
        if (user && doctor) {
            formUpdateDoctor.setFieldsValue({
                name: user.name,
                email: user.email,
                position: doctor.position,
                qualification: doctor.qualification,
                experience: doctor.experience,
                description: doctor.description,
                specialties: doctor?.specialties?.map(s => s._id),
                hospital: doctor.hospital?._id
            });
        }
    }, [user, doctor]);
    const handleUpdateClinic = async () => {
        formClinic.validateFields()
            .then(async (values) => {
                const formData = new FormData();
                const fileObj = values.thumbnail?.[0]?.originFileObj;
                if (fileObj instanceof File) {
                    formData.append('thumbnail', fileObj);
                } else if (values.thumbnail?.[0]?.url) {
                    // Nếu thumbnail là URL, không cần thêm vào formData
                    const thumbnailUrl = values.thumbnail[0].url;
                    const thumbnailName = thumbnailUrl.replace(import.meta.env.VITE_APP_BACKEND_URL, "");
                    formData.append('oldThumbnail', thumbnailName);
                } else {
                    // Không có ảnh và cũng không dùng ảnh cũ → đã xoá
                    formData.append("isThumbnailDeleted", true);
                }
                formData.append("name", values.name);
                formData.append("address", values.address);
                formData.append("phone", values.phone);
                formData.append("description", values.description);
                if (doctor?.hospital?._id) {
                    mutationUpdateHospital.mutate({ id: doctor.hospital._id, formData });
                } else {
                    mutationCreateHospital.mutate(formData);
                }
            })
            .catch((error) => {
                console.error("Validation failed:", error);
            });

    }
    const handleEditHospital = () => {
        setIsOpenModalClinic(true);
        formClinic.setFieldsValue({
            name: doctor?.hospital?.name,
            address: doctor?.hospital?.address,
            phone: doctor?.hospital?.phone,
            description: doctor?.hospital?.description,
            thumbnail: [
                {
                    uid: '-1',
                    name: doctor?.hospital?.thumbnail,
                    status: 'done',
                    url: doctor?.hospital.thumbnail ? `${import.meta.env.VITE_APP_BACKEND_URL}${doctor?.hospital?.thumbnail}` : defaultImage
                }
            ]
        })

    }
    const handleAddClinic = () => {
        setIsOpenModalClinic(true);
        formClinic.resetFields();
    }
    return (
        <Wrapper>
            <Row gutter={[24, 24]} wrap>
                {/* Hồ sơ bác sĩ */}
                <Col xs={24} md={8}>
                    <Card
                        title="Hồ sơ bác sĩ"
                        actions={[
                            <Button type="link" onClick={() => setIsOpenModalDoctor(true)} icon={<EditOutlined />}>Chỉnh sửa</Button>,
                            <Button type="link" onClick={handleNavigateDetails} icon={<EyeFilled />}>Xem chi tiết</Button>,
                        ]}
                        cover={
                            <>
                                {/* Avatar bọc trong relative div */}
                                <AvatarWrapper>
                                    <Avatar
                                        size={128}
                                        src={user?.avatar ? `${import.meta.env.VITE_APP_BACKEND_URL}${user?.avatar}` : defaultAvatar}
                                        alt="Avatar"
                                    />
                                    {/* Nút upload ảnh đè lên góc phải dưới */}
                                    <Upload
                                        showUploadList={false}
                                        beforeUpload={() => false}
                                        onChange={handleUploadAvatar}
                                        accept="image/*"
                                    >
                                        <UploadButton
                                            icon={<UploadOutlined />}
                                            size="middle"
                                        />
                                    </Upload>
                                </AvatarWrapper>
                                <Divider />
                                <ButtonComponent
                                    type="primary"
                                >
                                    Thông tin cá nhân
                                </ButtonComponent>
                            </>
                        }
                    >
                        <p><strong>Họ tên:</strong> {formatValue(user?.name)}</p>
                        <p><strong>Email:</strong> {formatValue(user?.email)}</p>
                        <p><strong>Chuyên khoa:</strong> {formatValue(doctor?.specialties?.map(s => s.name).join(', '))}</p>
                        <p><strong>Kinh nghiệm:</strong> {formatValue(doctor?.experience)}</p>
                        <p><strong>Vị trí:</strong> {formatValue(doctor?.position)}</p>
                        <p><strong>Bằng cấp:</strong> {formatValue(doctor?.qualification)}</p>
                        <p>
                            <Text strong>Mô tả: </Text>
                            <Paragraph
                                ellipsis={{
                                    rows: 3,
                                    expandable: true,
                                    symbol: 'Xem thêm'
                                }}
                                style={{ marginBottom: 0 }}
                            >
                                {formatValue(doctor?.description)}
                            </Paragraph>
                        </p>
                    </Card>
                </Col>

                {/* Thông tin phòng khám */}
                <Col xs={24} md={16}>
                    {doctor?.hospital ? (
                        <Card
                            title={doctor?.hospital?.name || 'Phòng khám/Bệnh viện'}
                            extra={
                                <Tag color={doctor?.hospital?.status === 'active' ? 'green' : 'red'}>
                                    {doctor?.hospital?.status === 'active' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                                </Tag>
                            }
                            actions={[
                                <Button type="link" onClick={handleEditHospital} icon={<EditOutlined />}>Chỉnh sửa</Button>
                            ]}
                        >
                            <Image
                                src={`${import.meta.env.VITE_APP_BACKEND_URL}${doctor?.hospital?.thumbnail}`}
                                width="100%"
                                height={300}
                                fallback={defaultImage}
                                alt="Ảnh phòng khám"
                                style={{ marginBottom: 16, objectFit: 'cover' }}
                            />
                            <div style={{ marginTop: 16 }}>

                                <p><strong>Địa chỉ:</strong> {formatValue(doctor?.hospital?.address)}</p>
                                <p><strong>Số điện thoại:</strong> {formatValue(doctor?.hospital?.phone)}</p>
                                <p><strong>Loại:</strong> {formatValue(doctor?.hospital?.type === 'clinic' ? 'Phòng khám' : 'Bệnh viện')}</p>
                                <p>
                                    <Text strong>Mô tả: </Text>
                                    <Paragraph
                                        ellipsis={{
                                            rows: 3,
                                            expandable: true,
                                            symbol: 'Xem thêm'
                                        }}
                                        style={{ marginBottom: 0 }}
                                    >
                                        {formatValue(doctor?.hospital?.description)}
                                    </Paragraph>
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <AddClinicButton type="dashed" onClick={handleAddClinic}>
                            <PlusOutlined style={{ fontSize: '60px' }} />
                        </AddClinicButton>
                    )}
                </Col>
            </Row>
            <ModalComponent
                title="Chỉnh sửa hồ sơ bác sĩ"
                open={isOpenModalDoctor}
                onCancel={() => setIsOpenModalDoctor(false)}
                footer={null}
            >
                <Form
                    form={formUpdateDoctor}
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    <Form.Item
                        label="Họ tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                        <Input placeholder='Tên của bạn' />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                    >
                        <Input placeholder='Email của bạn' />
                    </Form.Item>
                    <Form.Item
                        label="Chuyên khoa"
                        name="specialties"
                        rules={[{ required: true, message: 'Vui lòng chọn chuyên khoa' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn chuyên khoa"
                            options={specialties?.data?.map(s => ({ label: s.name, value: s._id }))}
                            loading={isLoadingSpecialties}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Phòng khám/Bệnh viện"
                        name="hospital"
                    >
                        <Select
                            options={doctor?.hospital ? [{ label: doctor?.hospital?.name, value: doctor?.hospital?._id }] : []}
                            style={{ width: '100%' }}
                            popupRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider style={{ margin: '8px 0' }} />
                                    <Button
                                        type="link"

                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Ngăn dropdown đóng

                                        }}
                                    >
                                        {doctor?.hospital ?
                                            <ButtonComponent
                                                type="dashed"
                                                icon={<EditOutlined />}
                                            >
                                                Chỉnh sửa phòng khám
                                            </ButtonComponent>
                                            :
                                            <ButtonComponent
                                                type="dashed"
                                                icon={<PlusOutlined />}

                                            >
                                                Tạo phòng khám mới
                                            </ButtonComponent>
                                        }
                                    </Button>
                                </>
                            )}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Vị trí"
                        name="position"
                    >
                        <Input placeholder="Chức vị của bạn" />
                    </Form.Item>
                    <Form.Item
                        label="Bằng cấp"
                        name="qualification"
                        rules={[{ required: true, message: 'Vui lòng nhập bằng cấp' }]}
                    >
                        <Input placeholder='Học vị của bạn' />
                    </Form.Item>
                    <Form.Item
                        label="Kinh nghiệm (năm)"
                        name="experience"
                    >
                        <InputNumber min={0} max={50} />
                    </Form.Item>
                    <Form.Item
                        label="Mô tả chuyên môn"
                        name="description"
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPendingUpdateDoctor}

                        >Lưu</Button>
                    </Form.Item>
                </Form>
            </ModalComponent>
            <ModalComponent
                title={doctor?.hospital ? "Cập nhật phòng khám" : "Thêm phòng khám mới"}
                open={isOpenModalClinic}
                onOk={handleUpdateClinic}
                okText={doctor?.hospital ? "Cập nhật" : "Thêm mới"}
                cancelText="Hủy"
                confirmLoading={isPendingUpdateHospital || isPendingCreateHospital}
                onCancel={() => setIsOpenModalClinic(false)}
                width={600}
            >
                <Form
                    form={formClinic}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    style={{ maxWidth: 600 }}
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        label="Tên phòng khám"
                        rules={[{
                            required: true,
                            message: "Vui lòng nhập tên phòng khám!"
                        }]}
                    >
                        <Input type="text" placeholder="Tên phòng khám" />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{
                            required: true,
                            message: "Vui lòng nhập địa chỉ phòng khám!"
                        }]}
                    >
                        <Input type="text" placeholder="Địa chỉ phòng khám" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{
                            required: true,
                            message: "Vui lòng nhập số điện thoại phòng khám!"
                        }]}
                    >
                        <Input type="text" placeholder="SĐT" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{
                            required: true,
                            message: "Vui lòng nhập mô tả phòng khám!"
                        }]}
                    >
                        <Input.TextArea placeholder="Mô tả" rows={4} maxLength={400} />
                    </Form.Item>
                    <Form.Item
                        label="Ảnh phòng khám"
                        name="thumbnail"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e && e.fileList
                        }
                        rules={[{
                            required: true,
                            message: "Vui lòng chọn ảnh phòng khám!"
                        }]}
                        extra="Chọn ảnh phòng khám (jpg, jpeg, png, gif) tối đa 1 file"
                    >


                        <Upload
                            name="file"
                            beforeUpload={() => false}
                            maxCount={1}
                            accept=".jpg, .jpeg, .png, .gif"
                            listType="picture"
                        >
                            <ButtonComponent icon={<UploadOutlined />}>
                                Chọn file
                            </ButtonComponent>
                        </Upload>


                    </Form.Item>
                </Form>
            </ModalComponent>
        </Wrapper>

    )
}

export default ProfileDoctor