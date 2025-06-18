import { Form, Select, DatePicker, TimePicker, Table, Space, Input, Image, Flex } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import ActionButtonGroup from "../../components/ActionButtonGroup/ActionButtonGroup";
import { useWorkingScheduleData } from "../../hooks/useWorkingScheduleData";
import { useDoctorData } from "../../hooks/useDoctorData";
import defaultAvatar from "../../assets/avatar-default-icon.png"
import dayjs from 'dayjs';
import { useState, useRef } from "react";
const WorkingSchedule = () => {
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
    const [rowSelected, setRowSelected] = useState(null);
    const fileInputRef = useRef(null);
    const [fileType, setFileType] = useState(null); // "csv" hoặc "excel"
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    const [formCreate] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const { Option } = Select;
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
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

    const handleReset = (clearFilters, close) => {
        clearFilters();
        setSearchText("");
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: "checkbox",
    };
    const { queryGetAllDoctors } = useDoctorData({});
    const {
        queryGetAllWorkingSchedules,
        mutationCreateWorkingSchedule,
        mutationDeleteWorkingSchedule,
        mutationUpdateWorkingSchedule,
        mutationDeleteManyWorkingSchedules,
    } = useWorkingScheduleData({
        setIsModalOpenCreate,
        setIsDrawerOpen,
        setIsModalOpenDeleteMany,
        setIsModalOpenDelete,
        setSelectedRowKeys,
        setRowSelected,
    })
    const { data: doctors, isLoading: isLoadingDoctors } = queryGetAllDoctors;
    const { data: workingSchedules, isLoading: isLoadingWorkingSchedules } = queryGetAllWorkingSchedules;
    const { isPending: isPendingCreateWorkingSchedule } = mutationCreateWorkingSchedule;
    const { isPending: isPendingDelete } = mutationDeleteWorkingSchedule;
    const { isPending: isPendingUpdate } = mutationUpdateWorkingSchedule;
    const { isPending: isPendingDeleteMany } = mutationDeleteManyWorkingSchedules;
    const handleEditWorkingSchedule = (id) => {
        const workingSchedule = workingSchedules?.data?.find((item) => item._id === id);
        if (workingSchedule) {
            formUpdate.setFieldsValue({
                name: workingSchedule?.doctor?._id,
                date: dayjs(workingSchedule.workDate),
                startTime: dayjs(workingSchedule.startTime, "HH:mm"),
                endTime: dayjs(workingSchedule.endTime, "HH:mm"),
            });
        }
        setIsDrawerOpen(true);
    }
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
            ...getColumnSearchProps("name"),
            render: (_, record) => (
                <Flex gap={8} alignItems="center">

                    <Image
                        src={record.doctor?.image}
                        width={30}
                        height={30}
                        style={{ borderRadius: "50%" }}
                        fallback={defaultAvatar}
                        alt={record.doctor?.user?.name}
                    />
                    <span>{record.doctor?.user?.name}</span>
                </Flex>
            ),
        },
        {
            title: "Ngày làm việc",
            dataIndex: "workDate",
            key: "workDate",
            render: (_, record) => (
                <div>
                    {dayjs(record.workDate).format("DD/MM/YYYY")}
                </div>
            ),
            filters: [
                { text: "Đã qua", value: "past" },
                { text: "Chưa đến", value: "upcoming" },
            ],
            onFilter: (value, record) => {
                const today = new Date();
                const recordDate = new Date(record.workDate);
                // So sánh ngày không tính giờ
                const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const recordMidnight = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());

                if (value === "past") {
                    return recordMidnight < todayMidnight;
                }
                if (value === "upcoming") {
                    return recordMidnight >= todayMidnight;
                }
                return true;
            },
        },
        {
            title: "Thời gian làm việc",
            dataIndex: "workTime",
            key: "workTime",
            render: (_, record) => (
                <div>
                    {dayjs(record.startTime, "HH:mm").format("HH:mm")} - {dayjs(record.endTime, "HH:mm").format("HH:mm")}
                </div>
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
                        onClick={() => handleEditWorkingSchedule(record.key)}
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
    const dataTable = workingSchedules?.data?.map((item, index) => {
        return {
            key: item._id,
            index: index + 1,
            doctor: item.doctor,
            workDate: dayjs(item.workDate),
            startTime: dayjs(item.startTime, "HH:mm").format("HH:mm"),
            endTime: dayjs(item.endTime, "HH:mm").format("HH:mm"),
        }
    })
    const handleAddWorkingSchedule = () => {
        formCreate.validateFields().then(async (values) => {
            const data = {
                doctorId: values.name,
                workDate: values.date.toDate(),
                startTime: values.startTime.format("HH:mm"),
                endTime: values.endTime.format("HH:mm"),
            }
            mutationCreateWorkingSchedule.mutate(data);
        }).catch((error) => {
            console.log(error);
        })
    }
    const handleCloseAddWorkingSchedule = () => {
        setIsModalOpenCreate(false);
    }
    const handleOnUpdateWorkingSchedule = () => {
        formUpdate.validateFields().then(async (values) => {
            const data = {
                id: rowSelected,
                doctor: values.name,
                workDate: values.date.toDate(),
                startTime: values.startTime.format("HH:mm"),
                endTime: values.endTime.format("HH:mm"),
            }
            mutationUpdateWorkingSchedule.mutate(data);
        }).catch((error) => {
            console.log(error);
        })
    }
    const handleOkDelete = () => {
        mutationDeleteWorkingSchedule.mutate(rowSelected);
    }
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleOkDeleteMany = () => {
        mutationDeleteManyWorkingSchedules.mutate(selectedRowKeys);
    }
    const handleCancelDeleteMany = () => {
        setIsModalOpenDeleteMany(false);
        setSelectedRowKeys([]);
    }
    const handleExportCSV = () => { }
    const handleExportExcel = () => { }
    const handleChooseFile = (type) => {

    }
    const handleFileChange = (e) => {

    }

    return (
        <>
            <ActionButtonGroup
                selectedRowKeys={selectedRowKeys}
                dataTable={dataTable}
                onExportCSV={handleExportCSV}
                onExportExcel={handleExportExcel}
                onImportCSV={() => handleExportCSV("csv")}
                onImportExcel={() => handleChooseFile("excel")}
                fileInputRef={fileInputRef}
                fileType={fileType}
                onFileChange={handleFileChange}
                onDeleteMany={() => setIsModalOpenDeleteMany(true)}
                onCreateNew={() => setIsModalOpenCreate(true)}
            >

            </ActionButtonGroup>
            <LoadingComponent isLoading={isLoadingWorkingSchedules} delay={200}>
                <Table
                    rowSelection={rowSelection}
                    rowKey={"key"}
                    columns={columns}
                    scroll={{ x: "max-content" }}
                    dataSource={dataTable}
                    locale={{ emptyText: "Không có dữ liệu lịch làm việc" }}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        position: ["bottomCenter"],
                        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} lịch làm việc`,
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
            <LoadingComponent isLoading={isPendingCreateWorkingSchedule}>
                <ModalComponent
                    title="Thêm mới lịch làm việc"
                    open={isModalOpenCreate}
                    onOk={handleAddWorkingSchedule}
                    onCancel={handleCloseAddWorkingSchedule}
                    width={600}
                    style={{ borderRadius: 0 }}
                    okText="Thêm"
                    cancelText="Huỷ"
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
                        <LoadingComponent isLoading={isLoadingDoctors}>
                            <Form.Item
                                label="Tên bác sĩ"
                                name="name"
                                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn bác sĩ"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {doctors?.data?.map((doctor) => (
                                        <Option key={doctor._id} value={doctor._id} label={doctor?.user?.name}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img
                                                    src={doctor.image}
                                                    alt={doctor?.user?.name}
                                                    style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 10 }}
                                                />
                                                {doctor?.user?.name}
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </LoadingComponent>

                        <Form.Item
                            label="Ngày làm việc"
                            name="date"
                            rules={[{ required: true, message: "Vui lòng chọn ngày làm việc!" }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Thời gian bắt đầu"
                            name="startTime"
                            dependencies={['date']}
                            rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu!" }]}
                        >
                            <TimePicker
                                format="HH:mm"
                                style={{ width: '100%' }}
                                placeholder="Chọn thời gian bắt đầu"
                                disabledTime={() => {
                                    const selectedDate = formCreate.getFieldValue('date');
                                    const isToday = selectedDate && dayjs().isSame(selectedDate, 'day');
                                    const now = dayjs();

                                    return {
                                        disabledHours: () => {
                                            if (!isToday) return [];
                                            return Array.from({ length: 24 }, (_, i) => i).filter(hour => hour < now.hour());
                                        },
                                        disabledMinutes: (selectedHour) => {
                                            if (!isToday) return [];
                                            if (selectedHour === now.hour()) {
                                                return Array.from({ length: 60 }, (_, i) => i).filter(minute => minute < now.minute());
                                            }
                                            return [];
                                        },
                                        disabledSeconds: () => [] // Bạn có thể giữ trống nếu không cần disable giây
                                    };
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Thời gian kết thúc"
                            name="endTime"
                            dependencies={['startTime', 'date']}
                            rules={[
                                { required: true, message: "Vui lòng chọn thời gian kết thúc!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const start = getFieldValue('startTime');
                                        if (!value || !start || value.isAfter(start)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Giờ kết thúc phải sau giờ bắt đầu!'));
                                    },
                                }),
                            ]}
                        >
                            <TimePicker
                                format="HH:mm"
                                style={{ width: '100%' }}
                                placeholder="Chọn thời gian kết thức"
                                disabledTime={() => {
                                    const selectedDate = formCreate.getFieldValue('date');
                                    const isToday = selectedDate && dayjs().isSame(selectedDate, 'day');
                                    const now = dayjs();

                                    return {
                                        disabledHours: () => {
                                            if (!isToday) return [];
                                            return Array.from({ length: 24 }, (_, i) => i).filter(hour => hour < now.hour());
                                        },
                                        disabledMinutes: (selectedHour) => {
                                            if (!isToday) return [];
                                            if (selectedHour === now.hour()) {
                                                return Array.from({ length: 60 }, (_, i) => i).filter(minute => minute < now.minute());
                                            }
                                            return [];
                                        },
                                        disabledSeconds: () => [] // Bạn có thể giữ trống nếu không cần disable giây
                                    };
                                }}
                            />
                        </Form.Item>
                    </Form>
                </ModalComponent>
            </LoadingComponent>
            <DrawerComponent
                title="Chi tiết lịch làm việc"
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
                        onFinish={handleOnUpdateWorkingSchedule}
                        autoComplete="off"
                        form={formUpdate}
                    >
                        <Form.Item
                            label="Tên bác sĩ"
                            name="name"
                            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn bác sĩ"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {doctors?.data?.map((doctor) => (
                                    <Option key={doctor._id} value={doctor._id} label={doctor?.user?.name}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <img
                                                src={doctor.image}
                                                alt={doctor?.user?.name}
                                                style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 10 }}
                                            />
                                            {doctor?.user?.name}
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Ngày làm việc"
                            name="date"
                            rules={[{ required: true, message: "Vui lòng chọn ngày làm việc!" }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Thời gian bắt đầu"
                            name="startTime"
                            dependencies={['date']}
                            rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu!" }]}
                        >
                            <TimePicker
                                format="HH:mm"
                                style={{ width: '100%' }}
                                placeholder="Chọn thời gian bắt đầu"
                                disabledTime={() => {
                                    const selectedDate = formUpdate.getFieldValue('date');
                                    const isToday = selectedDate && dayjs().isSame(selectedDate, 'day');
                                    const now = dayjs();

                                    return {
                                        disabledHours: () => {
                                            if (!isToday) return [];
                                            return Array.from({ length: 24 }, (_, i) => i).filter(hour => hour < now.hour());
                                        },
                                        disabledMinutes: (selectedHour) => {
                                            if (!isToday) return [];
                                            if (selectedHour === now.hour()) {
                                                return Array.from({ length: 60 }, (_, i) => i).filter(minute => minute < now.minute());
                                            }
                                            return [];
                                        },
                                        disabledSeconds: () => [] // Bạn có thể giữ trống nếu không cần disable giây
                                    };
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Thời gian kết thúc"
                            name="endTime"
                            dependencies={['startTime', 'date']}
                            rules={[
                                { required: true, message: "Vui lòng chọn thời gian kết thúc!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const start = getFieldValue('startTime');
                                        if (!value || !start || value.isAfter(start)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Giờ kết thúc phải sau giờ bắt đầu!'));
                                    },
                                }),
                            ]}
                        >
                            <TimePicker
                                format="HH:mm"
                                style={{ width: '100%' }}
                                placeholder="Chọn thời gian kết thúc"
                                disabledTime={() => {
                                    const selectedDate = formUpdate.getFieldValue('date');
                                    const isToday = selectedDate && dayjs().isSame(selectedDate, 'day');
                                    const now = dayjs();

                                    return {
                                        disabledHours: () => {
                                            if (!isToday) return [];
                                            return Array.from({ length: 24 }, (_, i) => i).filter(hour => hour < now.hour());
                                        },
                                        disabledMinutes: (selectedHour) => {
                                            if (!isToday) return [];
                                            if (selectedHour === now.hour()) {
                                                return Array.from({ length: 60 }, (_, i) => i).filter(minute => minute < now.minute());
                                            }
                                            return [];
                                        },
                                        disabledSeconds: () => [] // Bạn có thể giữ trống nếu không cần disable giây
                                    };
                                }}
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
            <ModalComponent
                title="Xoá lịch làm việc"
                open={isModalOpenDelete}
                onOk={handleOkDelete}
                onCancel={handleCancelDelete}
                style={{ borderRadius: 0 }}
            >
                <LoadingComponent isLoading={isPendingDelete}>
                    <p>
                        Bạn có chắc chắn muốn <strong>xóa</strong> lịch làm việc
                        này không?
                    </p>
                </LoadingComponent>
            </ModalComponent>
            <ModalComponent
                title="Xoá nhiều lịch làm việc"
                open={isModalOpenDeleteMany}
                onOk={handleOkDeleteMany}
                onCancel={handleCancelDeleteMany}
                style={{ borderRadius: 0 }}
            >
                <LoadingComponent isLoading={isPendingDeleteMany}>
                    <p>
                        Bạn có chắc chắn muốn <strong>xóa</strong> lịch làm việc này không?
                    </p>
                </LoadingComponent>
            </ModalComponent>
        </>
    )
}

export default WorkingSchedule