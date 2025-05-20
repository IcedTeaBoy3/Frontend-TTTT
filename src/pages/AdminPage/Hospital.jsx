import React from "react";
import { Flex, Form, Input, Upload, Table, Space, Pagination, Button } from "antd";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import {
    PlusCircleFilled,
    ExportOutlined,
    ImportOutlined,
    UploadOutlined,
    EditOutlined,
    SearchOutlined
} from "@ant-design/icons";
import * as Message from "../../components/Message/Message";
import { DeleteOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import * as HospitalService from "../../services/HospitalService";
import { useMutation, useQuery } from "@tanstack/react-query";
const Hospital = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
    const [rowSelected, setRowSelected] = useState(null);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [formUpdate] = Form.useForm();
    const [formCreate] = Form.useForm();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: "checkbox",
    };
    const mutationAddHospital = useMutation({
        mutationFn: HospitalService.createHospital,
        onSuccess: (data) => {
            if (data.status === "success") {
                Message.success(data.message);
                setIsOpenAdd(false);
                formCreate.resetFields();
            } else {
                Message.error(data.message);
            }
        },
        onError: (error) => {
            Message.error(error.message);
        },
    });
    const mutationUpdateHospital = useMutation({
        mutationFn: (data) => {
            const { id, formData } = data;
            return HospitalService.updateHospital(id, formData);
        },
        onSuccess: (data) => {
            if (data.status === "success") {
                Message.success(data.message);
                setIsDrawerOpen(false);
                formUpdate.resetFields();
            } else {
                Message.error(data.message);
            }
        },
        onError: (error) => {
            Message.error(error.message);
        },
    });
    const mutationDeleteHospital = useMutation({
        mutationFn: HospitalService.deleteHospital,
        onSuccess: (data) => {
            if (data.status === "success") {
                setIsModalOpenDelete(false);
                Message.success(data.message);
            } else {
                Message.error(data.message);
            }
        },
        onError: (error) => {
            Message.error(error.message);
        },
    });
    const mutationDeleteManyHospital = useMutation({
        mutationFn: HospitalService.deleteManyHospitals,
        onSuccess: (data) => {
            if (data.status === "success") {
                setSelectedRowKeys([]);
                Message.success(data.message);
                setIsModalOpenDeleteMany(false);
            } else {
                Message.error(data.message);
            }
        },
        onError: (error) => {
            Message.error(error.message);
        },
    });
    const queryGetAllHospitals = useQuery({
        queryKey: ["getAllHospitals", pagination],
        queryFn: () =>
            HospitalService.getAllHospitals(
                pagination.current,
                pagination.pageSize,
            ),
        keepPreviousData: true,
    });
    const { data: hospitals, isLoading } = queryGetAllHospitals;
    const { isPending: isPendingAdd } = mutationAddHospital;
    const { isPending: isPendingUpdate } = mutationUpdateHospital;
    const { isPending: isPendingDelete } = mutationDeleteHospital;
    const { isPending: isPendingDeleteMany } = mutationDeleteManyHospital;

    const handleAddHospital = () => {
        formCreate
            .validateFields()
            .then((values) => {
                console.log("values", values);
                // Call API to add hospital
                // Reset form and close modal
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("description", values.description);
                formData.append("address", values.address);
                formData.append("phone", values.phone);
                formData.append("image", values?.image?.[0]?.originFileObj);
                mutationAddHospital.mutate(formData, {
                    onSettled: () => {
                        queryGetAllHospitals.refetch();
                    },
                });
                setIsOpenAdd(false);
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
                description: hospital.description,
                address: hospital.address,
                phone: hospital.phone,
                image: [
                    {
                        uid: "-1",
                        name: hospital.image,
                        status: "done",
                        url: `${import.meta.env.VITE_APP_BACKEND_URL}${hospital.image}`,
                    },
                ],
            });
        }
        setIsDrawerOpen(true);
    };
    const handleOnUpdateHospital = (values) => {
        console.log("values", values);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("address", values.address);
        formData.append("phone", values.phone);
        const fileObj = values.image?.[0]?.originFileObj;

        // Nếu là file mới (user vừa chọn ảnh), thì mới append
        if (fileObj instanceof File) {
            formData.append("image", fileObj);
        }
        mutationUpdateHospital.mutate(
            {
                id: rowSelected,
                formData,
            },
            {
                onSettled: () => {
                    queryGetAllHospitals.refetch();
                },
            },
        );
    };
    const handleCloseAddSpecialty = () => {
        setIsOpenAdd(false);
        formCreate.resetFields();
    };
    const handleOkDelete = () => {
        mutationDeleteHospital.mutate(rowSelected, {
            onSettled: () => {
                queryGetAllHospitals.refetch();
            },
        });
        setIsModalOpenDelete(false);
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
        // setSelectedRowKeys([])
    };
    const handleOkDeleteMany = () => {
        mutationDeleteManyHospital.mutate(
            { ids: selectedRowKeys },
            {
                onSettled: () => {
                    queryGetAllHospitals.refetch();
                },
            },
        );
    }
    const handleCancelDeleteMany = () => {
        setIsModalOpenDeleteMany(false);
    }

    const handleChangePage = (page, pageSize) => {
        setPagination({
            current: page,
            pageSize: pageSize,
        });
    };
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
            title: "Tên bệnh viện",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: "Ảnh",
            dataIndex: "image",
            key: "image",
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
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
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
    pagination.total = hospitals?.total || 0;
    const dataTable = hospitals?.data?.map((item, index) => ({
        key: item._id,
        index: index + 1,
        name: item.name,
        image: (
            <img
                src={`${import.meta.env.VITE_APP_BACKEND_URL}${item.image}`}
                alt={item.name}
                style={{ width: "50px", height: "50px", borderRadius: "5px" }}
            />
        ),
        address: item.address,
        phone: item.phone,
        description: item.description,
    }));
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
            <LoadingComponent isLoading={isLoading} delay={200}>
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
            <LoadingComponent isLoading={isPendingAdd}>
                <ModalComponent
                    title="Thêm mới bệnh viện"
                    open={isOpenAdd}
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
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        form={formCreate}
                    >
                        <Form.Item
                            label="Tên bệnh viện"
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
                            label="Ảnh"
                            name="image"
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                                Array.isArray(e) ? e : e && e.fileList
                            }
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: 'Vui lòng chọn ảnh!',
                        //     },

                        // ]}
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
            </LoadingComponent>
            <DrawerComponent
                title="Chi tiết bệnh viện"
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
                        onFinish={handleOnUpdateHospital}
                        autoComplete="off"
                        form={formUpdate}
                    >
                        <Form.Item
                            label="Tên bệnh viện"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên bệnh viện!",
                                },
                            ]}
                        >
                            <Input name="name" />
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
                            name="image"
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                                Array.isArray(e) ? e : e && e.fileList
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
