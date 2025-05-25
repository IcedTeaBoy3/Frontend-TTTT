
import DefaultLayout from '../../components/DefaultLayout/DefaultLayout'
import { Steps, Typography, Avatar, Flex, Divider, Input } from 'antd'
import { useSelector } from 'react-redux'
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined, FieldTimeOutlined } from '@ant-design/icons'
import { addMinutesToTime } from '../../utils/timeUtils'
import { formatDateToDDMMYYYY } from '../../utils/dateUtils'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import WorkingSchedule from '../../components/WorkingSchedule/WorkingSchedule'
import { Collapse } from "antd";
import { useState, useEffect } from 'react';
import * as WorkingScheduleService from '../../services/workingScheduleService'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { updateAppointment } from '../../redux/Slice/appointmentSlice'
import { updateUser } from '../../redux/Slice/authSlice'
import TimeSlot from '../../components/TimeSlot/TimeSlot'
import { useNavigate } from 'react-router-dom'
import ModalUpdateUser from '../../components/ModalUpdateUser/ModalUpdateUser'
import * as Message from '../../components/Message/Message';
import * as UserService from '../../services/UserService';
import dayjs from 'dayjs'

const { Title, Text } = Typography;
const BookingPage = () => {
    const doctor = useSelector((state) => state.appointment.doctor);
    const patient = useSelector((state) => state.auth.user);
    const appointment = useSelector((state) => state.appointment);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [timeSlots, setTimeSlots] = useState([]);
    const [activeKey, setActiveKey] = useState(appointment?.selectedTime ? ['2'] : ['1']);
    const [currentStep, setCurrentStep] = useState(appointment?.selectedTime ? 1 : 0);
    const onChange = key => {
        setActiveKey(key);
    };
    const queryGetWorkingScheduleByDoctor = useQuery({
        queryKey: ["getWorkingScheduleByDoctor", doctor?._id],
        queryFn: () => WorkingScheduleService.getWorkingScheduleByDoctor(doctor?._id),
        enabled: !!doctor?._id,
    })
    const mutationUpdateUpdateProfile = useMutation({
        mutationFn: (data) => {
            const { id, ...updateData } = data;
            return UserService.updateUser(id, updateData);
        },
        onSuccess: (res) => {
            if (res?.status === "success") {
                Message.success(res?.message);
                setIsModalOpen(false);
                setCurrentStep(2);
                setActiveKey(['3']);
                const { _id, createdAt, updatedAt, __v, password, ...updatedData } = res.data;
                dispatch(updateUser(updatedData));
            } else {
                Message.error(res?.message);
            }
        },
        onError: (error) => {
            Message.error(error?.response?.data?.message || "Có lỗi xảy ra");
        }
    })
    const { data: workingSchedules, isLoading: isLoadingWorkingSchedule } = queryGetWorkingScheduleByDoctor
    const { isPending: isPendingUpdateProfile } = mutationUpdateUpdateProfile
    useEffect(() => {
        if (
            workingSchedules?.status === "success" &&
            doctor?.status === "success" &&
            workingSchedules?.data.length > 0
        ) {
            const schedule = workingSchedules.data[0];

            dispatch(updateAppointment({
                doctor: doctor.data,
                schedule: schedule,
            }));

            // Cập nhật ngày nếu khác
            if (schedule && appointment.selectedDate !== schedule.workDate) {
                dispatch(updateAppointment({ selectedDate: schedule.workDate }));
            }

            // Luôn generate timeSlots
            const startTime = schedule.startTime;
            const endTime = schedule.endTime;
            const timeSlots = generateTimeSlots(startTime, endTime);
            setTimeSlots(timeSlots);
        }
    }, [workingSchedules, doctor]);
    useEffect(() => {
        if (appointment?.selectedDate) {
            const schedule = workingSchedules?.data?.find(item => item.workDate === appointment.selectedDate);
            if (schedule) {
                handleCreateWorkingTime(schedule);
            }
        }
    }, [appointment.selectedDate]);
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
    const handleCreateWorkingTime = (schedule) => {

        const startTime = schedule.startTime;
        const endTime = schedule.endTime;
        const timeSlots = generateTimeSlots(startTime, endTime);
        setTimeSlots(timeSlots);
        dispatch(updateAppointment({
            selectedDate: schedule.workDate,
        }));

    }
    const handleCheckTime = (selectedDate, time) => {
        if (!selectedDate || !time) return false;
        const selectedDay = dayjs(selectedDate).utc().local(); // selectedDate đã là local (vì là từ schedule)
        const now = dayjs();

        // Nếu ngày được chọn KHÔNG PHẢI hôm nay → cho phép (không disable)
        if (!selectedDay.isSame(now, 'day')) return false;

        // Ghép ngày và giờ lại để kiểm tra khoảng cách thời gian
        const fullSelectedTime = dayjs(`${selectedDay.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm');

        // Nếu khung giờ < 60 phút so với hiện tại → disable
        // 
        return fullSelectedTime.diff(now, 'minute') < 60;
    };
    const handleSelectedTime = (time) => {
        setActiveKey(['2']); // Mở tab Hồ sơ bệnh nhân khi chọn giờ khám
        // Cập nhật giờ khám đã chọn
        dispatch(updateAppointment({ selectedTime: time }));

    }


    const handleEditProfile = () => {
        setIsModalOpen(true);
    }
    const handleUpdateProfile = (data) => {
        mutationUpdateUpdateProfile.mutate(data);
    }
    const handleBookingSchedule = () => {
        if (!appointment?.selectedTime) {
            Message.error("Vui lòng chọn giờ khám trước khi đặt lịch");
            return;
        }

        const { name, email, phone, dateOfBirth, gender, address, ethnic, idCard, insuranceCode, job } = patient;
        if (!name || !email || !phone || !dateOfBirth || !gender || !address || !ethnic || !idCard || !insuranceCode || !job) {
            Message.error("Vui lòng cập nhật hồ sơ bệnh nhân trước khi đặt lịch khám");
            handleEditProfile();
            return;
        }
        dispatch(updateAppointment({
            reason: reason,
        }))
        navigate('/booking-success');
    }
    const itemsStep = [
        {
            title: 'Thời gian khám',
            icon: <FieldTimeOutlined />,
        },
        {
            title: 'Thông tin bệnh nhân',
            icon: <SolutionOutlined />,
        },
        {
            title: 'Xác nhận thông tin',
            icon: <LoadingOutlined />,
        },
        {
            title: 'Hoàn tất',
            icon: <SmileOutlined />,
        },
    ]
    const items = [
        {
            key: '1',
            label: 'Ngày và giờ khám',
            children: (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    <Text strong>Chọn ngày khám</Text>
                    <WorkingSchedule
                        workingSchedules={workingSchedules}
                        isLoading={isLoadingWorkingSchedule}
                        timeSlots={timeSlots}
                        selectedDate={appointment?.selectedDate}
                        handleCreateWorkingTime={handleCreateWorkingTime}
                    />
                    <Text strong>Chọn giờ khám</Text>
                    <TimeSlot
                        timeSlots={timeSlots}
                        selectedTime={appointment?.selectedTime}
                        handleCheckTime={handleCheckTime}
                        handleSelectedTime={handleSelectedTime}
                    />
                </div>
            ),
        },
        {
            key: '2',
            label: 'Hồ sơ bệnh nhân',
            children: (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,

                    }}
                >
                    <Flex justify='space-between' align='center' style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                        <Text strong>Họ và tên</Text>
                        <Text>{patient?.name}</Text>
                    </Flex>
                    <Flex justify='space-between' align='center' style={{ paddingBottom: "12px", borderBottom: "1px solid #f0f0f0" }}>

                        <Text strong>Giới tính</Text>
                        <Text>{patient?.gender}</Text>
                    </Flex>
                    <Flex justify='space-between' align='center' style={{ paddingBottom: "12px", borderBottom: "1px solid #f0f0f0" }}>
                        <Text strong>Ngày sinh</Text>
                        <Text>{formatDateToDDMMYYYY(patient?.dateOfBirth)}</Text>
                    </Flex>
                    <Flex justify='space-between' align='center' style={{ paddingBottom: "12px", borderBottom: "1px solid #f0f0f0" }}>

                        <Text strong>Số điện thoại</Text>
                        <Text>{patient?.phone}</Text>
                    </Flex>
                    <ButtonComponent
                        type="primary"
                        onClick={handleEditProfile}
                        style={{
                            width: "30%"
                        }}
                    >
                        Cập nhật hồ sơ
                    </ButtonComponent>
                </div>
            )
        },
        {
            key: '3',
            label: 'Thông tin bổ sung (không bắt buộc)',
            children: (
                <>
                    <Text strong>Ghi chú</Text>
                    <Flex
                        justify='space-between'
                        align='center'
                        style={{
                            padding: "12px 0",

                        }}
                    >

                        <Input.TextArea
                            placeholder="Nhập thông tin bổ sung (tiền sử bệnh, triệu chứng,...)"
                            rows={4}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        ></Input.TextArea>
                    </Flex >
                </>
            )
        }
    ];
    return (
        <DefaultLayout>
            <div
                style={{
                    minHeight: "100vh",
                    maxWidth: 1200,
                    width: "100%",
                    padding: "85px 16px",
                    margin: "0 auto",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Steps
                    current={currentStep}
                    items={itemsStep}
                />
                <Divider />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: '20px'
                    }}
                >

                    <div
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 16,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                            padding: 16,
                            flex: 1,
                        }}
                    >

                        <Collapse

                            onChange={onChange}
                            activeKey={activeKey}
                            items={items}
                        />


                    </div>
                    <div
                        style={{
                            backgroundColor: "#fff",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                            padding: 24,
                            borderRadius: 12,
                        }}
                    >
                        <Title level={4} style={{ marginBottom: 20 }}>Thông tin đặt khám</Title>

                        {/* Doctor info */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                padding: "12px 0",
                                borderTop: "1px solid #f0f0f0",
                                borderBottom: "1px solid #f0f0f0",
                            }}
                        >
                            <Avatar size={56} icon={<UserOutlined />} />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <Text strong style={{ fontSize: "18px" }}>Bác sĩ {doctor?.user?.name}</Text>
                                <Text type="secondary">{doctor?.hospital?.address}</Text>
                            </div>
                        </div>

                        {/* Appointment info */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                                padding: "20px 0",
                                borderBottom: "1px solid #f0f0f0",
                                marginBottom: 16,
                            }}
                        >
                            <Flex justify="space-between" align="center">
                                <Text style={{ fontSize: "16px" }}>🗓️ Ngày khám</Text>
                                <Text strong style={{ fontSize: "20px", color: "#1677ff" }}>
                                    {formatDateToDDMMYYYY(appointment?.selectedDate)}
                                </Text>
                            </Flex>

                            <Flex justify="space-between" align="center">
                                <Text style={{ fontSize: "16px" }}>🕒 Giờ khám</Text>
                                {appointment?.selectedTime ? (
                                    <Text strong style={{ fontSize: "20px", color: "#52c41a" }}>
                                        {`${appointment?.selectedTime} - ${addMinutesToTime(appointment?.selectedTime, 30)}`}
                                    </Text>
                                ) : (
                                    <Text strong type="danger" style={{ fontSize: "18px" }}>
                                        Chưa chọn giờ khám
                                    </Text>
                                )}
                            </Flex>

                            <Flex justify="space-between" align="center">
                                <Text style={{ fontSize: "16px" }}>👤 Bệnh nhân</Text>
                                <Text strong style={{ fontSize: "18px" }}>{patient?.name}</Text>
                            </Flex>
                        </div>

                        <ButtonComponent
                            type="primary"
                            size="large"
                            style={{ width: "100%", borderRadius: 8 }}
                            disabled={!appointment?.selectedTime}
                            onClick={handleBookingSchedule}
                        >
                            Đặt lịch
                        </ButtonComponent>
                    </div>
                </div>
            </div>
            <ModalUpdateUser
                isModalOpen={isModalOpen}
                handleUpdateProfile={handleUpdateProfile}
                isPendingUpdateProfile={isPendingUpdateProfile}
                onCancel={() => setIsModalOpen(false)}
            >

            </ModalUpdateUser>

        </DefaultLayout>
    )
}

export default BookingPage