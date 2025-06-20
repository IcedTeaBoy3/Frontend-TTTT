
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import * as AppointmentService from '../../services/AppointmentService'
import { Table, Space, Tag, Popconfirm } from 'antd'
import { useState } from 'react'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { addMinutesToTime } from "../../utils/timeUtils";
import { useAppointmentData } from '../../hooks/useAppointmentData'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import dayjs from 'dayjs'
const AppointmentDoctor = () => {
    const { doctorId } = useSelector((state) => state.doctor);
    const [rowSelected, setRowSelected] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);

        },
        type: "checkbox",
    };
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const {
        queryGetAllAppointmentsByDoctor,
        mutationCancelAppointment,
        mutationCompletedAppointment,
    } = useAppointmentData({
        setRowSelected,
        doctorId,
    });

    const { data: appointments, isLoading: isLoadingAppointment } = queryGetAllAppointmentsByDoctor;
    const handleViewDetail = (record) => {
        setSelectedAppointment(record);
    }
    const handleCompletedAppointment = () => {
        mutationCompletedAppointment.mutate(rowSelected)
    }
    const handleCancelAppointment = () => {
        mutationCancelAppointment.mutate(rowSelected);
    }
    const statusMap = {
        pending: {
            label: "Chờ xác nhận",
            color: "orange",
            icon: <ClockCircleOutlined />
        },
        confirmed: {
            label: "Đã xác nhận",
            color: "blue",
            icon: <CheckCircleOutlined />
        },
        cancelled: {
            label: "Đã huỷ",
            color: "red",
            icon: <CloseCircleOutlined />
        },
        completed: {
            label: "Đã hoàn thành",
            color: "green",
            icon: <CheckCircleOutlined />
        },
    };
    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            sorter: (a, b) => a.index - b.index,
        },
        {
            title: "Tên bệnh nhân",
            dataIndex: "patientName",
            key: "patientName",
            render: (text, record) => {
                return (

                    <ButtonComponent
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        <span>{text || "Chưa có thông tin"}</span>
                    </ButtonComponent>

                );
            }
        },
        {
            title: "Lý do khám",
            dataIndex: "reason",
            key: "reason",
            render: (text) => {
                return text.length > 60 ? text.substring(0, 50) + "..." : text || "Chưa có thông tin";
            }
        },
        {
            title: "Chuyên khoa",
            dataIndex: "specialty",
            key: "specialty",
            render: (text) => {
                return text || "Chưa có thông tin";
            }
        },
        {
            title: "📅 Ngày hẹn",
            dataIndex: "appointmentDate",
            key: "appointmentDate",
            render: (text) => {
                return text ? dayjs(text).format("DD/MM/YYYY") : "Chưa có thông tin";
            },
            filters: [
                {
                    text: "Hôm nay",
                    value: dayjs().format("DD/MM/YYYY"),
                },
                {
                    text: "Ngày mai",
                    value: dayjs().add(1, 'day').format("DD/MM/YYYY"),
                },
                {
                    text: "Ngày kia",
                    value: dayjs().add(2, 'day').format("DD/MM/YYYY"),
                },
            ],
            onFilter: (value, record) => {
                const appointmentDate = dayjs(record.appointmentDate).format("DD/MM/YYYY");
                return appointmentDate.includes(value);
            },
        },
        {
            title: "🕒 Giờ hẹn",
            dataIndex: "appointmentTime",
            key: "appointmentTime",
            render: (_, record) => {
                if (!record.appointmentTime) return "Chưa có thông tin";
                const [start, end] = record.appointmentTime.split(" - ");
                return `${start} - ${end || addMinutesToTime(start, record.schedule?.shiftDuration || 30)}`;
            }
        },
        {
            title: "🟢 Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text) => {
                const status = statusMap[text];
                return (
                    <Space>
                        <Tag color={status?.color || "default"} icon={status?.icon || null}>
                            {status?.label || text}
                        </Tag>
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
            title: 'Đánh dấu',
            key: 'statusAction',
            render: (_, record) => (
                <Space >
                    <Popconfirm
                        title="Xác nhận duyệt lịch hẹn"
                        placement="topRight"
                        description="Bạn có chắc chắn muốn đánh dấu lịch hẹn này là đã đến không?"
                        onConfirm={handleCompletedAppointment}
                        okText="Đồng ý"
                        cancelText="Huỷ bỏ"
                    >

                        <ButtonComponent
                            type="primary"
                            size="small"
                            icon={<CheckCircleOutlined />}
                            disabled={record.status !== "confirmed"}
                        >
                            Đã đến
                        </ButtonComponent>
                    </Popconfirm>
                    <Popconfirm
                        title="Xác nhận huỷ lịch hẹn"
                        placement="topRight"
                        description="Bạn có chắc chắn muốn huỷ lịch hẹn này không?"
                        onConfirm={handleCancelAppointment}
                        okText="Đồng ý"
                        cancelText="Huỷ bỏ"
                    >
                        <ButtonComponent
                            type="primary"
                            size="small"
                            danger
                            icon={<CloseCircleOutlined />}
                            disabled={record.status !== "confirmed"}
                        >
                            Không đến
                        </ButtonComponent>
                    </Popconfirm>
                </Space>
            ),
        },
    ]
    const dataTable = appointments?.data?.map((appointment, index) => ({
        key: appointment._id,
        index: index + 1,
        schedule: appointment.schedule,
        reason: appointment.reason || "Chưa có thông tin",
        doctorName: appointment.doctor?.user?.name || "Chưa có thông tin",
        patientName: appointment.patient?.name || "Chưa có thông tin",
        specialty: appointment.specialty?.name || "Chưa có thông tin",
        appointmentDate: appointment.schedule?.workDate || "Chưa có thông tin",
        appointmentTime: appointment.timeSlot || "Chưa có thông tin",
        status: appointment.status || "Chưa có thông tin",
    }));
    return (
        <>

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
            {/* Modal xem chi tiết */}
            <ModalComponent
                open={!!selectedAppointment}
                title="Chi tiết lịch hẹn"
                onCancel={() => setSelectedAppointment(null)}
                footer={null}
            >
                {selectedAppointment && (
                    <>
                        <p><strong>Tên bệnh nhân: </strong> {selectedAppointment.patientName}</p>
                        <p><strong>Lý do khám: </strong> {selectedAppointment.reason}</p>
                        <p><strong>Chuyên khoa: </strong>
                            <Tag color="blue">
                                {selectedAppointment.specialty}
                            </Tag>
                        </p>
                        <p><strong>Ngày hẹn: </strong> {dayjs(selectedAppointment.appointmentDate).format("DD/MM/YYYY")}</p>
                        <p><strong>Giờ hẹn: </strong> {selectedAppointment.appointmentTime}</p>
                        <p><strong>Trạng thái: </strong>
                            <Tag color={statusMap[selectedAppointment.status]?.color || "default"} icon={statusMap[selectedAppointment.status]?.icon || null}>
                                {statusMap[selectedAppointment.status]?.label || selectedAppointment.status}
                            </Tag>
                        </p>
                    </>
                )}
            </ModalComponent>
        </>
    )
}

export default AppointmentDoctor