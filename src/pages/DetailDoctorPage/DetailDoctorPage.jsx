
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, use } from 'react';
import DefaultLayout from '../../components/DefaultLayout/DefaultLayout';
import { Avatar } from 'antd';
import { Typography, Divider, Card, Flex } from 'antd';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as DoctorService from '../../services/DoctorService';
import * as WorkingScheduleService from '../../services/WorkingScheduleService';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useDispatch, useSelector } from 'react-redux';
import { updateAppointment, setAppointment } from '../../redux/Slice/appointmentSlice';
import WorkingSchedule from '../../components/WorkingSchedule/WorkingSchedule';
import TimeSlot from '../../components/TimeSlot/TimeSlot';
import * as Message from '../../components/Message/Message';
dayjs.extend(utc)
const { Title, Text } = Typography;
const DetailDoctorPage = () => {
    const { id } = useParams(); // id ở đây chính là từ /user/:id
    const [timeSlots, setTimeSlots] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const appointment = useSelector((state) => state.appointment);
    const user = useSelector((state) => state.auth.user);
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
        if (workingSchedules && workingSchedules?.data?.length > 0) {
            const schedule = workingSchedules.data[0];
            dispatch(updateAppointment({
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
        } else {
            // Nếu không có lịch làm việc reset appointment
            dispatch(setAppointment({
                schedule: null,
                selectedDate: null,
                selectedTime: null,
            }));
            setTimeSlots([]);
            Message.info("Bác sĩ chưa có lịch làm việc")
        }
    }, [workingSchedules]);
    useEffect(() => {
        if (doctor && doctor?.data) {
            // Cập nhật thông tin bác sĩ vào appointment nếu có
            dispatch(updateAppointment({
                doctor: doctor.data,
            }));
        } else {
            // Nếu không có thông tin bác sĩ, reset appointment
            dispatch(setAppointment({
                doctor: null,
            }));
        }
    }, [doctor]);


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
        setTimeSlots(timeSlots);
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
        if (!user?.access_token) {
            navigate("/authentication", {
                state: {
                    status: "info",
                    message: "Vui lòng đăng nhập để đặt lịch khám",
                }
            })
            return;
        }
        dispatch(updateAppointment({ selectedTime: time }));
        navigate("/booking");
    }
    const handleBookingDoctor = () => {
        if (!user?.access_token) {
            navigate("/authentication", {
                state: {
                    status: "info",
                    message: "Vui lòng đăng nhập để đặt lịch khám",
                }
            })
            return;
        }
        navigate("/booking")
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
                        {workingSchedules && workingSchedules?.data?.length > 0 ? (
                            <WorkingSchedule
                                selectedDate={appointment.selectedDate}
                                isLoading={isLoadingWorkingSchedule}
                                workingSchedules={workingSchedules}
                                handleCreateWorkingTime={handleCreateWorkingTime}
                            />
                        ) : (
                            <Text type="secondary">Bác sĩ chưa cập nhật lịch làm việc</Text>
                        )}

                    </div>

                    {/* Giờ làm việc */}
                    <div>
                        <Title level={4}>Chọn khung giờ</Title>
                        {timeSlots.length > 0 ? (
                            <TimeSlot
                                timeSlots={timeSlots}
                                selectedDate={appointment.selectedDate}
                                selectedTime={appointment.selectedTime}
                                handleCheckTime={handleCheckTime}
                                handleSelectedTime={handleSelectedTime}
                            />
                        ) : (
                            <Text type="secondary">Không có khung giờ làm việc cho ngày này</Text>
                        )}
                    </div>

                    <div>
                        <Title level={4}>Giới thiệu</Title>
                        <Text>{doctor?.data?.description}</Text>
                        {/* <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                            <Text>• Giảng viên Trường ĐH Y Dược TP.HCM</Text>
                            <Text>• Kinh nghiệm hơn 15 năm trong ngành tim mạch</Text>
                        </div> */}
                    </div>
                    <div>
                        <Title level={4}>Địa chỉ : {doctor?.data?.hospital?.address}</Title>
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
                            onClick={handleBookingDoctor}
                            disabled={!appointment.doctor || !appointment.schedule}
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