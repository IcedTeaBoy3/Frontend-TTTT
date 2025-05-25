import LoadingComponent from "../LoadingComponent/LoadingComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useState, useEffect } from "react";
import { Form, Input, Select, DatePicker, Radio, Row, Col } from "antd";
import AddressService from "../../services/AddressService";
import ethnicGroups from '../../data/ethnicGroups';
import occupations from '../../data/occupations';
import { useSelector } from "react-redux";
import dayjs from "dayjs";
const ModalUpdateUser = ({ isModalOpen, isPendingUpdateProfile, handleUpdateProfile, onCancel }) => {
    const patient = useSelector((state) => state.auth.user);
    const [formUpdate] = Form.useForm();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const getNameByCode = (list, code) => list.find(i => i.code === code)?.name || '';
    // Lấy thông tin từ patient
    useEffect(() => {
        if (patient) {
            formUpdate.setFieldsValue({
                name: patient?.name,
                email: patient?.email,
                phone: patient?.phone,
                dataOfBirth: patient?.dateOfBirth ? dayjs(patient?.dateOfBirth) : null,
                gender: patient?.gender,
                address: patient?.address,
                idCard: patient?.idCard,
                ethnic: patient?.ethnic,
                insuranceCode: patient?.insuranceCode,
                job: patient?.job,
            })
        }
    }, [patient]);

    // Gọi API lấy tỉnh
    useEffect(() => {
        const res = AddressService.getAllProvinces();
        res.then((data) => { setProvinces(data); });
    }, [])
    const handleProvinceChange = async (provinceCode) => {
        const provinceName = getNameByCode(provinces, provinceCode);
        const res = await AddressService.getDistrictsByProvince(provinceCode);

        setDistricts(res);
        setWards([]); // Reset xã vì huyện mới chưa được chọn

        // Reset trong form nếu cần
        formUpdate.setFieldsValue({
            district: undefined,
            ward: undefined,
            address: `${provinceName || ''}`,
        });
    };
    const handleDistrictChange = async (districtCode) => {
        const provinceCode = formUpdate.getFieldValue('province');
        const districtName = getNameByCode(districts, districtCode);
        const provinceName = getNameByCode(provinces, provinceCode);
        const res = await AddressService.getWardsByDistrict(districtCode);
        setWards(res);
        formUpdate.setFieldsValue({
            ward: undefined,
            address: `${districtName || ''},${provinceName}`,
        });
    };
    const handleWardChange = (wardCode) => {
        const districtCode = formUpdate.getFieldValue('district');
        const provinceCode = formUpdate.getFieldValue('province');
        const wardName = getNameByCode(wards, wardCode);
        const districtName = getNameByCode(districts, districtCode);
        const provinceName = getNameByCode(provinces, provinceCode);
        const fullAddress = `${wardName || ''}, ${districtName}, ${provinceName}`;
        formUpdate.setFieldsValue({
            address: fullAddress,
        });
    };
    const handleOkUpdate = () => {
        formUpdate.validateFields()
            .then((values) => {
                const updatedData = {
                    ...values,
                    id: patient?.id,
                    dateOfBirth: values.dataOfBirth ? values.dataOfBirth.format('YYYY-MM-DD') : null,
                };
                handleUpdateProfile(updatedData);
            })
            .catch((errorInfo) => {
                console.error('Validation Failed:', errorInfo);
            });
    }
    return (
        <LoadingComponent isLoading={isPendingUpdateProfile}>


            <ModalComponent
                width={900}
                centered
                title="Cập nhật hồ sơ bệnh nhân"
                open={isModalOpen}
                onOk={handleOkUpdate}
                onCancel={onCancel}
                style={{ borderRadius: 0, width: '50%' }}
            >
                <Form
                    form={formUpdate}
                    layout="vertical"
                    style={{ maxWidth: 1000, padding: "20px" }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col span={12}>

                            <Form.Item
                                label="Họ và tên"
                                name="name"

                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>

                            <Form.Item
                                label="Email"
                                name="email"

                                rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>

                            <Form.Item
                                label="Ngày sinh"
                                name="dataOfBirth"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn ngày sinh',
                                    },
                                    {
                                        validator: (_, value) => {
                                            if (!value) return Promise.resolve();

                                            const today = dayjs(); // hoặc moment()
                                            if (value.isAfter(today)) {
                                                return Promise.reject('Ngày sinh không được ở tương lai');
                                            }

                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    placeholder="Chọn ngày sinh"
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>

                            <Form.Item
                                label="Giới tính"
                                name="gender"
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                                initialValue={"male"}
                            >
                                <Radio.Group>
                                    <Radio value="male">Nam</Radio>
                                    <Radio value="female">Nữ</Radio>
                                    <Radio value="other">Khác</Radio>
                                </Radio.Group>
                            </Form.Item>

                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Tỉnh/Thành phố"
                                name="province"

                            >
                                <Select
                                    placeholder="Chọn tỉnh/thành phố"
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={handleProvinceChange}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {provinces?.map((province) => {
                                        return (
                                            <Select.Option key={province.code} value={province.code}>
                                                {province.name}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>

                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Quận/Huyện"
                                name="district"

                            >
                                <Select
                                    placeholder="Chọn Quận/Huyện"
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={handleDistrictChange}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {districts?.map((district) => {
                                        return (
                                            <Select.Option key={district.code} value={district.code}>
                                                {district.name}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>

                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Phường/Xã"
                                name="ward"

                            >
                                <Select
                                    placeholder="Chọn Phường/Xã"
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={handleWardChange}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {wards?.map((ward) => {
                                        return (
                                            <Select.Option key={ward.code} value={ward.code}>
                                                {ward.name}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>

                            </Form.Item>

                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Địa chỉ cụ thể"
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                            >
                                <Input.TextArea placeholder="Số nhà, tên đường" rows={4} />

                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Số CMND/CCCD"
                                name="idCard"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số CMND/CCCD',
                                    },
                                    {
                                        pattern: /^\d{9}$|^\d{12}$/,
                                        message: 'Số CMND phải có 9 số hoặc CCCD phải có 12 số',
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập số CMND/CCCD" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Dân tộc"
                                name="ethnic"
                                rules={[{ required: true, message: 'Vui lòng chọn' }]}
                            >
                                <Select
                                    placeholder="Chọn dân tộc"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {ethnicGroups.map((ethnic) => <Select.Option key={ethnic.code} value={ethnic.name} />)}
                                </Select>

                            </Form.Item>

                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số điện thoại của bạn',
                                    },
                                    {
                                        pattern: /^(0|\+84)[1-9][0-9]{8}$/,
                                        message: 'Số điện thoại không hợp lệ (VD: 0901234567 hoặc +84901234567)',
                                    },
                                ]}
                            >
                                <Input placeholder="Số điện thoại của bạn" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Mã số BHYT"
                                name="insuranceCode"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mã số BHYT',
                                    },
                                    {
                                        pattern: /^[A-Z]{2}[0-9][0-9]{2}[0-9]{10}$/,
                                        message: 'Mã BHYT không đúng định dạng (VD: TE401234567890)',
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập Mã số BHYT" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Nghề nghiệp"
                                name="job"
                                rules={[{ required: true, message: 'Vui lòng nhập Nghề nghiệp' }]}
                            >
                                <Select
                                    placeholder="Chọn Nghề nghiệp"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {occupations.map((occupation) => <Select.Option key={occupation.code} value={occupation.name} />)}
                                </Select>

                            </Form.Item>

                        </Col>
                    </Row>
                </Form>

            </ModalComponent>
        </LoadingComponent>
    )
}

export default ModalUpdateUser