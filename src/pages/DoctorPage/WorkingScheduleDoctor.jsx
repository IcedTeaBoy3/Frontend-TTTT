
import { useWorkingScheduleData } from '../../hooks/useWorkingScheduleData'
import { useSelector } from 'react-redux'
import { Table, Tag, Space, Form, DatePicker, TimePicker, Select, Popconfirm, Flex, Radio, Button } from 'antd'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import ActionButtonGroup from '../../components/ActionButtonGroup/ActionButtonGroup'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import DrawerComponent from '../../components/DrawerComponent/DrawerComponent'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import dayjs from 'dayjs'
const WorkingScheduleDoctor = () => {
    const { doctorId } = useSelector((state) => state.doctor);
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rowSelected, setRowSelected] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    const [formCreate] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const {
        queryGetAllWorkingSchedulesByDoctor,
        mutationCreateWorkingSchedule,
        mutationUpdateWorkingSchedule,
        mutationDeleteWorkingSchedule,
        mutationDeleteManyWorkingSchedules,
    } = useWorkingScheduleData({
        setIsModalOpenCreate,
        setIsDrawerOpen,
        setIsModalOpenDeleteMany,
        setSelectedRowKeys,
        setRowSelected,
        doctorId,
    });
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
            setSelectedRowKeys(selectedKeys);

        },
        type: "checkbox",
    };


    const { data: workingSchedules, isLoading: isLoadingWorkingSchedule } = queryGetAllWorkingSchedulesByDoctor;
    const { isPending: isPendingUpdate } = mutationUpdateWorkingSchedule;
    const { isPending: isPendingCreate } = mutationCreateWorkingSchedule;
    const { isPending: isPendingDeleteMany } = mutationDeleteManyWorkingSchedules;
    const handleDeleteWorkingSchedule = () => {
        mutationDeleteWorkingSchedule.mutate(rowSelected);
    }
    const handleOnUpdateWorkingSchedule = (values) => {
        const { date, startTime, endTime, shiftDuration, status } = values;
        const formattedData = {
            id: rowSelected,
            doctor: doctorId,
            workDate: dayjs(date).format("YYYY-MM-DD"),
            startTime: dayjs(startTime).format("HH:mm"),
            endTime: dayjs(endTime).format("HH:mm"),
            shiftDuration: shiftDuration,
            status: status,
        };
        mutationUpdateWorkingSchedule.mutate(formattedData);
    }
    const handleEditWorkingSchedule = (id) => {
        const selectedSchedule = workingSchedules.data.find(item => item._id === id);
        if (selectedSchedule) {
            formUpdate.setFieldsValue({
                date: dayjs(selectedSchedule.workDate, "YYYY-MM-DD"),
                startTime: dayjs(selectedSchedule.startTime, "HH:mm"),
                endTime: dayjs(selectedSchedule.endTime, "HH:mm"),
                shiftDuration: selectedSchedule.shiftDuration,
                status: selectedSchedule.status,
            });
            setIsDrawerOpen(true);
        } else {
            console.error("Lịch làm việc không tồn tại");
        }
    }
    const handleOkDeleteMany = () => {
        mutationDeleteManyWorkingSchedules.mutate(selectedRowKeys);
    }
    const columns = [
        {
            title: "STT",
            dataIndex: "STT",
            key: "STT",
            sorter: (a, b) => a.STT - b.STT,
        },
        {
            title: "Ngày làm việc",
            dataIndex: "workDate",
            key: "workDate",
            filters: [
                {
                    text: "Hôm nay",
                    value: dayjs().format("YYYY-MM-DD"),
                },
                {
                    text: "Ngày mai",
                    value: dayjs().add(1, 'day').format("YYYY-MM-DD"),
                },
                {
                    text: "Ngày kia",
                    value: dayjs().add(2, 'day').format("YYYY-MM-DD"),
                },
            ],
            onFilter: (value, record) => dayjs(record.workDate).format("YYYY-MM-DD") === value,
            render: (text) => {
                return dayjs(text).format("DD/MM/YYYY");
            }
        },
        {
            title: "Giờ bắt đầu",
            dataIndex: "startTime",
            key: "startTime",

        },
        {
            title: "Giờ kết thúc",
            dataIndex: "endTime",
            key: "endTime",

        },
        {
            title: "Thời gian ca",
            dataIndex: "shiftDuration",
            key: "shiftDuration",
            filters: [
                { text: "15 phút", value: 15 },
                { text: "30 phút", value: 30 },
                { text: "45 phút", value: 45 },
                { text: "60 phút", value: 60 },
            ],
            onFilter: (value, record) => record.shiftDuration === value,
            render: (text) => {
                return `${text} phút`;
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Đang hoạt động", value: "active" },
                { text: "Ngừng hoạt động", value: "inactive" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (text) => {
                return text === "active" ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Ngừng hoạt động</Tag>;
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
                        onClick={() => handleEditWorkingSchedule(record.key)}
                    >
                        Sửa
                    </ButtonComponent>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xoá lịch làm việc này?"
                        onConfirm={handleDeleteWorkingSchedule}
                        confirmText="Có"
                        cancelText="Không"
                    >

                        <ButtonComponent
                            icon={<DeleteOutlined style={{ fontSize: "15px" }} />}
                            styleButton={{ backgroundColor: "red", color: "white" }}
                            size="small"
                        >
                            Xoá
                        </ButtonComponent>
                    </Popconfirm>
                </Space>
            ),
        },
    ]
    const dataTable = workingSchedules?.data?.map((item, index) => ({
        key: item._id,
        STT: index + 1,
        workDate: item.workDate,
        startTime: item.startTime,
        endTime: item.endTime,
        shiftDuration: item.shiftDuration,
        status: item.status,
    }));
    const handleAddWorkingSchedule = () => {
        formCreate.validateFields().then((values) => {
            const { date, startTime, endTime, shiftDuration } = values;
            const formattedData = {
                doctorId: doctorId,
                workDate: dayjs(date).format("YYYY-MM-DD"),
                startTime: dayjs(startTime).format("HH:mm"),
                endTime: dayjs(endTime).format("HH:mm"),
                shiftDuration: shiftDuration,
            };
            mutationCreateWorkingSchedule.mutate(formattedData);
        }).catch((error) => {
            console.error("Validation failed:", error);
        });
    };
    const handleCloseAddWorkingSchedule = () => {
        setIsModalOpenCreate(false);
        formCreate.resetFields();
    };

    return (
        <>
            <ActionButtonGroup
                selectedRowKeys={selectedRowKeys}
                dataTable={dataTable}
                // onExportCSV={handleExportCSV}
                // onExportExcel={handleExportExcel}
                // onImportCSV={() => handleExportCSV("csv")}
                // onImportExcel={() => handleChooseFile("excel")}
                // fileInputRef={fileInputRef}
                // fileType={fileType}
                // onFileChange={handleFileChange}
                onDeleteMany={() => setIsModalOpenDeleteMany(true)}
                onCreateNew={() => setIsModalOpenCreate(true)}
            >

            </ActionButtonGroup>
            <LoadingComponent isLoading={isLoadingWorkingSchedule}>
                <Table
                    rowSelection={rowSelection}
                    rowKey={"key"}
                    columns={columns}
                    scroll={{ x: "max-content" }}
                    dataSource={dataTable}
                    locale={{
                        emptyText: (
                            <ButtonComponent
                                type="solid"
                                onClick={() => setIsModalOpenCreate(true)}
                                icon={<PlusOutlined />}
                            >
                                Thêm mới lịch làm việc
                            </ButtonComponent>
                        ),


                    }}
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
            </LoadingComponent >
            <LoadingComponent isLoading={isPendingCreate}>
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
                        initialValues={{
                            shiftDuration: 30, // Giá trị mặc định
                            date: dayjs(), // Ngày hiện tại
                            startTime: dayjs().startOf('hour').add(1, 'hour'),
                            endTime: dayjs().startOf('hour').add(3, 'hour'),
                        }}
                        autoComplete="off"
                        form={formCreate}
                    >

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
                        <Form.Item
                            label="Thời gian ca"
                            name="shiftDuration"
                            rules={[{ required: true, message: "Vui lòng chọn thời gian ca!" }]}
                        >
                            <Select
                                placeholder="Chọn thời gian ca"
                                style={{ width: '100%' }}

                                options={[
                                    { value: 15, label: '15 phút' },
                                    { value: 30, label: '30 phút' },
                                    { value: 45, label: '45 phút' },
                                    { value: 60, label: '60 phút' },
                                ]}
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
                        onFinish={handleOnUpdateWorkingSchedule}
                        autoComplete="off"
                        form={formUpdate}
                    >
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
                            label="Thời gian ca"
                            name="shiftDuration"
                            rules={[{ required: true, message: "Vui lòng chọn thời gian ca!" }]}
                        >
                            <Select
                                placeholder="Chọn thời gian ca"
                                style={{ width: '100%' }}

                                options={[
                                    { value: 15, label: '15 phút' },
                                    { value: 30, label: '30 phút' },
                                    { value: 45, label: '45 phút' },
                                    { value: 60, label: '60 phút' },
                                ]}
                            />

                        </Form.Item>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                        >
                            <Radio.Group
                                style={{ width: '100%' }}
                                buttonStyle="solid"

                            >
                                <Radio value="active">Đang hoạt động</Radio>
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
            </DrawerComponent >
            <ModalComponent
                title="Xoá nhiều lịch làm việc"
                open={isModalOpenDeleteMany}
                onOk={handleOkDeleteMany}
                onCancel={() => setIsModalOpenDeleteMany(false)}
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

export default WorkingScheduleDoctor