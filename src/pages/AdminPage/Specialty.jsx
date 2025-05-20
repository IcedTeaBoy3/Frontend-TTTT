import React from "react";
import { useState, useRef } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import {
    DeleteOutlined,
    PlusCircleFilled,
    ExportOutlined,
    ImportOutlined,
    UploadOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import * as Message from "../../components/Message/Message";
import { Flex, Form, Input, Upload, Table, Space, Pagination } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as SpecialtyService from "../../services/SpecialtyService";
const Specialty = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rowSelected, setRowSelected] = useState(null);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [formCreate] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
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
    const mutationAddSpecialty = useMutation({
        mutationFn: SpecialtyService.createSpecialty,
        onSuccess: (data) => {
            if (data?.status == "success") {
                Message.success(data.message);
                setIsOpenAdd(false);
                formCreate.resetFields();
            }
            else {
                Message.error(data.message);
            }
        },
        onError: (error) => {
            Message.error(error.message);
        },
    });
    const mutationDeleteSpecialty = useMutation({
        mutationFn: SpecialtyService.deleteSpecialty,
        onSuccess: (data) => {
            if (data?.status == "success") {
                Message.success(data.message);
                setIsModalOpenDelete(false);
            }
            else {
                Message.error(data.message);
            }
        },
        onError: (error) => {
            Message.error(error.message);
        },
    });
    const mutaionUpdateSpecialty = useMutation({
        mutationFn: async ({ id, formData }) => {
            return await SpecialtyService.updateSpecialty(id, formData);
        },
        onSuccess: (data) => {
            if (data?.status == "success") {
                Message.success(data.message);
                setIsDrawerOpen(false);
            }
            else {
                Message.error(data.message);
            }
        },
        onError: (error) => {
            Message.error(error.message);
        },
    });
    const mutationDeleteManySpecialties = useMutation({
        mutationFn: SpecialtyService.deleteManySpecialties,
        onSuccess: (data) => {
            if (data?.status == "success") {

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
    const queryGetAllSpecialties = useQuery({
        queryKey: ["getAllSpecialties", pagination],
        queryFn: () =>
            SpecialtyService.getAllSpecialties(
                pagination.current,
                pagination.pageSize,
            ),
        keepPreviousData: true,
    });
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
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
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
            title: "Tên chuyên khoa",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (text) => text.length > 60 ? text.substring(0, 50) + "..." : text,
        },
        {
            title: "Hình ảnh",
            dataIndex: "image",
            key: "image",
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
                        onClick={() => handleEditSpecialty(record.key)}
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
    const { data: specialties, isLoading } = queryGetAllSpecialties;
    pagination.total = specialties?.total || 0;
    const dataTable = specialties?.data.map((item, index) => {
        return {
            key: item._id,
            index: index + 1,
            name: item.name,
            description: item.description,
            image: (
                <img
                    src={`${import.meta.env.VITE_APP_BACKEND_URL}${item.image}`}
                    alt={item.name}
                    style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "5px",
                    }}
                />
            ),
        };
    });

    const { isPending: isPedingAdd } = mutationAddSpecialty;
    const { isPending: isPendingDelete } = mutationDeleteSpecialty;
    const { isPending: isPendingUpdate } = mutaionUpdateSpecialty;
    const { isPending: isPendingDeleteMany } = mutationDeleteManySpecialties;
    const handleAddSpecialty = () => {
        formCreate.validateFields().then((values) => {
            //  values.image là mảng file (do maxCount=1 thì vẫn là mảng 1 phần tử)
            const fileList = values?.image;
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("image", fileList?.[0]?.originFileObj); // originFileObj mới là File thực tế
            console.log(fileList?.[0]?.originFileObj);

            mutationAddSpecialty.mutate(formData, {
                onSettled: () => {
                    queryGetAllSpecialties.refetch();
                },
            });
        });
    };
    const handleOkDelete = () => {
        mutationDeleteSpecialty.mutate(
            { id: rowSelected },
            {
                onSettled: () => {
                    queryGetAllSpecialties.refetch();
                },
            },
        );
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleOkDeleteMany = () => {
        mutationDeleteManySpecialties.mutate(
            { ids: selectedRowKeys },
            {
                onSettled: () => {
                    queryGetAllSpecialties.refetch();
                },
            },
        );
    }
    const handleCancelDeleteMany = () => {
        setIsModalOpenDeleteMany(false);
    };
    const handleOnUpdateUser = (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);

        const fileObj = values.image?.[0]?.originFileObj;

        // Nếu là file mới (user vừa chọn ảnh), thì mới append
        if (fileObj instanceof File) {
            formData.append("image", fileObj);
        }

        mutaionUpdateSpecialty.mutate(
            { id: rowSelected, formData },
            {
                onSettled: () => {
                    queryGetAllSpecialties.refetch();
                },
            },
        );
    };

    const handleEditSpecialty = async (id) => {
        const res = await SpecialtyService.getSpecialty(id);
        if (res?.status == "error") {
            Message.error(res?.message);
            return;
        }
        formUpdate.setFieldsValue({
            name: res?.data?.name,
            description: res?.data?.description,
            image: [
                {
                    uid: "-1",
                    name: res?.data?.image,
                    status: "done",
                    url: `${import.meta.env.VITE_APP_BACKEND_URL}${res?.data?.image}`,
                },
            ],
        });
        setIsDrawerOpen(true);
    };

    const handleCloseAddSpecialty = () => {
        setIsOpenAdd(false);
    };
    const handleChangePage = (page, pageSize) => {
        setPagination({
            current: page,
            pageSize: pageSize,
        });
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
                    <ButtonComponent
                        size="small"
                        icon={<PlusCircleFilled></PlusCircleFilled>}
                        type="primary"
                        onClick={() => setIsOpenAdd(true)}
                        style={{ minWidth: "120px" }}
                    >
                        Thêm mới
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
            <LoadingComponent isLoading={isLoading} delay={200}>
                <Table
                    rowSelection={rowSelection}
                    rowKey={"key"}
                    columns={columns}
                    scroll={{ x: "max-content" }}
                    dataSource={dataTable}
                    locale={{ emptyText: "Không có dữ liệu bệnh nhân" }}
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
                    defaultPageSize={pagination.pageSize}
                    onChange={handleChangePage}
                    showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`
                    }
                />
            </LoadingComponent>
            <LoadingComponent isLoading={isPedingAdd}>
                <ModalComponent
                    title="Thêm mới chuyên khoa"
                    open={isOpenAdd}
                    onOk={handleAddSpecialty}
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
                            label="Tên chuyên khoa"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên!",
                                },
                            ]}
                        >
                            <Input
                                name="name"
                                placeholder="Nhập vào tên chuyên khoa"
                            />
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
                    </Form>
                </ModalComponent>
            </LoadingComponent>
            <ModalComponent
                title="Xoá chuyên khoa"
                open={isModalOpenDelete}
                onOk={handleOkDelete}
                onCancel={handleCancelDelete}
                style={{ borderRadius: 0 }}
            >
                <LoadingComponent isLoading={isPendingDelete}>
                    <p>
                        Bạn có chắc chắn muốn <strong>xóa</strong> chuyên khoa
                        này không?
                    </p>
                </LoadingComponent>
            </ModalComponent>
            <ModalComponent
                title="Xoá chuyên khoa"
                open={isModalOpenDeleteMany}
                onOk={handleOkDeleteMany}
                onCancel={handleCancelDeleteMany}
                style={{ borderRadius: 0 }}
            >
                <LoadingComponent isLoading={isPendingDeleteMany}>
                    <p>
                        Bạn có chắc chắn muốn <strong>xóa</strong> nhiều chuyên khoa
                        này không?
                    </p>
                </LoadingComponent>
            </ModalComponent>
            <DrawerComponent
                title="Chi tiết chuyên khoa"
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
                        onFinish={handleOnUpdateUser}
                        autoComplete="off"
                        form={formUpdate}
                    >
                        <Form.Item
                            label="Tên chuyên khoa"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên chuyên khoa!",
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
                            <Flex gap="middle">
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
                            </Flex>
                        </Form.Item>
                    </Form>
                </LoadingComponent>
            </DrawerComponent>
        </>
    );
};

export default Specialty;
