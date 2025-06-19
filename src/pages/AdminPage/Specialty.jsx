
import { useState, useRef } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import {
    DeleteOutlined,
    UploadOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Form, Input, Upload, Table, Space, Image, Tag, Radio } from "antd";
import { useSpecialtyData } from "../../hooks/useSpecialtyData";
import ActionButtonGroup from "../../components/ActionButtonGroup/ActionButtonGroup";
import { saveAs } from "file-saver";
import defaultImage from "../../assets/default_image.png";
import Papa from "papaparse";
import * as XLSX from "xlsx";
const Specialty = () => {
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
    // Tìm kiếm
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: "checkbox",
    };

    const {
        queryGetAllSpecialties,
        mutationCreateSpecialty,
        mutationDeleteSpecialty,
        mutationUpdateSpecialty,
        mutationDeleteManySpecialties,
        mutationInsertManySpecialties,
    } = useSpecialtyData({
        setIsModalOpenCreate,
        setIsDrawerOpen,
        setIsModalOpenDeleteMany,
        setIsModalOpenDelete,
        setSelectedRowKeys,
        setRowSelected,
    });
    const { data: specialties, isLoading } = queryGetAllSpecialties;
    const { isPending: isPedingAdd } = mutationCreateSpecialty;
    const { isPending: isPendingDelete } = mutationDeleteSpecialty;
    const { isPending: isPendingUpdate } = mutationUpdateSpecialty;
    const { isPending: isPendingDeleteMany } = mutationDeleteManySpecialties;
    const { isPending: isPendingInsertMany } = mutationInsertManySpecialties;


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
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text) => (
                text === "active" ? (
                    <Tag
                        color="green"
                        style={{ borderRadius: "8px", padding: "0 8px" }}
                    >
                        Hoạt động
                    </Tag>
                ) : (
                    <Tag
                        color="red"
                        style={{ borderRadius: "8px", padding: "0 8px" }}
                    >
                        Không hoạt động
                    </Tag>
                )
            ),
            filters: [
                { text: "Hoạt động", value: "active" },
                { text: "Không hoạt động", value: "inactive" },
            ],
            onFilter: (value, record) => record.status.startsWith(value),
            filterMultiple: false,
        },

        {
            title: "Hành động",
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
    const dataTable = specialties?.data.map((item, index) => {
        return {
            key: item._id,
            index: index + 1,
            name: item.name,
            description: item.description,
            status: item.status,
            image: (
                <Image
                    src={`${import.meta.env.VITE_APP_BACKEND_URL}${item.image}`}
                    alt={item.name}
                    width={50}
                    height={50}
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                    fallback={defaultImage}
                />
            ),
        };
    });
    const handleAddSpecialty = () => {
        formCreate.validateFields().then((values) => {
            //  values.image là mảng file (do maxCount=1 thì vẫn là mảng 1 phần tử)
            const fileList = values.image;
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("image", fileList?.[0]?.originFileObj);

            mutationCreateSpecialty.mutate(formData);
        });
    };
    const handleOkDelete = () => {
        mutationDeleteSpecialty.mutate({ id: rowSelected });
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleOkDeleteMany = () => {
        mutationDeleteManySpecialties.mutate({ ids: selectedRowKeys });
    }
    const handleCancelDeleteMany = () => {
        setIsModalOpenDeleteMany(false);
    };
    const handleOnUpdateSpecialty = (values) => {
        const formData = new FormData();
        const fileObj = values.image?.[0]?.originFileObj;
        if (fileObj instanceof File) {
            // Nếu có file mới
            formData.append("image", fileObj);
        } else if (values.image?.[0]?.url) {
            // Nếu không có file mới, nhưng có URL thì giữ nguyên
            const imageUrl = values.image[0].url;
            const imageName = imageUrl.replace(import.meta.env.VITE_APP_BACKEND_URL, ""); // Lấy lại phần tên file
            formData.append("oldImage", imageName);
        } else {
            // Không có ảnh và cũng không dùng ảnh cũ → đã xoá
            formData.append("isImageDeleted", true);
        }
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("status", values.status);
        mutationUpdateSpecialty.mutate({ id: rowSelected, formData });
    };
    const handleEditSpecialty = async (id) => {
        const specialty = specialties?.data.find((item) => item._id === id);
        formUpdate.setFieldsValue({
            name: specialty?.name,
            description: specialty?.description,
            image: [
                {
                    uid: "-1",
                    name: specialty?.image,
                    status: "done",
                    url: specialty?.image ? `${import.meta.env.VITE_APP_BACKEND_URL}${specialty.image}` : defaultImage,
                },
            ],
            status: specialty?.status,
        });
        setIsDrawerOpen(true);
    };
    const handleCloseAddSpecialty = () => {
        setIsModalOpenCreate(false);
    };

    const handleExportExcel = () => {
        // // Xuất file Excel
        const dataExport = specialties?.data.map((item) => ({
            "Tên chuyên khoa": item.name,
            "Mô tả": item.description,
            "Hình ảnh": `${import.meta.env.VITE_APP_BACKEND_URL}${item.image}`,
        }))
        const worksheet = XLSX.utils.json_to_sheet(dataExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Specialties");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "specialties.xlsx");

    }
    const handleExportCSV = () => {
        // Xuất file CSV
        const dataExport = specialties?.data.map((item) => ({
            "Tên chuyên khoa": item.name,
            "Mô tả": item.description,
            "Hình ảnh": `${import.meta.env.VITE_APP_BACKEND_URL}${item.image}`,
        }));
        const csv = Papa.unparse(dataExport);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "specialties.csv");
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isExcel = fileType === "excel";
        const reader = new FileReader();

        const normalizeImagePath = (path = "") => {
            const index = path.indexOf("/uploads/");
            return index !== -1 ? path.slice(index) : path;
        };

        reader.onload = async (evt) => {
            const data = evt.target.result;
            let jsonData = [];
            const workbook = XLSX.read(data, { type: isExcel ? "binary" : "string" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            jsonData = XLSX.utils.sheet_to_json(sheet);

            const specialties = jsonData.map((item) => ({
                name: item["Tên chuyên khoa"],
                description: item["Mô tả"],
                image: normalizeImagePath(item["Hình ảnh"]),
            }));

            mutationInsertManySpecialties.mutate({ specialties });
        };

        if (isExcel) reader.readAsBinaryString(file);
        else reader.readAsText(file);

        e.target.value = ""; // reset input
    };

    const handleChooseFile = (type) => {
        setFileType(type);
        setTimeout(() => {
            fileInputRef.current?.click(); // mở input file ẩn
        }, 0);
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

            </ActionButtonGroup >
            <LoadingComponent isLoading={isLoading || isPendingInsertMany} delay={200}>
                <Table
                    rowSelection={rowSelection}
                    rowKey={"key"}
                    columns={columns}
                    scroll={{ x: "max-content" }}
                    dataSource={dataTable}
                    locale={{ emptyText: "Không có dữ liệu bệnh nhân" }}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        position: ["bottomCenter"],
                        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} chuyên khoa`,
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
            <LoadingComponent isLoading={isPedingAdd}>
                <ModalComponent
                    title="Thêm mới chuyên khoa"
                    open={isModalOpenCreate}
                    onOk={handleAddSpecialty}
                    onCancel={handleCloseAddSpecialty}
                    width={600}
                    cancelText="Huỷ"
                    okText="Thêm"
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
                            extra="Chọn ảnh chuyên khoa (jpg, jpeg, png, gif, webp) tối đa 1 file"
                        >


                            <Upload
                                name="file"
                                beforeUpload={() => false}
                                maxCount={1}
                                accept=".jpg, .jpeg, .png, .gif, .webps"
                                onRemove={() => formCreate.setFieldsValue({ image: [] })}
                                fileList={formCreate.getFieldValue("image") || []}
                                listType="picture"
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
                width={window.innerWidth < 768 ? "100%" : 700}
                forceRender
            >
                <LoadingComponent isLoading={isPendingUpdate}>
                    <Form
                        name="formUpdate"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 600, padding: "20px" }}
                        onFinish={handleOnUpdateSpecialty}
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
                            extra="Chọn ảnh chuyên khoa (jpg, jpeg, png, gif, webp) tối đa 1 file"
                        >
                            <Upload
                                name="file"
                                beforeUpload={() => false}
                                maxCount={1}
                                accept=".jpg, .jpeg, .png, .gif, .webp"
                                onRemove={() => formUpdate.setFieldsValue({ image: [] })}
                                fileList={formUpdate.getFieldValue("image") || []}
                                listType="picture"
                            >
                                <ButtonComponent icon={<UploadOutlined />}>
                                    Chọn file
                                </ButtonComponent>
                            </Upload>

                        </Form.Item>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn trạng thái!",
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio value="active">Hoạt động</Radio>
                                <Radio value="inactive">Không hoạt động</Radio>
                            </Radio.Group>

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
        </>
    );
};

export default Specialty;
