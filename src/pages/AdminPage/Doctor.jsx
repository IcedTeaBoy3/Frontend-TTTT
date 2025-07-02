import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Form, Input, Select, Table, Space, Button, Tag, Upload, Divider, InputNumber, Typography, Popover } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    PlusOutlined,
    UploadOutlined
} from "@ant-design/icons";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import ActionButtonGroup from "../../components/ActionButtonGroup/ActionButtonGroup";
import { useDoctorData } from "../../hooks/useDoctorData";
import { useSpecialtyData } from "../../hooks/useSpecialtyData";
import { useHospitalData } from "../../hooks/useHospitalData";
import ViewerCKeditorPlain from "../../components/ViewerCKEditorPlain/ViewerCKEditorPlain";
import ViewerCKEditorStyled from "../../components/ViewerCKEditorStyled/ViewerCKEditorStyled";
import CKEditorInput from "../../components/CKEditorInput/CKeditorInput";
import { useState, useRef } from "react";
const { Text, Paragraph } = Typography;
const Doctor = () => {
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [openModalCreateClinic, setOpenModalCreateClinic] = useState(false);
    const [clinicForm] = Form.useForm();

    const [selectedClinic, setSelectedClinic] = useState(null);
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
    const { queryGetAllSpecialties } = useSpecialtyData({
        filterStatus: "active",
    });
    const { queryGetAllHospitals, mutationCreateHospital } = useHospitalData({
        setIsModalOpenCreate: setOpenModalCreateClinic,
        type: "clinic",
        status: "active",
    });

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
    const { data: hospital, isPending: isPendingCreate } = mutationCreateHospital;
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
                specialties: JSON.stringify(values.specialties),
                hospitalId: values.hospitalId,
                qualification: values.qualification,
                position: values.position,
                yearExperience: values.yearExperience,
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
                specialties: doctor?.specialties.map((item) => item._id),
                hospitalId: doctor?.hospital?._id,
                qualification: doctor?.qualification || "Cử nhân",
                position: doctor?.position || "",
                yearExperience: doctor?.yearExperience || 0,
                description: doctor?.description || "",
                avatar: [
                    {
                        uid: "-1",
                        name: "avatar.png",
                        status: "done",
                        url: `${import.meta.env.VITE_APP_BACKEND_URL}${doctor?.user?.avatar}`,
                    }
                ]
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
            render: (hospital) => {
                return <span>
                    {hospital ? hospital : <Text type="secondary">Chưa cập nhất</Text>}
                </span>
            },
        },
        {
            title: "Tên chuyên khoa",
            dataIndex: "specialties",
            key: "specialties",
            sorter: (a, b) => a.specialties?.length - b.specialties?.length,

            render: (specialties) => {
                if (!specialties || specialties.length === 0) {
                    return <Text type="secondary">Chưa cập nhật</Text>;
                }
                return (
                    <Popover
                        content={
                            <div style={{ maxWidth: 300 }}>
                                {specialties.map((item) => (
                                    <Tag key={item._id} color="blue" style={{ margin: "2px" }}>
                                        {item.name}
                                    </Tag>
                                ))}
                            </div>
                        }
                        title="Chuyên khoa"
                        trigger="hover"
                    >
                        <Typography.Text ellipsis style={{ maxWidth: 200, display: "inline-block" }}>
                            {specialties.map((item) => item.name).join(", ") || "Chưa cập nhật"}
                        </Typography.Text>
                    </Popover>
                )
            },
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
            title: "Chức vụ",
            dataIndex: "position",
            key: "position",
            sorter: (a, b) => a.position?.length - b.position?.length,
            render: (text) =>
                text
                    ? text.length > 60
                        ? text.substring(0, 50) + "..."
                        : text
                    : <Typography.Text type="secondary">Chưa cập nhật</Typography.Text>
        },
        {
            title: "Học vị",
            dataIndex: "qualification",
            key: "qualification",
            render: (text) => {
                return <span>
                    {text ? text : <Text type="secondary">Chưa cập nhật</Text>}
                </span>
            }
        },
        {
            title: "Kinh nghiệm",
            dataIndex: "yearExperience",
            key: "yearExperience",
            render: (text) => {
                return <span>
                    {text ? text : <Text type="secondary">Chưa cập nhật</Text>}
                </span>
            },
            sorter: (a, b) => a.yearExperience - b.yearExperience,
        },
        {
            title: "Giới thiệu",
            dataIndex: "description",
            key: "description",
            render: (text) =>
                text ? (
                    <Popover
                        placement="top"
                        content={
                            <div
                                style={{
                                    maxWidth: '90vw', // Chiếm tối đa 90% chiều rộng màn hình
                                    maxHeight: '70vh', // Giới hạn chiều cao để không tràn màn
                                    overflow: 'auto', // Cho phép cuộn nếu vượt quá kích thước
                                    wordWrap: 'break-word', // Ngắt từ dài
                                    whiteSpace: 'normal' // Đảm bảo xuống dòng
                                }}
                            >
                                <ViewerCKEditorStyled content={text} />
                            </div>
                        }
                        title="Nội dung đầy đủ"
                    >
                        <div
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: 'pointer',
                                maxWidth: 250,
                            }}
                        >
                            <ViewerCKeditorPlain content={text} />
                        </div>
                    </Popover>
                ) : (
                    <Typography.Text type="secondary">Chưa cập nhật</Typography.Text>
                ),
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
        specialties: item.specialties,
        position: item.position,
        qualification: item.qualification,
        yearExperience: item.yearExperience,
        description: item.description,
    })) || [];

    const handleOnUpdateDoctor = async (values) => {
        const formData = new FormData();
        const avatarFile = values.avatar?.[0]?.originFileObj;
        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("specialties", JSON.stringify(values.specialties));
        if (values.hospitalId) {
            formData.append("hospitalId", values.hospitalId);
        }
        formData.append("qualification", values.qualification);
        formData.append("position", values.position);
        formData.append("yearExperience", values.yearExperience);
        formData.append("description", values.description);
        mutationUpdateDoctor.mutate({
            id: rowSelected,
            formData: formData,
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
    const handleAddClinic = () => {
        clinicForm.validateFields().then((values) => {

            const thumbnailFile = values.thumbnail?.[0]?.originFileObj;
            if (!thumbnailFile) {
                console.error("No image file selected");
                return;
            }
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("address", values.address);
            formData.append("phone", values.phone);
            formData.append("description", values.description);
            formData.append("thumbnail", thumbnailFile);
            formData.append("type", "clinic");
            // Xử lý thêm phòng khám ở đây
            mutationCreateHospital.mutate(formData, {
                onSuccess: () => {
                    clinicForm.resetFields();
                }
            })
        }).catch((error) => {
            console.error("Validation failed:", error);
            // Handle validation errors if needed
        });
    }

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
                width={window.innerWidth < 768 ? "100%" : 700}
                forceRender
            >
                <LoadingComponent isLoading={isPendingUpdate}>
                    <Form
                        name="formUpdate"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 700, padding: "20px" }}
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
                            name="specialties"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn chuyên khoa!",
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                showSearch
                                placeholder="Chọn chuyên khoa"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >
                                {specialties && specialties.data.length > 0 &&
                                    specialties.data.map((item) => (
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
                            <Select placeholder="Chọn học vị">
                                <Select.Option value="Cử nhân">Cử nhân</Select.Option>
                                <Select.Option value="Bác sĩ đa khoa">Bác sĩ đa khoa</Select.Option>
                                <Select.Option value="Thạc sĩ">Thạc sĩ</Select.Option>
                                <Select.Option value="Tiến sĩ">Tiến sĩ</Select.Option>
                                <Select.Option value="CKI">Bác sĩ CKI</Select.Option>
                                <Select.Option value="CKII">Bác sĩ CKII</Select.Option>
                                <Select.Option value="GS.TS">Giáo sư - Tiến sĩ</Select.Option>
                                <Select.Option value="PGS.TS">Phó giáo sư -  Tiến sĩ</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Chức vụ"
                            name="position"

                        >
                            <Input
                                name="position"
                                placeholder="Chức vụ bác sĩ (ví dụ: Bác sĩ chính, Bác sĩ phụ,...)"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Kinh nghiệm"
                            name="yearExperience"
                            rules={[{ type: "number", min: 0, max: 50, message: "Số năm kinh nghiệm không hợp lệ!" }]}
                        >
                            <InputNumber
                                name="yearExperience"
                                min={0}
                                max={50}
                                placeholder="Số năm kinh nghiệm"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Giới thiệu"
                            name="description"

                        >
                            <CKEditorInput
                                name="description"
                                placeholder="Giới thiệu về bác sĩ"
                            />

                        </Form.Item>
                        <Form.Item
                            label="Ảnh đại diện"
                            name="avatar"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (!e) return [];
                                return Array.isArray(e) ? e : e.fileList || [];
                            }}
                            extra="Chọn ảnh chuyên khoa (jpg, jpeg, png, gif, webp) tối đa 1 file"
                        >
                            <Upload
                                name="file"
                                beforeUpload={() => false} // chặn upload tự động
                                maxCount={1}
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                listType="picture"
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
            </DrawerComponent >
            <LoadingComponent isLoading={isPendingAdd}>
                <ModalComponent
                    title="Thêm mới bác sĩ"
                    open={isModalOpenCreate}
                    onOk={handleAddDoctor}
                    onCancel={handleCloseAddDoctor}
                    width={600}
                    style={{ borderRadius: 0 }}
                    okText="Lưu"
                    cancelText="Huỷ"
                >
                    <Form
                        name="formCreate"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 600, padding: "20px" }}
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
                            <Input name="name" placeholder="Tên bác sĩ" />
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
                            <Input name="email" autoComplete="username" placeholder="email đăng nhập" />
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
                            <Input.Password name="password" autoComplete="new-password" placeholder="Mật khẩu" />
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
                            <Input.Password name="confirmPassword" autoComplete="new-password" placeholder="Nhập lại mật khẩu" />
                        </Form.Item>

                        <LoadingComponent isLoading={isLoadingSpecialty}>
                            <Form.Item
                                label="Chọn chuyên khoa"
                                name="specialties"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn chuyên khoa!",
                                    },
                                ]}
                            >


                                <Select
                                    mode="multiple"
                                    name="specialties"
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
                                label="Phòng khám"
                                name="hospitalId"
                            >
                                <Select
                                    placeholder="Chọn phòng khám"
                                    onChange={(value) => setSelectedClinic(value)}
                                    popupRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Button
                                                type="link"
                                                icon={<PlusOutlined />}
                                                onMouseDown={(e) => {
                                                    e.preventDefault(); // Ngăn dropdown đóng
                                                    setOpenModalCreateClinic(true); // Mở modal thêm phòng khám
                                                }}
                                            >
                                                Thêm mới phòng khám
                                            </Button>
                                        </>
                                    )}
                                >
                                    {hospitals && hospitals.data.map(hospital => (
                                        <Select.Option key={hospital._id} value={hospital._id}>
                                            {hospital.name}
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
                            <Select placeholder="Chọn học vị">
                                <Select.Option value="Cử nhân">Cử nhân</Select.Option>
                                <Select.Option value="Bác sĩ đa khoa">Bác sĩ đa khoa</Select.Option>
                                <Select.Option value="Thạc sĩ">Thạc sĩ</Select.Option>
                                <Select.Option value="Tiến sĩ">Tiến sĩ</Select.Option>
                                <Select.Option value="CKI">Bác sĩ CKI</Select.Option>
                                <Select.Option value="CKII">Bác sĩ CKII</Select.Option>
                                <Select.Option value="GS.TS">Giáo sư - Tiến sĩ</Select.Option>
                                <Select.Option value="PGS.TS">Phó giáo sư -  Tiến sĩ</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Chức vụ"
                            name="position"

                        >
                            <Input
                                name="position"
                                placeholder="Chức vụ bác sĩ (ví dụ: Bác sĩ chính, Bác sĩ phụ,...)"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Năm kinh nghiệm"
                            name="yearExperience"
                            rules={[{ type: "number", min: 0, max: 50, message: "Số năm kinh nghiệm không hợp lệ!" }]}
                        >
                            <InputNumber
                                name="yearExperience"
                                min={0}
                                max={50}
                                placeholder="Số năm kinh nghiệm"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Giới thiệu"
                            name="description"

                        >
                            <CKEditorInput
                                name="description"
                            />
                        </Form.Item>
                    </Form>
                </ModalComponent>
            </LoadingComponent>
            <ModalComponent
                title="Thêm phòng khám"
                open={openModalCreateClinic}
                onOk={handleAddClinic}
                onCancel={() => setOpenModalCreateClinic(false)}
                width={600}
                style={{ borderRadius: 0 }}
            >
                <Form
                    form={clinicForm}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    style={{ maxWidth: 600, padding: "20px" }}
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
                        <Input.TextArea
                            type="text"
                            placeholder="Địa chỉ phòng khám"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        />
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
                        <CKEditorInput
                            name="description"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Ảnh"
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

                        >
                            <ButtonComponent icon={<UploadOutlined />}>
                                Chọn file
                            </ButtonComponent>
                        </Upload>


                    </Form.Item>
                </Form>
            </ModalComponent>
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
