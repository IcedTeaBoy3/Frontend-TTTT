
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DefaultLayout from '../../components/DefaultLayout/DefaultLayout';
import { Avatar } from 'antd';
import { Typography, Divider, Tag } from 'antd';
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
import { Container, ContentBox, DoctorInfo, InfoSection, StickyFooter, Hotline, StyledIframe, BookingButton } from './style';
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
            // Nếu có lịch làm việc trong tương lai, lấy lịch đầu tiên
            const schedule = workingSchedules?.data[0];
            dispatch(updateAppointment({
                schedule: schedule,
            }));
            handleCreateWorkingTime(schedule);
        } else {
            // Nếu không có lịch làm việc reset appointment
            dispatch(setAppointment({
                schedule: null,
                selectedDate: null,
                selectedTime: null,
            }));
            setTimeSlots([]);
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
        if (!schedule.startTime || !schedule.endTime || !schedule.workDate) return;
        const timeSlots = generateTimeSlots(schedule.startTime, schedule.endTime);
        setTimeSlots(timeSlots);
        dispatch(updateAppointment({ selectedDate: schedule.workDate }))
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
        return fullSelectedTime.diff(now, 'minute') < 60;
    };
    const handleSelectedTime = (time) => {
        dispatch(updateAppointment({ selectedTime: time }));
        navigate("/booking");
    }
    const handleBookingDoctor = () => {
        navigate("/booking?type=doctor");
    }
    return (
        <DefaultLayout>
            <Container>
                <ContentBox>
                    <DoctorInfo>
                        <Avatar size={170} src={doctor?.data?.user?.avatar} />
                        <InfoSection>
                            <Title level={3}>
                                {doctor?.data?.qualification} Bác sĩ {doctor?.data?.user?.name || "Chưa cập nhật"}
                            </Title>
                            <div>
                                <Title level={4} style={{ fontSize: 18, color: "#1890ff" }}>
                                    <CheckCircleOutlined /> Bác sĩ <span>{doctor?.data?.experience}</span>
                                </Title>
                                <Text type="secondary">Chuyên khoa:</Text>{" "}
                                <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
                                    {doctor?.data?.specialties?.map((item) =>
                                        <Tag
                                            key={item._id}
                                            color='blue'
                                            onClick={() => navigate(`/search?specialty=${item._id}`)}
                                            style={{ cursor: "pointer", marginBottom: "5px" }}
                                        >{item.name}
                                        </Tag>)}
                                </Text>
                            </div>

                            <div>
                                <Text type="secondary">Chức vụ:</Text>{" "}
                                <Text strong style={{ fontSize: "18px" }}>
                                    {doctor?.data?.position || "Không có"}
                                </Text>
                            </div>

                            <div>
                                <Text type="secondary">Địa chỉ phòng khám:</Text>{" "}
                                <Text strong style={{ fontSize: "18px" }}>
                                    {doctor?.data?.hospital?.name}
                                </Text>
                            </div>
                        </InfoSection>
                    </DoctorInfo>

                    <Divider />
                    <Title level={4}>Lịch làm việc</Title>
                    {workingSchedules?.data?.length > 0 ? (
                        <WorkingSchedule
                            selectedDate={appointment.selectedDate}
                            isLoading={isLoadingWorkingSchedule}
                            workingSchedules={workingSchedules}
                            handleCreateWorkingTime={handleCreateWorkingTime}
                        />
                    ) : (
                        <Text type="secondary">Bác sĩ chưa cập nhật lịch làm việc</Text>
                    )}

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

                    <div>
                        <Title level={4}>Giới thiệu</Title>
                        <Text style={{ fontSize: '16px' }}>{doctor?.data?.description ? doctor?.data?.description : (
                            <Text type="secondary">Chưa có giới thiệu</Text>
                        )}</Text>
                    </div>

                    <div>
                        <Title level={4} style={{ marginBottom: '16px' }}>Địa chỉ : {doctor?.data?.hospital?.address ? doctor?.data?.hospital?.address : (
                            <Text type="secondary">Chưa có địa chỉ</Text>
                        )}</Title>
                        <StyledIframe
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${doctor?.data?.hospital?.address}&output=embed`}
                        />
                    </div>

                    <Divider />
                    <StickyFooter>
                        <Hotline>
                            <Text strong>Hỗ trợ đặt khám qua hotline:</Text>
                            <Text strong style={{ fontSize: 18, color: "#1890ff" }}>{doctor?.data?.hospital?.phone}</Text>
                        </Hotline>
                        <BookingButton
                            type="primary"
                            size="large"
                            onClick={handleBookingDoctor}
                            disabled={!appointment.doctor || !appointment.schedule}
                        >
                            Đặt lịch khám
                        </BookingButton>
                    </StickyFooter>
                </ContentBox>
            </Container>
        </DefaultLayout >
    )
}

export default DetailDoctorPage