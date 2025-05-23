
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DefaultLayout from '../../components/DefaultLayout/DefaultLayout';
import { Avatar } from 'antd';
import { Typography, Divider, Card, Flex } from 'antd';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as DoctorService from '../../services/DoctorService';
import * as WorkingScheduleService from '../../services/WorkingScheduleService';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)
import { useDispatch, useSelector } from 'react-redux';
import { updateAppointment, setAppointment } from '../../redux/Slice/appointmentSlice';
const { Title, Text } = Typography;
const DetailDoctorPage = () => {
    const { id } = useParams(); // id ở đây chính là từ /user/:id
    const [workingTime, setWorkingTime] = useState([]);
    const dispatch = useDispatch();
    const appointment = useSelector((state) => state.appointment);
    const queryGetWorkingScheduleByDoctor = useQuery({
        queryKey: ["getWorkingScheduleByDoctor", id],
        queryFn: () => WorkingScheduleService.getWorkingScheduleByDoctor(id),
        enabled: !!id,
    })
    const queryGetDoctor = useQuery({
        queryKey: ["getDoctor", id],
        queryFn: () => DoctorService.getDoctor(id),
        enabled: !!id,
    })
    const { data: workingSchedules, isLoading: isLoadingWorkingSchedule } = queryGetWorkingScheduleByDoctor
    const { data: doctor, isLoading: isLoadingDoctor } = queryGetDoctor

    useEffect(() => {
        if (
            workingSchedules?.status === "success"
        ) {
            const schedule = workingSchedules.data[0];
            if (
                schedule &&
                appointment.selectedDate !== schedule.workDate // chỉ update khi khác ngày
            ) {
                dispatch(setAppointment({
                    doctor: doctor.data,
                    schedule: schedule,
                    selectedDate: schedule.workDate,
                }));
                const startTime = schedule.startTime;
                const endTime = schedule.endTime;
                const timeSlots = generateTimeSlots(startTime, endTime);
                setWorkingTime(timeSlots);
            }
        }
    }, [workingSchedules, doctor]);
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
        dispatch(updateAppointment({ selectedDate: schedule.workDate }))
        setWorkingTime(timeSlots);
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
    const handleSelectedTime = () => {
        const selectedTime = workingTime.find((time) => !handleCheckTime(appointment.selectedDate, time));
        if (selectedTime) {
            dispatch(updateAppointment({ selectedTime }));
        }
    }
    function addMinutesToTime(timeStr, minutesToAdd) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const date = new Date(0, 0, 0, hours, minutes);
        date.setMinutes(date.getMinutes() + minutesToAdd);

        const resultHours = String(date.getHours()).padStart(2, "0");
        const resultMinutes = String(date.getMinutes()).padStart(2, "0");
        return `${resultHours}:${resultMinutes}`;
    }
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
                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: 16,

                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                        padding: 32,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}
                >
                    {/* Thông tin bác sĩ */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", justifyContent: "center" }}>
                        <Avatar size={170} src={doctor?.data?.user?.avatar} />
                        <div style={{ flex: 1, minWidth: 280 }}>
                            <Title level={3}>
                                {doctor?.data?.qualification} Bác sĩ {doctor?.data?.user?.name}
                            </Title>
                            <div>
                                <Title level={4} style={{ fontSize: 18, color: "#1890ff" }}><CheckCircleOutlined /> Bác sĩ {doctor?.data?.experience}</Title>
                                <Text type="secondary">Chuyên khoa:</Text>{" "}
                                <Text strong style={{ fontSize: "18px", color: "#1890ff" }} > {doctor?.data?.specialty?.name}</Text>
                            </div>

                            <div>
                                <Text type="secondary">Chức vụ:</Text>{" "}
                                <Text strong style={{ fontSize: "18px", }}>{doctor?.data?.position || "Không có"}</Text>
                            </div>

                            <div>
                                <Text type="secondary">Nơi công tác:</Text>{" "}
                                <Text strong style={{ fontSize: "18px", }}>{doctor?.data?.hospital?.name}</Text>
                            </div>
                        </div>
                    </div>
                    <Divider />
                    {/* Lịch làm việc */}
                    <div>
                        <Title level={4}>Lịch làm việc</Title>
                        <LoadingComponent isLoading={isLoadingWorkingSchedule}>
                            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
                                {workingSchedules?.data?.map((schedule) => {
                                    const days = ["CN", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7"];
                                    const dateObj = new Date(schedule.workDate);
                                    const workDay = days[dateObj.getDay()];
                                    const workDate = dayjs(dateObj).format("DD-MM");

                                    return (
                                        <Card
                                            key={schedule._id}
                                            hoverable={true}
                                            onClick={() => handleCreateWorkingTime(schedule)}
                                            style={{ minWidth: 150, flexShrink: 0 }}
                                        >
                                            <Card.Meta
                                                title={`${workDay}, ${workDate}`}
                                                description={`${schedule.startTime} - ${schedule.endTime}`}
                                            />
                                        </Card>
                                    );
                                })}
                            </div>
                        </LoadingComponent>
                    </div>

                    {/* Giờ làm việc */}
                    <div>
                        <Title level={4}>Chọn khung giờ</Title>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 12,
                                maxHeight: 160,
                                overflowY: "auto",
                                paddingRight: 4,
                            }}
                        >
                            {workingTime?.map((time, index) => (
                                <ButtonComponent
                                    hoverable="true"
                                    key={index}
                                    type="primary"
                                    size="large"
                                    disabled={handleCheckTime(appointment?.selectedDate, time)}
                                    style={{ width: 100 }}
                                    onClick={handleSelectedTime}
                                >
                                    {`${time}-${addMinutesToTime(time, 30)}`}
                                </ButtonComponent>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Title level={4}>Giới thiệu</Title>
                        <Text>{doctor?.data?.description}</Text>
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                            <Text>• Giảng viên Trường ĐH Y Dược TP.HCM</Text>
                            <Text>• Kinh nghiệm hơn 15 năm trong ngành tim mạch</Text>
                        </div>
                    </div>
                    <div>
                        <Title level={4}>Địa chỉ phòng khám: {doctor?.data?.hospital?.address}</Title>
                        <iframe
                            width="600"
                            height="450"
                            style={{ border: 0, borderRadius: 12 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${doctor?.data?.hospital?.address}&output=embed`}>
                        </iframe>
                    </div>

                    {/* Hotline và nút đặt lịch */}
                    <Divider />
                    <div
                        style={{
                            display: "flex",
                            gap: 20,
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#f0f2f5",
                            padding: 16,
                            borderRadius: 12,
                            position: "sticky",
                            bottom: 0, // Dính ở cuối màn hình khi cuộn
                            zIndex: 1000, // Đảm bảo không bị che
                            boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)", // Đổ bóng cho nổi
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <Text strong>Hỗ trợ đặt khám qua hotline:</Text>
                            <Text strong style={{ fontSize: 18, color: "#1890ff" }}>
                                1900 8888
                            </Text>
                        </div>
                        <ButtonComponent
                            type="primary"
                            size="large"
                            style={{
                                width: "50%",
                                fontWeight: "bold",
                                fontSize: 16,
                            }}
                        >
                            Đặt lịch khám
                        </ButtonComponent>
                    </div>
                </div>
            </div>
        </DefaultLayout >
    )
}

export default DetailDoctorPage