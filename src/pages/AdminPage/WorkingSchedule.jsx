import React from 'react'
import { Flex, Form, Select, Input, DatePicker, TimePicker, Table, Pagination, Space } from "antd";
import { DeleteOutlined, PlusCircleFilled, ExportOutlined, ImportOutlined, EditOutlined } from "@ant-design/icons";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import * as DoctorService from "../../services/DoctorService";
import * as Message from "../../components/Message/Message";
import * as WorkingScheduleService from "../../services/WorkingScheduleService";
import dayjs from 'dayjs';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useMemo } from "react";
const WorkingSchedule = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
    const [rowSelected, setRowSelected] = useState(null);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [formCreate] = Form.useForm();
    const { Option } = Select;
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: "checkbox",
    };
    const queryGetAllDoctors = useQuery({
        queryKey: ["getAllDoctors"],
        queryFn: () => DoctorService.getAllDoctors(),

    })
    const queryGetAllWorkingSchedule = useQuery({
        queryKey: ["getAllWorkingSchedule", pagination],
        queryFn: () => WorkingScheduleService.getAllWorkingSchedules(pagination.current, pagination.pageSize),
        refetchOnWindowFocus: false,
        refetchInterval: 10000,
    })
    const mutationCrateWorkingSchedule = useMutation({
        mutationFn: (data) => WorkingScheduleService.createWorkingSchedule(data),
        onSuccess: (res) => {
            if (res.status === "success") {
                Message.success(res.message);
                setIsOpenAdd(false);
                formCreate.resetFields();
            } else {
                Message.error(res.message);
            }
        },
        onError: (error) => {
            console.log(error);
            Message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
        },
    })
    const { data: doctors, isLoading: isLoadingDoctors } = queryGetAllDoctors;
    const { data: workingSchedules, isLoading: isLoadingWorkingSchedules } = queryGetAllWorkingSchedule;
    const { isPending: isPendingCreateWorkingSchedule } = mutationCrateWorkingSchedule;
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
            render: (_, record) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src={record?.doctor?.image}
                        alt={record?.doctor?.user?.name}
                        style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 10 }}
                    />
                    {record?.doctor?.user?.name}
                </div>
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
                    // onClick={() => handleEditDoctor(record.key)}
                    >
                        Sửa
                    </ButtonComponent>
                    <ButtonComponent
                        icon={<DeleteOutlined style={{ fontSize: "15px" }} />}
                        styleButton={{ backgroundColor: "red", color: "white" }}
                        size="small"
                    // onClick={() => setIsModalOpenDelete(true)}
                    >
                        Xoá
                    </ButtonComponent>
                </Space>
            ),
        },
    ];
    const dataTable = useMemo(() => {
        if (workingSchedules?.data) {
            return workingSchedules.data.map((item, index) => ({
                key: item._id,
                index: index + 1,
                doctor: item.doctor,
                workDate: item.workDate,
                startTime: item.startTime,
                endTime: item.endTime,
            }));
        }
        return [];
    }, [workingSchedules]);
    const handleAddDoctor = () => {
        formCreate.validateFields().then(async (values) => {
            const data = {
                doctorId: values.name,
                workDate: values.date.toDate(),
                startTime: values.startTime.format("HH:mm"),
                endTime: values.endTime.format("HH:mm"),
            }
            mutationCrateWorkingSchedule.mutate(data, {
                onSettled: () => {
                    queryGetAllWorkingSchedule.refetch();
                }
            });


        }).catch((error) => {
            console.log(error);
        })
    }
    const handleCloseAddDoctor = () => {

        setIsOpenAdd(false);
    }
    const handleChangePage = (page, pageSize) => {
        setPagination({ current: page, pageSize });
    };
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
            <LoadingComponent isLoading={isLoadingWorkingSchedules} delay={200}>
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
            <LoadingComponent isLoading={isPendingCreateWorkingSchedule}>
                <ModalComponent
                    title="Thêm mới lịch làm việc"
                    open={isOpenAdd}
                    onOk={handleAddDoctor}
                    onCancel={handleCloseAddDoctor}
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
                                disabledHours={() => {
                                    const selectedDate = formCreate.getFieldValue('date');
                                    const isToday = selectedDate && dayjs().isSame(selectedDate, 'day');
                                    const now = dayjs();

                                    if (!isToday) return [];
                                    return Array.from({ length: 24 }, (_, i) => i).filter((hour) => hour < now.hour());
                                }}
                                disabledMinutes={(selectedHour) => {
                                    const selectedDate = formCreate.getFieldValue('date');
                                    const isToday = selectedDate && dayjs().isSame(selectedDate, 'day');
                                    const now = dayjs();

                                    if (!isToday) return [];
                                    if (selectedHour === now.hour()) {
                                        return Array.from({ length: 60 }, (_, i) => i).filter((minute) => minute < now.minute());
                                    }
                                    return [];
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
                                disabledHours={() => {
                                    const selectedDate = formCreate.getFieldValue('date');
                                    const isToday = selectedDate && dayjs().isSame(selectedDate, 'day');
                                    const now = dayjs();

                                    if (!isToday) return [];
                                    return Array.from({ length: 24 }, (_, i) => i).filter((hour) => hour < now.hour());
                                }}
                                disabledMinutes={(selectedHour) => {
                                    const selectedDate = formCreate.getFieldValue('date');
                                    const isToday = selectedDate && dayjs().isSame(selectedDate, 'day');
                                    const now = dayjs();

                                    if (!isToday) return [];
                                    if (selectedHour === now.hour()) {
                                        return Array.from({ length: 60 }, (_, i) => i).filter((minute) => minute < now.minute());
                                    }
                                    return [];
                                }}
                            />
                        </Form.Item>
                    </Form>
                </ModalComponent>
            </LoadingComponent>
        </>
    )
}

export default WorkingSchedule