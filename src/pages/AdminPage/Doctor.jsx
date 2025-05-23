import React from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Flex, Form, Input, Select, Table, Space, Pagination, Upload } from "antd";
import {
    DeleteOutlined,
    ExportOutlined,
    ImportOutlined,
    PlusCircleFilled,
    UploadOutlined,
    EditOutlined,
    SearchOutlined
} from "@ant-design/icons";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as SpecialtyService from "../../services/SpecialtyService";
import * as HospitalService from "../../services/HospitalService";
import * as  DoctorService from "../../services/DoctorService";
import * as Message from "../../components/Message/Message";
import { useState, useRef } from "react";
const Doctor = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rowSelected, setRowSelected] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [formCreate] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: "checkbox",
    };
    const queryGetAllSpecialties = useQuery({
        queryKey: ["getAllSpecialties"],
        queryFn: SpecialtyService.getAllSpecialties,
        keepPreviousData: true,
    })
    const queryGetAllHospitals = useQuery({
        queryKey: ["getAllHospitals"],
        queryFn: HospitalService.getAllHospitals,
        keepPreviousData: true,
    })
    const queryGetAllDoctors = useQuery({
        queryKey: ["getAllDoctors"],
        queryFn: () => DoctorService.getAllDoctors(pagination.current, pagination.pageSize),
        keepPreviousData: true,
    })
    const mutaionAddDoctor = useMutation({
        mutationFn: (data) => {
            return DoctorService.createDoctor(data);
        },
        onSuccess: (data) => {
            if (data.status === "success") {
                Message.success(data.message);
                formCreate.resetFields();
                setIsOpenAdd(false);
            } else {
                Message.error(data.message);
            }
        },
        onError: (error) => {
            if (error.response && error.response.status === 400) {
                Message.error(error.response.data.message);
            } else {
                Message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            }
        },
    })
    const mutaionUpdateDoctor = useMutation({
        mutationFn: (data) => {
            const { id, ...rests } = data;
            return DoctorService.updateDoctor(id, rests);
        },
        onSuccess: (data) => {
            if (data.status === "success") {
                Message.success(data.message);
                setIsDrawerOpen(false);
            } else {
                Message.error(data.message);
            }
        },
        onError: (error) => {
            if (error.response && error.response.status === 400) {
                Message.error(error.response.data.message);
            } else {
                Message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            }
        },
    })
    const mutationDeleteDoctor = useMutation({
        mutationFn: (data) => DoctorService.deleteDoctor(data),
        onSuccess: (data) => {
            if (data.status === "success") {
                Message.success(data.message);
                setIsModalOpenDelete(false);
            } else {
                Message.error(data.message);
            }
        },
        onError: (error) => {
            if (error.response && error.response.status === 400) {
                Message.error(error.response.data.message);
            } else {
                Message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            }
        },
    })
    const mutationDeleteManyDoctors = useMutation({
        mutationFn: (ids) => DoctorService.deleteManyDoctors(ids),
        onSuccess: (data) => {
            if (data.status === "success") {
                Message.success(data.message);
                setSelectedRowKeys([]);
                setIsModalOpenDeleteMany(false);
            } else {
                Message.error(data.message);
            }
        },
        onError: (error) => {
            if (error.response && error.response.status === 400) {
                Message.error(error.response.data.message);
            } else {
                Message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            }
        },
    })
    const { data: specialties, isLoading: isLoadingSpecialty } = queryGetAllSpecialties;
    const { data: hospitals, isLoading: isLoadingHospital } = queryGetAllHospitals;
    const { data: doctors, isLoading: isLoadingDoctor } = queryGetAllDoctors;

    const { isPending: isPendingAdd } = mutaionAddDoctor;
    const { isPending: isPendingUpdate } = mutaionUpdateDoctor;
    const { isPending: isPendingDelete } = mutationDeleteDoctor;
    const { isPending: isPendingDeleteMany } = mutationDeleteManyDoctors;
    const handleAddDoctor = () => {
        formCreate.validateFields().then((values) => {
            mutaionAddDoctor.mutate({
                name: values.name,
                email: values.email,
                password: values.password,
                specialtyId: values.specialtyId,
                hospitalId: values.hospitalId,
                qualification: values.qualification,
                position: values.position,
                experience: values.experience,
                description: values.description,
            }, {
                onSettled: () => {
                    queryGetAllDoctors.refetch();
                }
            })

        }).catch((error) => {
            console.log(error);
        });
    };
    const handleCloseAddDoctor = () => {
        setIsOpenAdd(false);
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
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

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
    pagination.total = doctors?.total || 0;
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
    const handleChangePage = (page, pageSize) => {
        setPagination({
            ...pagination,
            current: page,
            pageSize: pageSize,
        });
    }

    const handleOnUpdateDoctor = (values) => {

        mutaionUpdateDoctor.mutate({
            id: rowSelected,
            name: values.name,
            email: values.email,
            specialtyId: values.specialtyId,
            hospitalId: values.hospitalId,
            qualification: values.qualification,
            position: values.position,
            experience: values.experience,
            description: values.description,
        }, {
            onSettled: () => {
                queryGetAllDoctors.refetch();
            }
        })
    }
    const handleOkDelete = () => {
        mutationDeleteDoctor.mutate(rowSelected, {
            onSettled: () => {
                queryGetAllDoctors.refetch();
            }
        })
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleOkDeleteMany = () => {
        mutationDeleteManyDoctors.mutate(selectedRowKeys, {
            onSettled: () => {
                queryGetAllDoctors.refetch();
            }
        })
    };
    const handleCancelDeleteMany = () => {
        setIsModalOpenDeleteMany(false);
    };
    return (
        <>
            <Flex
                gap="middle"
                align="center"
                justify="space-between"
                style={{
                    marginBottom: "20px",
                    flexWrap: "wrap",
                    rowGap: "16px",
                }}
            >
                {/* Left side buttons */}
                <Flex
                    gap="middle"
                    style={{
                        flex: "1 1 300px",
                        justifyContent: "flex-start",
                        flexWrap: "wrap",
                    }}
                >
                    <ButtonComponent
                        danger
                        size="small"
                        disabled={selectedRowKeys.length === 0}
                        icon={<DeleteOutlined />}
                        onClick={() => setIsModalOpenDeleteMany(true)}
                        style={{ minWidth: "120px" }}
                    >
                        Xoá tất cả
                    </ButtonComponent>
                    <ButtonComponent
                        size="small"
                        icon={<PlusCircleFilled />}
                        type="primary"
                        onClick={() => setIsOpenAdd(true)}
                        style={{ minWidth: "120px" }}
                    >
                        Thêm mới
                    </ButtonComponent>
                </Flex>

                {/* Right side buttons */}
                <Flex
                    gap="middle"
                    style={{
                        flex: "1 1 300px",
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                    }}
                >
                    <ButtonComponent
                        size="small"
                        type="default"
                        icon={<ExportOutlined />}
                        styleButton={{
                            minWidth: "120px",
                            backgroundColor: "#52c41a",
                            color: "#fff",
                        }}
                    >
                        Export
                    </ButtonComponent>
                    <ButtonComponent
                        size="small"
                        type="primary"
                        icon={<ImportOutlined />}
                        styleButton={{
                            minWidth: "120px",
                            backgroundColor: "#1890ff",
                            color: "#fff",
                        }}
                    >
                        Import
                    </ButtonComponent>
                </Flex>
            </Flex>
            <LoadingComponent isLoading={isLoadingDoctor} delay={200}>
                <Table
                    rowSelection={rowSelection}
                    rowKey={"key"}
                    columns={columns}
                    scroll={{ x: "max-content" }}
                    dataSource={dataTable}
                    locale={{ emptyText: "Không có dữ liệu bệnh viện" }}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => {
                            setRowSelected(record.key);
                        },
                    })}
                />
                <Pagination
                    style={{ marginTop: "20px", textAlign: "right" }}
                    showQuickJumper
                    align="center"
                    pageSizeOptions={["5", "8", "10", "20", "50"]}
                    showSizeChanger
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handleChangePage}
                    showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`
                    }
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
                            wrapperCol={{ offset: 20, span: 4 }}
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
                    open={isOpenAdd}
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
                <LoadingComponent isLoading={isPendingDeleteMany}>
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
                <LoadingComponent isLoading={isPendingDelete}>
                    <p>
                        Bạn có chắc chắn muốn <strong>xóa</strong> bác sĩ này không?
                    </p>
                </LoadingComponent>
            </ModalComponent>
        </>
    );
};

export default Doctor;
