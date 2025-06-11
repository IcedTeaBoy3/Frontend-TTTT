
import { Form, Input, Upload, Table, Space, Image, Select, Tag, Radio } from "antd";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import ActionButtonGroup from "../../components/ActionButtonGroup/ActionButtonGroup";
import {
    UploadOutlined,
    EditOutlined,
    SearchOutlined
} from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import { useHospitalData } from "../../hooks/useHospitalData";
import { useDoctorData } from "../../hooks/useDoctorData";
import { useSpecialtyData } from "../../hooks/useSpecialtyData";
const Hospital = () => {
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rowSelected, setRowSelected] = useState(null);
    const [formUpdate] = Form.useForm();
    const [formCreate] = Form.useForm();
    const fileInputRef = useRef(null);
    const [fileType, setFileType] = useState(null); // "csv" hoặc "excel"
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: "checkbox",
    };
    const {
        queryGetAllHospitals,
        mutationCreateHospital,
        mutationDeleteHospital,
        mutationUpdateHospital,
        mutationDeleteManyHospitals,
    } = useHospitalData({
        setIsModalOpenCreate,
        setIsDrawerOpen,
        setIsModalOpenDelete,
        setIsModalOpenDeleteMany,
        setSelectedRowKeys,
        setRowSelected,
        type: '',
    });
    const { queryGetAllDoctors } = useDoctorData({});
    const { queryGetAllSpecialties } = useSpecialtyData({});


    const { data: doctors, isLoading: isLoadingDoctor } = queryGetAllDoctors;
    const { data: specialties, isLoading: isLoadingSpecialty } = queryGetAllSpecialties;
    const { data: hospitals, isLoading } = queryGetAllHospitals;
    const { isPending: isPendingAdd } = mutationCreateHospital;
    const { isPending: isPendingUpdate } = mutationUpdateHospital;
    const { isPending: isPendingDelete } = mutationDeleteHospital;
    const { isPending: isPendingDeleteMany } = mutationDeleteManyHospitals;
    const handleAddHospital = () => {
        formCreate
            .validateFields()
            .then((values) => {
                // Reset form and close modal
                const formData = new FormData();

                // thumbnail chỉ có 1 file
                if (values.thumbnail && values.thumbnail.length > 0) {
                    formData.append('thumbnail', values.thumbnail[0].originFileObj);
                }

                // images: duyệt qua từng ảnh chi tiết
                if (values.images && values.images.length > 0) {
                    values.images.forEach((file) => {
                        formData.append('images', file.originFileObj);
                    });
                }
                console.log("values", values.images);



                formData.append("name", values.name);
                formData.append("description", values.description);
                formData.append("address", values.address);
                formData.append("phone", values.phone);
                formData.append("doctors", JSON.stringify(values.doctors || []));
                formData.append("specialties", JSON.stringify(values.specialties || []));
                formData.append("type", values.type);
                mutationCreateHospital.mutate(formData);
                setIsModalOpenCreate(false);
                formCreate.resetFields();
            })
            .catch((errorInfo) => {
                console.log("Failed:", errorInfo);
            });
    };
    const handleEditHospital = (id) => {
        const hospital = hospitals?.data?.find((item) => item._id === id);
        if (hospital) {
            formUpdate.setFieldsValue({
                name: hospital.name,
                type: hospital.type,
                doctors: hospital.doctors?.map((doctor) => doctor._id) || [],
                specialties: hospital.specialties?.map((specialty) => specialty._id) || [],
                description: hospital.description,
                address: hospital.address,
                phone: hospital.phone,
                thumbnail: [
                    {
                        uid: "-1",
                        name: hospital.thumbnail,
                        status: "done",
                        url: `${import.meta.env.VITE_APP_BACKEND_URL}${hospital.thumbnail}`,
                    },
                ],
                images: hospital.images?.map((image, index) => ({
                    uid: index,
                    name: image,
                    status: "done",
                    url: `${import.meta.env.VITE_APP_BACKEND_URL}${image}`,
                })),
            });
        }
        setIsDrawerOpen(true);
    };
    const handleOnUpdateHospital = (values) => {
        const formData = new FormData();
        if (values.thumbnail && values.thumbnail.length > 0) {
            formData.append('thumbnail', values.thumbnail[0].originFileObj);
        }
        console.log("values", values.images);
        if (values.images && values.images.length > 0) {
            values.images.forEach((file) => {
                formData.append('images', file.originFileObj);
            });
        }
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("address", values.address);
        formData.append("phone", values.phone);
        formData.append("doctors", JSON.stringify(values.doctors || []));
        formData.append("specialties", JSON.stringify(values.specialties || []));
        formData.append("type", values.type);

        mutationUpdateHospital.mutate({ id: rowSelected, formData });
    };
    const handleCloseAddSpecialty = () => {
        setIsModalOpenCreate(false);
    };
    const handleOkDelete = () => {
        mutationDeleteHospital.mutate(rowSelected);
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleOkDeleteMany = () => {
        mutationDeleteManyHospitals.mutate({ ids: selectedRowKeys },);
    }
    const handleCancelDeleteMany = () => {
        setIsModalOpenDeleteMany(false);
    }
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Tìm theo ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <ButtonComponent
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm
                    </ButtonComponent>
                    <ButtonComponent
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Xóa
                    </ButtonComponent>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ color: filtered ? "#1890ff" : undefined }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange: (open) => {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <span style={{ backgroundColor: "#ffc069", padding: 0 }}>
                    {text}
                </span>
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };
    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            sorter: (a, b) => a.index - b.index,
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: "Ảnh",
            dataIndex: "thumbnail",
            key: "thumbnail",
        },
        {
            title: "Bác sĩ",
            dataIndex: "doctors",
            key: "doctors",
            render: (_, record) => (
                <span color="blue">
                    {record.doctors?.length > 0
                        ? record.doctors.map((doctor) => <Tag key={doctor._id} color="blue">{doctor.user.name}</Tag>)
                        : "Chưa có bác sĩ"}
                </span>
            ),
            filters: doctors?.data?.map((item) => ({
                text: item.user.name,
                value: item._id,
            })),
            onFilter: (value, record) =>
                record.doctors?.some((item) => item._id === value),
            filterSearch: true,
            filterMode: "tree",
        },
        {
            title: "Chuyên khoa",
            dataIndex: "specialties",
            key: "specialties",
            render: (_, record) => (
                <span>
                    {record.specialties?.length > 0
                        ? record.specialties.map((specialty) => (
                            <Tag key={specialty._id} color="green">
                                {specialty.name}
                            </Tag>
                        ))
                        : "Chưa có chuyên khoa"}
                </span>
            ),
            filters: specialties?.data?.map((item) => ({
                text: item.name,
                value: item._id,
            })),
            onFilter: (value, record) =>
                record.specialties?.some((item) => item._id === value),
            filterSearch: true,
            filterMode: "tree",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            render: (text) => (
                <Tag color={text === "hospital" ? "blue" : "green"}>
                    {text === "hospital" ? "Bệnh viện" : "Phòng khám"}
                </Tag>
            ),
            filters: [
                { text: "Bệnh viện", value: "hospital" },
                { text: "Phòng khám", value: "clinic" },
            ],
            onFilter: (value, record) => record.type === value,
            filterSearch: true,
            filterMode: "tree",
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <ButtonComponent
                        size="small"
                        type="primary"
                        icon={<EditOutlined style={{ fontSize: "15px" }} />}
                        onClick={() => handleEditHospital(record.key)}
                    >
                        Sửa
                    </ButtonComponent>
                    <ButtonComponent
                        icon={<DeleteOutlined style={{ fontSize: "15px" }} />}
                        styleButton={{ backgroundColor: "red", color: "white" }}
                        size="small"
                        onClick={() => setIsModalOpenDelete(true)}
                    >
                        Xoá
                    </ButtonComponent>
                </Space>
            ),
        },
    ];
    const dataTable = hospitals?.data?.map((item, index) => ({
        key: item._id,
        index: index + 1,
        name: item.name,
        thumbnail: (
            <Image
                src={`${import.meta.env.VITE_APP_BACKEND_URL}${item.thumbnail}`}
                alt={item.name}
                width={50}
                height={50}
                style={{ borderRadius: "8px", objectFit: "cover" }}
            />
        ),
        address: item.address,
        phone: item.phone,
        description: item.description,
        doctors: item.doctors,
        specialties: item.specialties,
        type: item.type
    }));
    const handleExportCSV = () => { }
    const handleExportExcel = () => { }
    const handleChooseFile = (type) => { }
    const handleFileChange = (e) => { }
    return (
        <>
            <ActionButtonGroup
                selectedRowKeys={selectedRowKeys}
                dataTable={dataTable}
                onExportCSV={handleExportCSV}
                onExportExcel={handleExportExcel}
                onImportCSV={() => handleChooseFile("csv")}
                onImportExcel={() => handleChooseFile("excel")}
                fileInputRef={fileInputRef}
                fileType={fileType}
                onFileChange={handleFileChange}
                onDeleteMany={() => setIsModalOpenDeleteMany(true)}
                onCreateNew={() => setIsModalOpenCreate(true)}

            >

            </ActionButtonGroup>
            <LoadingComponent isLoading={isLoading} delay={200}>
                <Table
                    rowSelection={rowSelection}
                    rowKey={"key"}
                    columns={columns}
                    scroll={{ x: "max-content" }}
                    dataSource={dataTable}
                    locale={{ emptyText: "Không có dữ liệu bệnh viện" }}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        position: ["bottomCenter"],
                        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} bệnh viện`,
                        total: pagination.total,
                        showSizeChanger: true, // Cho phép chọn số dòng/trang
                        pageSizeOptions: ["5", "8", "10", "20", "50"], // Tuỳ chọn số dòng
                        showQuickJumper: true, // Cho phép nhảy đến trang
                        onChange: (page, pageSize) => {
                            setPagination({
                                current: page,
                                pageSize: pageSize,
                            });
                        },
                    }}
                    onRow={(record) => ({
                        onClick: () => {
                            setRowSelected(record.key);
                        },
                    })}
                />
            </LoadingComponent>
            <LoadingComponent isLoading={isPendingAdd}>
                <ModalComponent
                    title={formCreate.getFieldValue('type') === 'hospital' ? "Thêm bệnh viện" : "Thêm phòng khám"}
                    open={isModalOpenCreate}
                    onOk={handleAddHospital}
                    onCancel={handleCloseAddSpecialty}
                    width={600}
                    style={{ borderRadius: 0 }}
                >
                    <Form
                        name="formCreate"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 600, padding: "20px" }}
                        initialValues={{ type: "hospital" }}
                        autoComplete="off"
                        form={formCreate}
                    >
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên!",
                                },
                            ]}
                        >
                            <Input name="name" placeholder="Nhập tên bệnh viện" />
                        </Form.Item>
                        <Form.Item
                            label="Loại"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn loại!",
                                },
                            ]}
                        >
                            <Radio.Group
                            >
                                <Radio value="hospital" >Bệnh viện</Radio>
                                <Radio value="clinic">Phòng khám</Radio>
                            </Radio.Group>
                        </Form.Item>


                        <LoadingComponent isLoading={isLoadingDoctor}>
                            <Form.Item
                                label="Chọn bác sĩ"
                                name="doctors"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn ít nhất một bác sĩ!",
                                    },
                                ]}
                            >

                                <Select
                                    mode="multiple"
                                    placeholder="Chọn bác sĩ"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {doctors && doctors.data?.length && doctors.data.map((doctor) => (
                                        <Select.Option key={doctor._id} value={doctor._id}>
                                            {doctor.user.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </LoadingComponent>

                        <LoadingComponent isLoading={isLoadingSpecialty}>
                            <Form.Item
                                label="Chọn chuyên khoa"
                                name="specialties"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn ít nhất một chuyên khoa!",
                                    },
                                ]}
                            >

                                <Select
                                    mode="multiple"
                                    placeholder="Chọn chuyên khoa"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {specialties && specialties.data?.length && specialties.data.map((specialty) => (
                                        <Select.Option key={specialty._id} value={specialty._id}>
                                            {specialty.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </LoadingComponent>




                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mô tả!",
                                },
                            ]}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Nhập mô tả chi tiết tại đây..."
                            />
                        </Form.Item>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập địa chỉ!",
                                },
                            ]}
                        >
                            <Input.TextArea
                                rows={2}
                                placeholder="Nhập địa chỉ tại đây"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số điện thoại!",
                                },
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại " />
                        </Form.Item>
                        <Form.Item
                            label="Ảnh đại diện"
                            name="thumbnail"
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                                Array.isArray(e) ? e : e?.fileList
                            }
                            extra="Chỉ hỗ trợ định dạng .jpg, .jpeg, .png, .gif,Kích thước không quá 2MB."
                        >
                            <Upload
                                name="file"
                                beforeUpload={() => false}
                                maxCount={1}
                                accept=".jpg, .jpeg, .png, .gif"

                            >
                                <ButtonComponent icon={<UploadOutlined />}>
                                    Chọn File
                                </ButtonComponent>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="Ảnh chi tiết"
                            name="images"
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                                Array.isArray(e) ? e : e?.fileList
                            }
                            extra="Chỉ hỗ trợ định dạng .jpg, .jpeg, .png, .gif. Tối đa 5 ảnh. Kích thước mỗi ảnh không quá 2MB."
                        >
                            <Upload
                                name="file"
                                multiple
                                beforeUpload={() => false}
                                maxCount={5}
                                accept=".jpg, .jpeg, .png, .gif"
                            >
                                <ButtonComponent icon={<UploadOutlined />}>
                                    Chọn File
                                </ButtonComponent>
                            </Upload>
                        </Form.Item>
                    </Form>
                </ModalComponent>
            </LoadingComponent >
            <DrawerComponent
                title={formUpdate.getFieldValue('type') === 'hospital' ? "Cập nhật bệnh viện" : "Cập nhật phòng khám"}
                placement="right"
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                width={window.innerWidth < 768 ? "100%" : 700}
                forceRender
            >
                <LoadingComponent isLoading={isPendingUpdate}>
                    <Form
                        name="formUpdate"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 600, padding: "20px" }}
                        initialValues={{ type: "hospital" }}
                        onFinish={handleOnUpdateHospital}
                        autoComplete="off"
                        form={formUpdate}
                    >
                        <Form.Item
                            label={"Tên"}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên!",
                                },
                            ]}
                        >
                            <Input name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Loại"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn loại!",
                                },
                            ]}
                        >
                            <Radio.Group
                            >
                                <Radio value="hospital">Bệnh viện</Radio>
                                <Radio value="clinic">Phòng khám</Radio>
                            </Radio.Group>
                        </Form.Item>


                        <Form.Item
                            label="Chọn bác sĩ"
                            name="doctors"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn ít nhất một bác sĩ!",
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Chọn bác sĩ"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {doctors && doctors.data?.length && doctors.data.map((doctor) => (
                                    <Select.Option key={doctor._id} value={doctor._id}>
                                        {doctor.user.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Chọn chuyên khoa"
                            name="specialties"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn ít nhất một chuyên khoa!",
                                },
                            ]}
                        >

                            <Select
                                mode="multiple"
                                placeholder="Chọn chuyên khoa"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {specialties && specialties.data?.length && specialties.data.map((specialty) => (
                                    <Select.Option key={specialty._id} value={specialty._id}>
                                        {specialty.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mô tả!",
                                },
                            ]}
                        >
                            <Input.TextArea
                                name="description"
                                rows={4}
                                placeholder="Nhập mô tả chi tiết tại đây..."
                            />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập địa chỉ!",
                                },
                            ]}
                        >
                            <Input.TextArea
                                name="address"
                                rows={2}
                                placeholder="Nhập địa chỉ chi tiết tại đây..."
                            />
                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số điện thoại!",
                                },
                            ]}
                        >
                            <Input
                                name="phone"
                                placeholder="Nhập số điện thoại "
                            />
                        </Form.Item>

                        <Form.Item
                            label="Ảnh"
                            name="thumbnail"
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                                Array.isArray(e) ? e : e?.fileList
                            }
                        >
                            <Upload
                                name="file"
                                beforeUpload={() => false}
                                maxCount={1}
                                accept=".jpg, .jpeg, .png, .gif"
                            >
                                <ButtonComponent icon={<UploadOutlined />}>
                                    Chọn file
                                </ButtonComponent>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="Ảnh"
                            name="images"
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                                Array.isArray(e) ? e : e?.fileList
                            }
                        >
                            <Upload
                                name="file"
                                multiple
                                beforeUpload={() => false}
                                maxCount={5}
                                accept=".jpg, .jpeg, .png, .gif"
                            >
                                <ButtonComponent icon={<UploadOutlined />}>
                                    Chọn file
                                </ButtonComponent>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label={null}
                            wrapperCol={{ offset: 18, span: 6 }}
                        >
                            <Space>
                                <ButtonComponent
                                    type="default"
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    Huỷ
                                </ButtonComponent>
                                <ButtonComponent
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Lưu
                                </ButtonComponent>
                            </Space>
                        </Form.Item>
                    </Form>
                </LoadingComponent>
            </DrawerComponent>
            <ModalComponent
                title="Xoá bệnh viện"
                open={isModalOpenDelete}
                onOk={handleOkDelete}
                onCancel={handleCancelDelete}
                style={{ borderRadius: 0 }}
            >
                <LoadingComponent isLoading={isPendingDelete}>
                    <p>
                        Bạn có chắc chắn muốn <strong>xóa</strong> bệnh viện này
                        không?
                    </p>
                </LoadingComponent>
            </ModalComponent>
            <ModalComponent
                title="Xoá bệnh viện"
                open={isModalOpenDeleteMany}
                onOk={handleOkDeleteMany}
                onCancel={handleCancelDeleteMany}
                style={{ borderRadius: 0 }}
            >
                <LoadingComponent isLoading={isPendingDeleteMany}>
                    <p>
                        Bạn có chắc chắn muốn <strong>xóa</strong> bệnh viện này
                        không?
                    </p>
                </LoadingComponent>
            </ModalComponent>
        </>
    );
};

export default Hospital;
