
import { Space, Table, Input, Button, Form, Select, Radio, Typography } from "antd";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import {
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { useState, useRef } from "react";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import { usePatientData } from "../../hooks/usePatientData";
import ActionButtonGroup from "../../components/ActionButtonGroup/ActionButtonGroup";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import * as XLSX from "xlsx";
const { Option } = Select;
const { Text, Paragraph } = Typography;
import ethnicGroups from "../../data/ethnicGroups"; // Giả sử bạn đã có file ethnicGroups.js chứa dữ liệu dân tộc
import { data } from "react-router-dom";
const Patient = () => {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
    const [rowSelected, setRowSelected] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [formUpdate] = Form.useForm();
    const fileInputRef = useRef(null);
    const [fileType, setFileType] = useState(null); // "csv" hoặc "excel"
    // Tìm kiếm
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    // Phân trang
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

    const {
        queryGetAllPatients,
        mutationDeletePatient,
        mutationUpdatePatient,
        mutationDeleteAllPatient,
        mutationInsertManyPatient,
    } = usePatientData({
        setIsOpenDrawer,
        setSelectedRowKeys,
        setRowSelected,
        setIsModalOpenDeleteMany,
        setIsModalOpenDelete,
    })
    // Lấy dữ liệu bệnh nhân
    const { data: dataPatient, isLoading } = queryGetAllPatients;
    const { isPending: isPendingUpdate } = mutationUpdatePatient;
    const { isPending: isPendingDelete } = mutationDeletePatient;
    const { isPending: isPendingDeleteMany } = mutationDeleteAllPatient;
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
    const handleEditUser = (id) => {
        const user = dataPatient?.data?.find((item) => item._id === id);
        if (user) {
            setRowSelected(id);
            setIsOpenDrawer(true);
            formUpdate.setFieldsValue({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : null,
                gender: user.gender
            });
        }
    };
    const handleOnUpdateUser = async (values) => {
        mutationUpdatePatient.mutate(
            {
                id: rowSelected,
                name: values.name,
                email: values.email,
                phone: values.phone,
                address: values.address,
                dateOfBirth: values.dateOfBirth,
                gender: values.gender,
            },
        );
    };
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
    const hasName = dataPatient?.data?.some((item) => item.name);
    const hasPhone = dataPatient?.data?.some((item) => item.phone);
    const hasAddress = dataPatient?.data?.some((item) => item.address);
    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            sorter: (a, b) => a.index - b.index,

        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email"),
        },
        hasName && {
            title: "Tên",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name?.length - b.name?.length,
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
            render: (address) => {
                return address ? (
                    <Paragraph
                        ellipsis={{ rows: 2, expandable: true, symbol: "Xem thêm" }}
                        title={address}
                    >
                        {address}
                    </Paragraph>
                ) : (
                    <Text type="secondary">Chưa cập nhật</Text>
                );
            }

        },
        {
            title: "Ngày sinh",
            dataIndex: "dateOfBirth",
            key: "dateOfBirth",
            render: (date) => {
                return date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa cập nhật";
            },
        },
        {
            title: "Giới tính",
            dataIndex: 'gender',
            key: "dateOfBirth",
            render: (gender) => {
                switch (gender) {
                    case "male":
                        return "Nam";
                    case "female":
                        return "Nữ";
                    case "other":
                        return "Khác";
                    default:
                        return "Chưa cập nhật";
                }
            },
            filters: [
                { text: "Nam", value: "male" },
                { text: "Nữ", value: "female" },
                { text: "Khác", value: "other" },
            ],
            onFilter: (value, record) => record.gender.includes(value),

        },
        {
            title: "Dân tộc",
            dataIndex: "ethnic",
            key: "ethnic",

        },
        {
            title: "CMND/CCCD",
            dataIndex: "idCard",
            key: "idCard",
            render: (idCard) => {
                return idCard ? (
                    <Text>{idCard}</Text>
                ) : (
                    <Text type="secondary">Chưa cập nhật</Text>
                );
            }
        },
        {
            title: "Mã thẻ BHYT",
            dataIndex: "insuranceCode",
            key: "insuranceCode",
            render: (insuranceCode) => {
                return insuranceCode ? (
                    <Text>{insuranceCode}</Text>
                ) : (
                    <Text type="secondary">Chưa cập nhật</Text>
                );
            }
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

    const dataTable = dataPatient?.data?.map((item, index) => {
        return {
            key: item._id,
            index: index + 1,
            name: item.name,
            email: item.email,
            phone: item.phone,
            address: item.address,
            dateOfBirth: item.dateOfBirth,
            gender: item.gender,
            ethnic: item.ethnic,
            idCard: item.idCard,
            insuranceCode: item.insuranceCode,
            job: item.job,
        };
    });
    const handleOkDeleteMany = () => {
        mutationDeleteAllPatient.mutate(
            { ids: selectedRowKeys },
        );
    }
    const handleCancelDeleteMany = () => {
        setIsModalOpenDeleteMany(false);
    };
    const handleExportCSV = () => {
        // Xuất file CSV
        const dataExport = dataPatient?.data?.map((item) => ({
            name: item.name,
            email: item.email,
            password: item.password, // Thêm trường password nếu cần
            phone: item.phone,
            address: item.address,
            isVerified: item.isVerified,
            dateOfBirth: item.dateOfBirth,
            gender: item.gender,
            ethnic: item.ethnic,
            idCard: item.idCard,
            insuranceCode: item.insuranceCode,
            job: item.job,
        }));
        const csv = Papa.unparse(dataExport);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "users.csv");
    };
    const handleExportExcel = () => {
        // Xuất file Excel
        const dataExport = dataPatient?.data?.map((item) => ({
            name: item.name,
            email: item.email,
            password: item.password, // Thêm trường password nếu cần
            phone: item.phone,
            address: item.address,
            isVerified: item.isVerified,
            dateOfBirth: item.dateOfBirth,
            gender: item.gender,
            ethnic: item.ethnic,
            idCard: item.idCard,
            insuranceCode: item.insuranceCode,
            job: item.job,
        }))
        const worksheet = XLSX.utils.json_to_sheet(dataExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "users.xlsx");
    };
    const handleChooseFile = (type) => {
        setFileType(type);
        setTimeout(() => {
            fileInputRef.current?.click(); // mở input file ẩn
        }, 0);
    };
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isExcel = fileType === "excel";
        const reader = new FileReader();

        reader.onload = async (evt) => {
            const data = evt.target.result;
            let jsonData = [];
            const workbook = XLSX.read(data, { type: isExcel ? "binary" : "string" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            jsonData = XLSX.utils.sheet_to_json(sheet);
            mutationInsertManyPatient.mutate(jsonData);
        };
        if (isExcel) reader.readAsBinaryString(file);
        else reader.readAsText(file);

        e.target.value = ""; // reset input
    };

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
            >

            </ActionButtonGroup>

            <LoadingComponent isLoading={isLoading} delay={200}>
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
                        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} bệnh nhân`,
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
                            label="Tên"
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
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số điện thoại!",
                                },
                                {
                                    pattern: /^(\+84|0)(3|5|7|8|9)[0-9]{8}$/,
                                    message: "Vui lòng nhập số điện thoại hợp lệ!",
                                },
                            ]}
                        >
                            <Input name="phone" />
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
                            <Input.TextArea name="address" rows={4} />
                        </Form.Item>

                        <Form.Item
                            label="Ngày sinh"
                            name="dateOfBirth"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn ngày sinh!",
                                },
                            ]}
                        >
                            <Input
                                type="date"
                                name="dateOfBirth"
                                style={{ width: "100%" }}
                            />

                        </Form.Item>
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn giới tính!",
                                },
                            ]}
                        >
                            <Radio.Group name="gender">
                                <Radio value="male">Nam</Radio>
                                <Radio value="female">Nữ</Radio>
                                <Radio value="other">Khác</Radio>
                            </Radio.Group>
                        </Form.Item>



                        <Form.Item
                            label={null}
                            wrapperCol={{ offset: 17, span: 7 }}
                        >
                            <Space>

                                <ButtonComponent
                                    type="default"
                                    onClick={() => setIsOpenDrawer(false)}
                                >
                                    Hủy
                                </ButtonComponent>
                                <ButtonComponent
                                    type="primary"
                                    htmlType="submit"

                                >
                                    Cập nhật
                                </ButtonComponent>
                            </Space>

                        </Form.Item>
                    </Form>
                </LoadingComponent>
            </DrawerComponent>
        </>
    );
};

export default Patient;
