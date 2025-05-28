import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Form, Input, Select, Table, Space } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined
} from "@ant-design/icons";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import ActionButtonGroup from "../../components/ActionButtonGroup/ActionButtonGroup";
import { useDoctorData } from "../../hooks/useDoctorData";
import { useSpecialtyData } from "../../hooks/useSpecialtyData";
import { useHospitalData } from "../../hooks/useHospitalData";
import { useState, useRef } from "react";
const Doctor = () => {
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rowSelected, setRowSelected] = useState(null);
    const [formCreate] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const fileInputRef = useRef(null);
    const [fileType, setFileType] = useState(null); // "csv" hoặc "excel"

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
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
    const { queryGetAllSpecialties } = useSpecialtyData({});
    const { queryGetAllHospitals } = useHospitalData({});

    const {
        queryGetAllDoctors,
        mutationCreateDoctor,
        mutationDeleteDoctor,
        mutationUpdateDoctor,
        mutationDeleteManyDoctors,
    } = useDoctorData({
        setIsModalOpenCreate,
        setIsDrawerOpen,
        setIsModalOpenDeleteMany,
        setIsModalOpenDelete,
        setSelectedRowKeys,
        setRowSelected,
    });
    const { data: specialties, isLoading: isLoadingSpecialty } = queryGetAllSpecialties;
    const { data: hospitals, isLoading: isLoadingHospital } = queryGetAllHospitals;
    const { data: doctors, isLoading: isLoadingDoctor } = queryGetAllDoctors;
    const { isPending: isPendingAdd } = mutationCreateDoctor;
    const { isPending: isPendingUpdate } = mutationUpdateDoctor;
    const { isPending: isPendingDelete } = mutationDeleteDoctor;
    const { isPending: isPendingDeleteMany } = mutationDeleteManyDoctors;
    const handleAddDoctor = () => {
        formCreate.validateFields().then((values) => {
            mutationCreateDoctor.mutate({
                name: values.name,
                email: values.email,
                password: values.password,
                specialtyId: values.specialtyId,
                hospitalId: values.hospitalId,
                qualification: values.qualification,
                position: values.position,
                experience: values.experience,
                description: values.description,
            })
        }).catch((error) => {
            console.error("Validation failed:", error);
            // Handle validation errors if needed
        });
    };
    const handleCloseAddDoctor = () => {
        setIsModalOpenCreate(false);
    };
    const handleEditDoctor = (id) => {

        const doctor = doctors?.data?.find((item) => item._id === id);
        if (doctor) {
            formUpdate.setFieldsValue({
                name: doctor.user?.name,
                email: doctor.user?.email,
                specialtyId: doctor.specialty?._id,
                hospitalId: doctor.hospital?._id,
                qualification: doctor.qualification,
                position: doctor.position,
                experience: doctor.experience,
                description: doctor.description,
            });
        }
        setIsDrawerOpen(true);
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
            title: "Tên bác sĩ",
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <span style={{ fontWeight: "bold" }}>{text}</span>
            ),
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name?.length - b.name?.length,
        },
        {
            title: "Tên bệnh viện",
            dataIndex: "hospital",
            key: "hospital",
            ...getColumnSearchProps("hospital"),
            sorter: (a, b) => a.hospital?.length - b.hospital?.length,
        },
        {
            title: "Tên chuyên khoa",
            dataIndex: "specialty",
            key: "specialty",
            ...getColumnSearchProps("specialty"),
            sorter: (a, b) => a.specialty?.length - b.specialty?.length,
        },
        {
            title: "Chức vụ",
            dataIndex: "position",
            key: "position",
            sorter: (a, b) => a.position?.length - b.position?.length,
        },
        {
            title: "Học vị",
            dataIndex: "qualification",
            key: "qualification",
        },
        {
            title: "Kinh nghiệm",
            dataIndex: "experience",
            key: "experience",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (text) => text?.length > 60 ? text.substring(0, 50) + "..." : text,

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
                        onClick={() => handleEditDoctor(record.key)}
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
    const dataTable = doctors?.data?.map((item, index) => ({
        key: item._id,
        index: index + 1,
        name: item.user?.name,
        hospital: item.hospital?.name,
        specialty: item.specialty?.name,
        position: item.position,
        qualification: item.qualification,
        experience: item.experience,
        description: item.description,
    })) || [];

    const handleOnUpdateDoctor = (values) => {
        mutationUpdateDoctor.mutate({
            id: rowSelected,
            name: values.name,
            email: values.email,
            specialtyId: values.specialtyId,
            hospitalId: values.hospitalId,
            qualification: values.qualification,
            position: values.position,
            experience: values.experience,
            description: values.description,
        })
    }
    const handleOkDelete = () => {
        mutationDeleteDoctor.mutate(rowSelected)
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleOkDeleteMany = () => {
        mutationDeleteManyDoctors.mutate(selectedRowKeys)
    };
    const handleCancelDeleteMany = () => {
        setIsModalOpenDeleteMany(false);
    };
    const handleChooseFile = (type) => {

    }
    const handleFileChange = (e) => {

    }
    const handleExportExcel = () => {

    }
    const handleExportCSV = () => {

    }
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
            <LoadingComponent isLoading={isLoadingDoctor} delay={200}>
                <Table
                    rowSelection={rowSelection}
                    rowKey={"key"}
                    columns={columns}
                    scroll={{ x: "max-content" }}
                    dataSource={dataTable}
                    locale={{
                        emptyText: "Không có dữ liệu bác sĩ"
                    }}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        position: ["bottomCenter"],
                        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} bác sĩ`,
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
            <DrawerComponent
                title="Chi tiết bác sĩ"
                placement="right"
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                width={window.innerWidth < 768 ? "100%" : 600}
                forceRender
            >
                <LoadingComponent isLoading={isPendingUpdate}>
                    <Form
                        name="formUpdate"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 600, padding: "20px" }}
                        initialValues={{ remember: true }}
                        onFinish={handleOnUpdateDoctor}
                        autoComplete="off"
                        form={formUpdate}
                    >
                        <Form.Item
                            label="Tên bác sĩ"
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
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập email!",
                                },
                                {
                                    type: "email",
                                    message: "Email không hợp lệ!",
                                },
                            ]}
                        >
                            <Input name="email" autoComplete="username" />
                        </Form.Item>
                        <Form.Item
                            label="Chuyên khoa"
                            name="specialtyId"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn chuyên khoa!",
                                },
                            ]}
                        >


                            <Select
                                name="specialtyId"
                                showSearch
                                placeholder="Chọn chuyên khoa"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >
                                {specialties &&
                                    specialties?.data?.map((item) => (
                                        <Select.Option
                                            key={item._id}
                                            value={item._id}
                                        >
                                            {item.name}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>


                        <Form.Item
                            label="Bệnh viện"
                            name="hospitalId"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn bệnh viện!",
                                },
                            ]}
                        >
                            <Select
                                name="hospitalId"
                                showSearch
                                placeholder="Chọn bệnh viện"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >

                                {hospitals &&
                                    hospitals?.data?.map((item) => (
                                        <Select.Option
                                            key={item._id}
                                            value={item._id}

                                        >
                                            {item.name}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Học vị"
                            name="qualification"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập học vị!",
                                },
                            ]}
                        >
                            <Input name="qualification" />
                        </Form.Item>
                        <Form.Item
                            label="Chức vụ"
                            name="position"

                        >
                            <Input name="position" />
                        </Form.Item>
                        <Form.Item
                            label="Kinh nghiệm"
                            name="experience"

                        >
                            <Input name="experience" />
                        </Form.Item>
                        <Form.Item
                            label="Mô tả"
                            name="description"
                        >
                            <Input.TextArea
                                name="description"
                                rows={4}
                                showCount
                                maxLength={500}
                            />

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
            </DrawerComponent >
            <LoadingComponent isLoading={isPendingAdd}>
                <ModalComponent
                    title="Thêm mới bác sĩ"
                    open={isModalOpenCreate}
                    onOk={handleAddDoctor}
                    onCancel={handleCloseAddDoctor}
                    width={600}
                    style={{ borderRadius: 0 }}
                >
                    <Form
                        name="formCreate"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 600, padding: "20px" }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        form={formCreate}
                    >
                        <Form.Item
                            label="Tên bác sĩ"
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
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập email!",
                                },
                                {
                                    type: "email",
                                    message: "Email không hợp lệ!",
                                },
                            ]}
                        >
                            <Input name="email" autoComplete="username" />
                        </Form.Item>
                        <Form.Item
                            label="Mật khẩu"
                            name="password"

                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu!",
                                },
                                {
                                    min: 6,
                                    message: "Mật khẩu phải có ít nhất 6 ký tự!",
                                },
                                {
                                    max: 20,
                                    message: "Mật khẩu không được quá 20 ký tự!",
                                },
                                {
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                                    message:
                                        "Mật khẩu phải có ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt!",
                                },
                            ]}
                        >
                            <Input.Password name="password" autoComplete="new-password" />
                        </Form.Item>
                        <Form.Item
                            label="Nhập lại mật khẩu"
                            dependencies={["password"]}
                            name="confirmPassword"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập lại mật khẩu!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "Mật khẩu không khớp!"
                                            )
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password name="confirmPassword" autoComplete="new-password" />
                        </Form.Item>

                        <LoadingComponent isLoading={isLoadingSpecialty}>
                            <Form.Item
                                label="Chọn chuyên khoa"
                                name="specialtyId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn chuyên khoa!",
                                    },
                                ]}
                            >


                                <Select
                                    name="specialtyId"
                                    showSearch
                                    placeholder="Chọn chuyên khoa"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {specialties &&
                                        specialties?.data?.map((item) => (
                                            <Select.Option
                                                key={item._id}
                                                value={item._id}
                                            >
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </LoadingComponent>
                        <LoadingComponent isLoading={isLoadingHospital}>
                            <Form.Item
                                label="Chọn bệnh viện"
                                name="hospitalId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn bệnh viện!",
                                    },
                                ]}
                            >
                                <Select
                                    name="hospitalId"
                                    showSearch
                                    placeholder="Chọn bệnh viện"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >

                                    {hospitals &&
                                        hospitals?.data?.map((item) => (
                                            <Select.Option
                                                key={item._id}
                                                value={item._id}
                                            >
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </LoadingComponent>
                        <Form.Item
                            label="Học vị"
                            name="qualification"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập học vị!",
                                },
                            ]}
                        >
                            <Input name="qualification" />
                        </Form.Item>
                        <Form.Item
                            label="Chức vụ"
                            name="position"

                        >
                            <Input name="position" />
                        </Form.Item>
                        <Form.Item
                            label="Kinh nghiệm"
                            name="experience"

                        >
                            <Input name="experience" />
                        </Form.Item>
                        <Form.Item
                            label="Mô tả"
                            name="description"
                        >
                            <Input.TextArea
                                name="description"
                                rows={4}
                                showCount
                                maxLength={100}
                            />

                        </Form.Item>
                    </Form>
                </ModalComponent>
            </LoadingComponent>
            <ModalComponent
                title="Xoá bác sĩ"
                open={isModalOpenDelete}
                onOk={handleOkDelete}
                onCancel={handleCancelDelete}
                style={{ borderRadius: 0 }}
            >
                <LoadingComponent isLoading={isPendingDelete}>
                    <p>
                        Bạn có chắc chắn muốn <strong>xóa</strong> bác sĩ này không?
                    </p>
                </LoadingComponent>
            </ModalComponent>
            <ModalComponent
                title="Xoá bác sĩ"
                open={isModalOpenDeleteMany}
                onOk={handleOkDeleteMany}
                onCancel={handleCancelDeleteMany}
                style={{ borderRadius: 0 }}
            >
                <LoadingComponent isLoading={isPendingDeleteMany}>
                    <p>
                        Bạn có chắc chắn muốn <strong>xóa</strong> bác sĩ này không?
                    </p>
                </LoadingComponent>
            </ModalComponent>
        </>
    );
};

export default Doctor;
