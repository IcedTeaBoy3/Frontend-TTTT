import { useState } from "react";
import { Flex, Table, Pagination, Space } from "antd";
import { PlusCircleFilled, DeleteOutlined, ExportOutlined, ImportOutlined, EditOutlined } from "@ant-design/icons";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useQuery } from "@tanstack/react-query";
import * as AppointmentService from "../../services/AppointmentService";
import { addMinutesToTime } from "../../utils/timeUtils";
import * as Message from "../../components/Message/Message";

const Appointment = () => {
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rowSelected, setRowSelected] = useState(null);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const queryGetAllAppointments = useQuery({
        queryKey: ["getAllAppointments"],
        queryFn: () => AppointmentService.getAllAppointments(pagination.page, pagination.pageSize),
        keepPreviousData: true,
    })
    const { data: appointments, isLoading: isLoadingAppointment } = queryGetAllAppointments;
    console.log("appointments", appointments);
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: "checkbox",
    };
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

        },
        {
            title: "Tên bệnh nhân",
            dataIndex: "patientName",
            key: "patientName",
        },
        {
            title: "Ngày khám",
            dataIndex: "workDate",
            key: "workDate",
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
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <ButtonComponent
                        size="small"
                        type="primary"
                        icon={<EditOutlined style={{ fontSize: "15px" }} />}
                    // onClick={() => handleEditDoctor(record.key)}
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
        doctorName: item.doctor?.user?.name || "Chưa có thông tin",
        patientName: item.patient?.name || "Chưa có thông tin",
        workDate: item.schedule?.workDate || "Chưa có thông tin",
        timeSlot: item.timeSlot || "Chưa có thông tin",
        reason: item.reason || "Chưa có thông tin",
    })) || [];



    // Sau đó bạn có thể làm:
    pagination.total = appointments?.total || 0;
    const handleChangePage = (page, pageSize) => {
        setPagination({
            ...pagination,
            current: page,
            pageSize: pageSize,
        });
    }
    console.log(pagination)
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
            <LoadingComponent isLoading={isLoadingAppointment}>
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
        </>
    )
};

export default Appointment;
