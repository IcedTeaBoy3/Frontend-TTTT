import React from "react";
import { Space, Table, Input, Button, Form, Radio, Flex } from "antd";
import * as UserService from "../../services/UserService";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import {
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    ExportOutlined,
    ImportOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { useMutationHook } from "../../hooks/useMutationHook";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import * as Message from "../../components/Message/Message";
const Patient = () => {
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [formUpdate] = Form.useForm();
    const [rowSelected, setRowSelected] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
    });
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: "checkbox",
    };
    const getAllPatients = async () => {
        const res = await UserService.getAllUsers();
        return res.data;
    };
    const queryGetAllPatients = useQuery({
        queryKey: ["getAllPatients"],
        queryFn: getAllPatients,
    });
    const getUser = async (id) => {
        const res = await UserService.getUser(id);
        return res.data;
    };

    const mutationDeletePatient = useMutationHook((data) =>
        UserService.deleteUser(data),
    );
    const mutationUpdatePatient = useMutationHook((data) => {
        const { id, ...rest } = data;
        return UserService.updateUser(id, rest);
    });
    const mutationDeleteAllPatient = useMutationHook((data) =>
        UserService.deleteManyUsers(data),
    );
    const { data: dataUpdate, isPending: isPendingUpdate } =
        mutationUpdatePatient;
    const { data: dataDelete, isPending: isPendingDelete } =
        mutationDeletePatient;
    const { data: dataDeleteMany, isPending: isPendingDeleteMany } =
        mutationDeleteAllPatient;
    const handleOkDelete = async () => {
        mutationDeletePatient.mutate(
            { id: rowSelected },
            {
                onSettled: () => {
                    queryGetAllPatients.refetch();
                },
            },
        );
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleEditUser = async (id) => {
        const res = await getUser(id);
        if (res?.status == "error") {
            Message.error(res?.message);
            return;
        }
        formUpdate.setFieldsValue({
            name: res?.name,
            email: res?.email,
            phone: res?.phone,
            role: res?.role,
        });
        setIsOpenDrawer(true);
    };
    const handleOnUpdateUser = async (values) => {
        mutationUpdatePatient.mutate(
            {
                id: rowSelected,
                name: values.name,
                email: values.email,
                phone: values.phone,
                role: values.role,
            },
            {
                onSettled: () => {
                    queryGetAllPatients.refetch();
                },
            },
        );
    };

    // Xử lý khi xoá người dùng thành công
    useEffect(() => {
        if (dataDelete?.status == "success") {
            setIsModalOpenDelete(false);
            Message.success(dataDelete?.message);
        } else if (dataDelete?.status == "error") {
            Message.error(dataDelete?.message);
            setIsModalOpenDelete(false);
        }
    }, [dataDelete]);
    // Xử lý khi cập nhật người dùng thành công
    useEffect(() => {
        if (dataUpdate?.status == "success") {
            setIsOpenDrawer(false);
            Message.success(dataUpdate?.message);
        } else if (dataUpdate?.status == "error") {
            Message.error(dataUpdate?.message);
        }
    }, [dataUpdate]);
    // Xử lý khi xoá tất cả người dùng thành công
    useEffect(() => {
        if (dataDeleteMany?.status == "success") {
            setSelectedRowKeys([]);
            Message.success(dataDeleteMany?.message);
            setIsModalOpenDeleteMany(false);
        } else if (dataDeleteMany?.status == "error") {
            Message.error(dataDeleteMany?.message);
        }
    }, [dataDeleteMany]);

    const { data: dataPatient, isLoading } = queryGetAllPatients;
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
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Xóa
                    </Button>
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
    const hasName = dataPatient?.some((item) => item.name);
    const hasPhone = dataPatient?.some((item) => item.phone);
    const hasAddress = dataPatient?.some((item) => item.address);
    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            sorter: (a, b) => a.index - b.index,

        },
        hasName && {
            title: "Tên",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name?.length - b.name?.length,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email"),
            sorter: (a, b) => a.email.length - b.email.length,
        },
        hasPhone && {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            ...getColumnSearchProps("phone"),
        },
        hasAddress && {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
            ...getColumnSearchProps("address"),


        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            filters: [
                { text: "Bệnh nhân", value: "Bệnh nhân" },
                { text: "Bác sĩ", value: "Bác sĩ" },
                { text: "Admin", value: "Admin" },
            ],
            onFilter: (value, record) => record.role === value,
        },

        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <ButtonComponent
                        size="small"
                        type="primary"
                        icon={<EditOutlined style={{ fontSize: "15px" }} />}
                        onClick={() => handleEditUser(record.key)}
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
    ].filter(Boolean);
    const convertRole = (role) => {
        switch (role) {
            case "admin":
                return "Admin";
            case "doctor":
                return "Bác sĩ";
            case "patient":
                return "Bệnh nhân";
            default:
                return role;
        }
    };
    const dataTable = dataPatient?.map((item, index) => {
        return {
            key: item._id,
            index: index + 1,
            name: item.name,
            email: item.email,
            phone: item.phone,
            address: item.address,
            role: convertRole(item.role),
        };
    });
    const handleOkDeleteMany = () => {
        mutationDeleteAllPatient.mutate(
            { ids: selectedRowKeys },
            {
                onSettled: () => {
                    queryGetAllPatients.refetch();
                },
            },
        );
    }
    const handleCancelDeleteMany = () => {
        setIsModalOpenDeleteMany(false);
    };
    return (
        <>
            <Flex
                gap="middle"
                align="center"
                justify="space-between"
                style={{ marginBottom: "20px", flexWrap: "wrap" }}
            >
                <Flex
                    gap="middle"
                    style={{
                        flexWrap: "wrap",
                        flex: "1 1 300px", // cho responsive
                        justifyContent: "flex-start",
                    }}
                >
                    <ButtonComponent
                        size="small"
                        disabled={selectedRowKeys.length == 0}
                        icon={<DeleteOutlined />}
                        onClick={() => setIsModalOpenDeleteMany(true)}
                        danger
                        style={{ minWidth: "120px" }}
                    >
                        Xoá tất cả
                    </ButtonComponent>
                </Flex>
                <Flex
                    gap="middle"
                    style={{
                        flexWrap: "wrap",
                        flex: "1 1 300px", // cho responsive
                        justifyContent: "flex-end",
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
            <LoadingComponent size="large" isLoading={isLoading} delay={200}>
                <Table
                    rowSelection={rowSelection}
                    rowKey={"key"}
                    columns={columns}
                    scroll={{ x: "max-content" }} // 👈 thêm dòng này
                    dataSource={dataTable}
                    locale={{ emptyText: "Không có dữ liệu bệnh nhân" }}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        position: ["bottomCenter"],
                        showTotal: (total, range) => `Tổng ${total} bệnh nhân`,
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
            <ModalComponent
                title="Xoá người dùng"
                open={isModalOpenDelete}
                onOk={handleOkDelete}
                onCancel={handleCancelDelete}
                style={{ borderRadius: 0 }}
            >
                <LoadingComponent isLoading={isPendingDelete}>
                    <p>
                        Bạn có chắc chắn muốn <strong>xóa</strong> người dùng
                        này không?
                    </p>
                </LoadingComponent>
            </ModalComponent>
            <ModalComponent
                title="Xoá người dùng"
                open={isModalOpenDeleteMany}
                onOk={handleOkDeleteMany}
                onCancel={handleCancelDeleteMany}
                style={{ borderRadius: 0 }}
            >
                <LoadingComponent isLoading={isPendingDeleteMany}>
                    <p>
                        Bạn có chắc chắn muốn <strong>xóa</strong> nhiều người dùng
                        này không?
                    </p>
                </LoadingComponent>
            </ModalComponent>
            <DrawerComponent
                title="Chi tiết người dùng"
                placement="right"
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
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
                        onFinish={handleOnUpdateUser}
                        autoComplete="off"
                        form={formUpdate}
                    >
                        <Form.Item
                            label="Name"
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
                            <Input name="email" />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số điện thoại!",
                                },
                                {
                                    pattern: /^(\+84|0)(3|5|7|8|9)[0-9]{8}$/,
                                    message:
                                        "Vui lòng nhập số điện thoại hợp lệ!",
                                },
                            ]}
                        >
                            <Input name="phone" />
                        </Form.Item>


                        <Form.Item
                            label="Role"
                            name="role"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn quyền!",
                                },
                            ]}
                        >
                            <Radio.Group name="role">
                                <Radio value={"patient"}>Bệnh nhân</Radio>
                                <Radio value={"doctor"}>Bác sĩ</Radio>
                                <Radio value={"admin"}>Admin</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {/* <Form.Item
              label="Avatar"
              name="avatar"
            >
              <div>
              
                <WarpperUploadFile onChange={handleOnchangeAvatarDetail} maxCount={1}>
                  <Button>Select file</Button>
                </WarpperUploadFile>
                { stateUserDetail?.avatar && 
                  <img 
                    src={stateUserDetail?.avatar} 
                    alt="avatar" 
                    style={{width:'60px',height:'60px',borderRadius:'50%',marginLeft:'10px'}}
                  />
                }
              </div>
              
            </Form.Item> */}

                        <Form.Item
                            label={null}
                            wrapperCol={{ offset: 20, span: 4 }}
                        >
                            <ButtonComponent
                                type="primary"
                                htmlType="submit"
                                size="large"
                            >
                                Cập nhật
                            </ButtonComponent>
                        </Form.Item>
                    </Form>
                </LoadingComponent>
            </DrawerComponent>
        </>
    );
};

export default Patient;
