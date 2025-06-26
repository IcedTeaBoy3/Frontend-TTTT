
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
import * as Message from "../../components/Message/Message";
import { DeleteOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import { useHospitalData } from "../../hooks/useHospitalData";
import { useDoctorData } from "../../hooks/useDoctorData";
import defaultImage from "../../assets/default_image.png";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import * as XLSX from "xlsx";
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
    const typeValue = Form.useWatch('type', formCreate); // hoặc formUpdate
    const typeValueUpdate = Form.useWatch('type', formUpdate);
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

    const { data: doctors, isLoading: isLoadingDoctor } = queryGetAllDoctors;
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
                formData.append("name", values.name);
                formData.append("description", values.description);
                formData.append("address", values.address);
                formData.append("phone", values.phone);
                formData.append("doctors", JSON.stringify(values.doctors || []));;
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
                description: hospital.description,
                address: hospital.address,
                phone: hospital.phone,
                thumbnail: [
                    {
                        uid: "-1",
                        name: hospital.thumbnail,
                        status: "done",
                        url: hospital.thumbnail
                            ? `${import.meta.env.VITE_APP_BACKEND_URL}${hospital.thumbnail}`
                            : defaultImage,
                    },
                ],
                images: hospital.images ? hospital.images.map((image, index) => ({
                    uid: index,
                    name: image,
                    status: "done",
                    url: image
                        ? `${import.meta.env.VITE_APP_BACKEND_URL}${image}`
                        : defaultImage,
                })) : [],
                status: hospital.status,
            });
        }
        setIsDrawerOpen(true);
    };
    const handleOnUpdateHospital = (values) => {
        const formData = new FormData();
        const fileObj = values.thumbnail?.[0]?.originFileObj;
        if (fileObj instanceof File) {
            formData.append('thumbnail', fileObj);
        } else if (values.thumbnail?.[0]?.url) {
            // Nếu thumbnail là URL, không cần thêm vào formData
            const thumbnailUrl = values.thumbnail[0].url;
            const thumbnailName = thumbnailUrl.replace(import.meta.env.VITE_APP_BACKEND_URL, "");
            formData.append('oldThumbnail', thumbnailName);
        } else {
            // Không có ảnh và cũng không dùng ảnh cũ → đã xoá
            formData.append("isThumbnailDeleted", true);
        }

        // Tách ảnh chi tiết thành ảnh cũ và ảnh mới
        const oldImages = [];
        const newImages = [];
        if (values.images && values.images.length > 0) {
            values.images.forEach((file) => {
                if (file.originFileObj instanceof File) {
                    newImages.push(file.originFileObj);
                } else if (file.url) {
                    const imageName = file.url.replace(import.meta.env.VITE_APP_BACKEND_URL, '');
                    oldImages.push(imageName);
                }
            });
        }
        // Gửi ảnh mới
        newImages.forEach((file) => {
            formData.append('images', file); // append nhiều file cùng key 'images'
        });
        // Gửi tên ảnh cũ giữ lại
        formData.append('oldImages', JSON.stringify(oldImages));
        // Các trường còn lại
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("address", values.address);
        formData.append("phone", values.phone);
        formData.append("doctors", JSON.stringify(values.doctors || []));
        formData.append("type", values.type);
        formData.append("status", values.status || "active");
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
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (text) => text.length > 60 ? text.substring(0, 50) + "..." : text,
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
            render: (text) => text.length > 60 ? text.substring(0, 50) + "..." : text,
        },
        {
            title: "SĐT",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Hoạt động", value: "active" },
                { text: "Ngừng hoạt động", value: "inactive" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (text) => (
                <Tag color={text === "active" ? "green" : "red"}>
                    {text === "active" ? "Hoạt động" : "Ngừng hoạt động"}
                </Tag>
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
                fallback={defaultImage} // fallback image if not found
            />
        ),
        address: item.address,
        phone: item.phone,
        description: item.description,
        doctors: item.doctors,
        type: item.type,
        status: item.status
    }));
    const beforeUpload = (file, fileList) => {
        const isImage = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'].includes(file.type);
        if (!isImage) {
            Message.error(`${file.name} không phải là định dạng ảnh hợp lệ.`);
            return Upload.LIST_IGNORE;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            Message.error(`${file.name} vượt quá 2MB.`);
            return Upload.LIST_IGNORE;
        }

        // Số ảnh hiện tại trong form (cộng với file mới)
        const currentImages = formUpdate.getFieldValue('images') || [];
        if (currentImages.length + fileList.length > 5 + currentImages.length) {
            Message.error('Tối đa 5 ảnh chi tiết!');
            return Upload.LIST_IGNORE;
        }

        return true;
    };
    const handleExportExcel = () => {
        // Xuất file Excel
        const dataExport = hospitals?.data.map((item) => ({
            "Tên": item.name,
            "Địa chỉ": item.address,
            "Số điện thoại": item.phone,
            "Loại": item.type === 'hospital' ? 'Bệnh viện' : 'Phòng khám',
            "Mô tả": item.description,
            "Bác sĩ": item.doctors.map((doctor) => doctor.user.name).join(", "),
            "Ảnh đại diện": `${import.meta.env.VITE_APP_BACKEND_URL}${item.thumbnail}`,
            "Ảnh chi tiết": item.images.map((image) => `${import.meta.env.VITE_APP_BACKEND_URL}${image}`).join(", ")
        }))
        const worksheet = XLSX.utils.json_to_sheet(dataExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Hospitals");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "hospitals.xlsx");
    }
    const getDoctorIdsFromNames = (doctorNamesString, allDoctors) => {
        const names = doctorNamesString?.split(",").map(n => n.trim()) || [];
        return names.map(name => {
            const doctor = allDoctors.find(doc => doc.name === name);
            return doctor ? doctor._id : null;
        }).filter(id => id !== null); // Loại bỏ tên không tìm thấy
    };
    const handleExportCSV = () => {
        // Xuất file CSV
        const dataExport = hospitals?.data.map((item) => ({
            "Tên": item.name,
            "Địa chỉ": item.address,
            "Số điện thoại": item.phone,
            "Loại": item.type === 'hospital' ? 'Bệnh viện' : 'Phòng khám',
            "Mô tả": item.description,
            "Bác sĩ": item.doctors.map((doctor) => doctor.user.name).join(", "),
            "Ảnh đại diện": `${import.meta.env.VITE_APP_BACKEND_URL}${item.thumbnail}`,
            "Ảnh chi tiết": item.images.map((image) => `${import.meta.env.VITE_APP_BACKEND_URL}${image}`).join(", ")
        }))
        const csv = Papa.unparse(dataExport);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "hospitals.csv");

    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const normalizeUploadPath = (url = "") => {
            const index = url.indexOf("/uploads/");
            return index !== -1 ? url.slice(index) : url;
        };

        if (fileType === "csv") {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const hospitals = results.data.map((item) => ({
                        name: item["Tên"],
                        address: item["Địa chỉ"],
                        phone: item["Số điện thoại"],
                        type: item["Loại"] === "Bệnh viện" ? "hospital" : "clinic",
                        description: item["Mô tả"],
                        doctors: getDoctorIdsFromNames(item["Bác sĩ"], doctors?.data || []),
                        thumbnail: normalizeUploadPath(item["Ảnh đại diện"]),
                        images: item["Ảnh chi tiết"]
                            ? item["Ảnh chi tiết"].split(",").map(url => normalizeUploadPath(url.trim()))
                            : [],
                    }));

                    Message.success("Đã nhập dữ liệu từ file CSV thành công!");
                    // mutationInsertManyHospitals.mutate({ hospitals }); // nếu cần gửi lên
                },
                error: (error) => {
                    Message.error(`Lỗi khi đọc file CSV: ${error.message}`);
                }
            });
        } else if (fileType === "excel") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const hospitals = jsonData.map((item) => ({
                    name: item["Tên"],
                    address: item["Địa chỉ"],
                    phone: item["Số điện thoại"],
                    type: item["Loại"] === "Bệnh viện" ? "hospital" : "clinic",
                    description: item["Mô tả"],
                    doctors: getDoctorIdsFromNames(item["Bác sĩ"], doctors?.data || []),
                    thumbnail: normalizeUploadPath(item["Ảnh đại diện"]),
                    images: item["Ảnh chi tiết"]
                        ? item["Ảnh chi tiết"].split(",").map(url => normalizeUploadPath(url.trim()))
                        : [],
                }));

                console.log("✅ Hospitals từ Excel:", hospitals);
                Message.success("Đã nhập dữ liệu từ file Excel thành công!");
                // mutationInsertManyHospitals.mutate({ hospitals });
            };
            reader.readAsArrayBuffer(file);
        }

        setFileType(null); // Reset fileType sau khi xử lý
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
                    title={typeValue === 'hospital' ? "Thêm bệnh viện" : "Thêm phòng khám"}
                    open={isModalOpenCreate}
                    onOk={handleAddHospital}
                    onCancel={handleCloseAddSpecialty}
                    width={600}
                    style={{ borderRadius: 0 }}
                    okText="Thêm"
                    cancelText="Hủy"
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
                                onChange={(e) => {
                                    formCreate.setFieldsValue({ type: e.target.value });
                                }}
                            >
                                <Radio value="hospital" >Bệnh viện</Radio>
                                <Radio value="clinic">Phòng khám</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {typeValue === 'hospital' && (
                            <>
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


                            </>
                        )}
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
                            label="Ảnh thumbnail"
                            name="thumbnail"
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                                Array.isArray(e) ? e : e?.fileList
                            }
                            extra="Chỉ hỗ trợ định dạng .jpg, .jpeg, .png, .gif, .webp,Kích thước không quá 2MB."
                        >
                            <Upload
                                name="file"
                                beforeUpload={() => false}
                                maxCount={1}
                                accept=".jpg, .jpeg, .png, .gif, .webp"
                                onRemove={() => formCreate.setFieldsValue({ thumbnail: [] })}
                                fileList={formCreate.getFieldValue("thumbnail") || []}
                                listType="picture"
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
                            extra="Chỉ hỗ trợ định dạng .jpg, .jpeg, .png, .gif. .webp Tối đa 5 ảnh. Kích thước mỗi ảnh không quá 2MB."
                        >
                            <Upload
                                name="file"
                                multiple
                                beforeUpload={(file) => {
                                    const isAllowedType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                    if (!isAllowedType) {
                                        Message.error(`${file.name} không phải là định dạng ảnh hợp lệ!`);
                                        return Upload.LIST_IGNORE;
                                    }
                                    if (!isLt2M) {
                                        Message.error(`${file.name} vượt quá 2MB!`);
                                        return Upload.LIST_IGNORE;
                                    }
                                    return false; // Không upload tự động
                                }}
                                maxCount={5}
                                accept=".jpg, .jpeg, .png, .gif, .webp"
                                onChange={({ fileList }) => {
                                    formCreate.setFieldsValue({ images: fileList });
                                }}
                                onRemove={(file) => {
                                    const newFileList = formCreate.getFieldValue('images')?.filter((item) => item.uid !== file.uid);
                                    formCreate.setFieldsValue({ images: newFileList });
                                }}
                                fileList={formCreate.getFieldValue("images") || []}
                                listType="picture"
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
                title={typeValueUpdate === 'hospital' ? "Cập nhật bệnh viện" : "Cập nhật phòng khám"}
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
                        onFinish={handleOnUpdateHospital}
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
                                onChange={(e) => {
                                    formUpdate.setFieldsValue({ type: e.target.value });
                                }}
                            >
                                <Radio value="hospital">Bệnh viện</Radio>
                                <Radio value="clinic">Phòng khám</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {typeValueUpdate === 'hospital' && (
                            <>

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

                            </>
                        )}

                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mô tả!",
                                },
                                {
                                    max: 500,
                                    message: "Mô tả không được quá 500 ký tự!",
                                }
                            ]}
                        >
                            <Input.TextArea
                                name="description"
                                rows={4}
                                placeholder="Nhập mô tả chi tiết tại đây..."
                                maxLength={500}
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
                                {
                                    max: 500,
                                    message: "Địa chỉ không được quá 500 ký tự!",
                                }
                            ]}
                        >
                            <Input.TextArea
                                name="address"
                                rows={4}
                                placeholder="Nhập địa chỉ chi tiết tại đây..."
                                maxLength={500}
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
                            label="Ảnh thumbnail"
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
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                listType="picture"
                                onRemove={() => formUpdate.setFieldsValue({ thumbnail: [] })}
                                fileList={formUpdate.getFieldValue("thumbnail") || []}
                                onChange={({ fileList }) => {
                                    formUpdate.setFieldsValue({ thumbnail: fileList });
                                }}
                            >
                                <ButtonComponent icon={<UploadOutlined />}>
                                    Chọn file
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
                        >
                            <Upload
                                name="file"
                                multiple
                                beforeUpload={beforeUpload}
                                accept=".jpg, .jpeg, .png, .gif, .webp"
                                listType="picture"
                                onChange={({ fileList }) => {
                                    formUpdate.setFieldsValue({ images: fileList });
                                }}
                                onRemove={(file) => {
                                    const newFileList = formUpdate.getFieldValue('images')?.filter((item) => item.uid !== file.uid);
                                    formUpdate.setFieldsValue({ images: newFileList });
                                }}
                            >
                                <ButtonComponent icon={<UploadOutlined />}>
                                    Chọn file
                                </ButtonComponent>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                        >
                            <Radio.Group>

                                <Radio value="active">Hoạt động</Radio>
                                <Radio value="inactive">Ngừng hoạt động</Radio>
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
