import { useState, useRef } from "react";
import { Table, Space, Form, Select, Input, Tag, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined, CheckSquareOutlined } from "@ant-design/icons";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import ActionButtonGroup from "../../components/ActionButtonGroup/ActionButtonGroup";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import { addMinutesToTime } from "../../utils/timeUtils";
import { useAppointmentData } from "../../hooks/useAppointmentData";
import { useDoctorData } from "../../hooks/useDoctorData";
import { useWorkingScheduleData } from "../../hooks/useWorkingScheduleData";
import { usePatientData } from "../../hooks/usePatientData";
import dayjs from "dayjs";
const { Option } = Select;
const Appointment = () => {


    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rowSelected, setRowSelected] = useState(null);
    const [formUpdate] = Form.useForm();
    const fileInputRef = useRef(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [fileType, setFileType] = useState(null); // "csv" hoặc "excel"
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);

        },
        type: "checkbox",
    };
    const {
        queryGetAllAppointments,
        mutationConfirmApponintment,
        mutationDeleteAppointment,
        mutationUpdateAppointment,
        mutationDeleteManyAppointments,
    } = useAppointmentData({
        setIsDrawerOpen,
        setIsModalOpenDeleteMany,
        setIsModalOpenDelete,
        setSelectedRowKeys,
        setRowSelected,
    });

    const { queryGetAllDoctors } = useDoctorData({});
    const { useGetWorkingScheduleByDoctor } = useWorkingScheduleData({});
    const { queryGetAllPatients } = usePatientData({});

    const { data: appointments, isLoading: isLoadingAppointment } = queryGetAllAppointments;
    const { data: doctors, isLoading: isLoadingDoctor } = queryGetAllDoctors;
    const { data: workingSchedules, isLoading: isLoadingWorkingSchedule } = useGetWorkingScheduleByDoctor(formUpdate.getFieldValue("nameDoctor"));
    const { data: patients, isLoading: isLoadingPatient } = queryGetAllPatients;
    const { isPending: isPendingDelete } = mutationDeleteAppointment;
    const { isPending: isPendingUpdate } = mutationUpdateAppointment;
    const { isPending: isPendingDeleteMany } = mutationDeleteManyAppointments;
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
    const handleConfirmAppointment = () => {
        mutationConfirmApponintment.mutate(rowSelected);
    };
    const handleCancelConfirm = () => {

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
            dataIndex: "doctorName",
            key: "doctorName",
            ...getColumnSearchProps("doctorName"),
            render: (text) => {
                return text || "Chưa có thông tin";
            }
        },
        {
            title: "Tên bệnh nhân",
            dataIndex: "patientName",
            key: "patientName",
            ...getColumnSearchProps("patientName"),
            render: (text) => {
                return text || "Chưa có thông tin";
            }
        },
        {
            title: "Ngày khám",
            dataIndex: "workDate",
            key: "workDate",
            // ...getColumnSearchProps("workDate"),
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
            filterMode: "tree",
            filterMultiple: false,
            render: (text) => {
                return text ? new Date(text).toLocaleDateString("vi-VN") : "Chưa có thông tin";
            }
        },
        {
            title: "Khung giờ",
            dataIndex: "timeSlot",
            key: "timeSlot",
            render: (text) => {
                return text ? `${text} - ${addMinutesToTime(text, 30)}` : "Chưa có thông tin";
            }
        },
        {
            title: "Lý do khám",
            dataIndex: "reason",
            key: "reason",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text) => {
                const statusMap = {
                    pending: {
                        label: "Chờ xác nhận",
                        color: "orange",
                    },
                    confirmed: {
                        label: "Đã xác nhận",
                        color: "blue",
                    },
                    cancelled: {
                        label: "Đã huỷ",
                        color: "red",
                    },
                    completed: {
                        label: "Đã hoàn thành",
                        color: "green",
                    },
                };

                const status = statusMap[text];

                return (
                    <Space>
                        <Tag color={status?.color || "default"}>
                            {status?.label || text}
                        </Tag>
                        {text === "pending" && (
                            <Popconfirm
                                title="Duyệt lịch hẹn"
                                placement="topRight"
                                description="Bạn có chắc chắn muốn duyệt lịch hẹn này không?"
                                onConfirm={handleConfirmAppointment}
                                onCancel={handleCancelConfirm}
                                okText="Duyệt"
                                cancelText="Huỷ"
                            >
                                <ButtonComponent
                                    styleButton={{ backgroundColor: "green", color: "white" }}
                                    size="small"
                                    icon={<CheckSquareOutlined />}
                                >
                                    Duyệt
                                </ButtonComponent>
                            </Popconfirm>

                        )}
                    </Space>
                );
            },
            filters: [
                { text: "Chờ xác nhận", value: "pending" },
                { text: "Đã xác nhận", value: "confirmed" },
                { text: "Đã huỷ", value: "cancelled" },
                { text: "Đã hoàn thành", value: "completed" },
            ],
            onFilter: (value, record) => record.status.includes(value),
            filterMode: "tree",
            filterMultiple: false,
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
                        onClick={() => handleEditAppointment(record.key)}
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
    const dataTable = appointments?.data?.map((item, index) => ({
        key: item._id,
        index: index + 1,
        doctorName: item.doctor?.user?.name,
        patientName: item.patient?.name,
        workDate: item.schedule?.workDate,
        timeSlot: item.timeSlot,
        reason: item.reason,
        status: item.status,
    })) || [];

    const handleEditAppointment = (id) => {
        setRowSelected(id);
        const appointment = appointments?.data?.find(item => item._id === id);
        if (appointment) {
            formUpdate.setFieldsValue({
                nameDoctor: appointment.doctor?._id,
                namePatient: appointment.patient?._id,
                workDate: appointment.schedule?._id,
                timeSlot: `${appointment.timeSlot} - ${addMinutesToTime(appointment.timeSlot, 30)}`,
                reason: appointment.reason,
                status: appointment.status,
            });
        }
        setIsDrawerOpen(true);
    }
    const handleOnUpdateAppointment = () => {
        formUpdate.validateFields().then((values) => {
            const { nameDoctor, namePatient, workDate, timeSlot, reason } = values;
            const appointmentData = {
                id: rowSelected,
                doctorId: nameDoctor,
                patientId: namePatient,
                scheduleId: workDate,
                timeSlot: timeSlot,
                reason: reason,
            };
            mutationUpdateAppointment.mutate(appointmentData);
        }).catch((error) => {
            console.error("Validation failed:", error);
        });

    }
    const handleOkDelete = () => {
        mutationDeleteAppointment.mutate(rowSelected);
    }
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
        setRowSelected(null);
    }
    const handleOkDeleteMany = () => {
        mutationDeleteManyAppointments.mutate(selectedRowKeys);
    }
    const handleCancelDeleteMany = () => {
        setIsModalOpenDeleteMany(false);
        setSelectedRowKeys([]);
    }
    const handleExportCSV = () => { }
    const handleExportExcel = () => { }
    const handleChooseFile = () => { }
    const handleFileChange = (e) => { }
    function generateTimeSlots(start, end, duration = 30) {
        const slots = [];
        let [startHour, startMin] = start.split(':').map(Number);
        let [endHour, endMin] = end.split(':').map(Number);
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;

        for (let time = startTime; time + duration <= endTime; time += duration) {
            const h = Math.floor(time / 60);
            const m = time % 60;
            slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
        return slots;
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
            >

            </ActionButtonGroup>
            <LoadingComponent isLoading={isLoadingAppointment}>
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
                        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} lịch hẹn`,
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
                title="Chi tiết lịch hẹn"
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
                        onFinish={handleOnUpdateAppointment}
                        autoComplete="off"
                        form={formUpdate}
                    >
                        <Form.Item
                            label="Tên bác sĩ"
                            name="nameDoctor"
                            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn bác sĩ"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value) => {
                                    formUpdate.setFieldsValue({
                                        workDate: "",
                                        timeSlot: "",
                                    });
                                    setTimeSlots([]);
                                }}

                            >
                                {doctors && doctors?.data?.map((doctor) => (
                                    <Option key={doctor._id} value={doctor._id} label={doctor?.user?.name}>
                                        {doctor?.user?.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Tên bệnh nhân"
                            name="namePatient"
                            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn bệnh nhân"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                            >

                                {patients && patients?.data?.map((patient) => (
                                    <Option key={patient._id} value={patient._id} label={patient.name}>
                                        {patient.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Ngày khám"
                            name="workDate"
                            rules={[{ required: true, message: "Vui lòng chọn ngày khám!" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn ngày khám"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value) => {
                                    const selectedSchedule = workingSchedules?.data?.find(schedule => schedule._id === value);
                                    if (selectedSchedule) {
                                        const startTime = selectedSchedule.startTime;
                                        const endTime = selectedSchedule.endTime;
                                        setTimeSlots(generateTimeSlots(startTime, endTime));
                                        formUpdate.setFieldsValue({ timeSlot: "" }); // Reset timeSlot when workDate changes
                                    } else {
                                        setTimeSlots([]);
                                    }
                                }}
                            >
                                {workingSchedules && workingSchedules?.data?.length > 0 && (
                                    workingSchedules.data.map((schedule) => (
                                        <Option key={schedule._id} value={schedule._id} label={dayjs(schedule?.workDate).format("DD/MM/YYYY")}>
                                            {dayjs(schedule?.workDate).format("DD/MM/YYYY")}
                                        </Option>
                                    ))
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Giờ khám"
                            name="timeSlot"
                            rules={[{ required: true, message: "Vui lòng chọn giờ khám!" }]}

                        >

                            <Select
                                showSearch
                                placeholder="Chọn giờ khám"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }

                            >
                                {timeSlots && timeSlots.length > 0 && (
                                    timeSlots.map((slot) => (
                                        <Option key={slot} value={slot} label={`${slot} - ${addMinutesToTime(slot, 30)}`}>
                                            {`${slot} - ${addMinutesToTime(slot, 30)}`}
                                        </Option>
                                    ))
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Lý do khám"
                            name="reason"
                            rules={[{ required: true, message: "Vui lòng nhập lý do khám!" }]}
                        >
                            <Input.TextArea placeholder="Lý do khám" rows={4}></Input.TextArea>

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
};

export default Appointment;
