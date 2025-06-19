
import DefaultLayout from '../../components/DefaultLayout/DefaultLayout'
import { Steps, Typography, Avatar, Flex, Divider, Input, Card } from 'antd'
import { useSelector } from 'react-redux'
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined, FieldTimeOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { addMinutesToTime } from '../../utils/timeUtils'
import { formatDateToDDMMYYYY } from '../../utils/dateUtils'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import WorkingSchedule from '../../components/WorkingSchedule/WorkingSchedule'
import { Collapse } from "antd";
import { useState, useEffect } from 'react';
import * as WorkingScheduleService from '../../services/WorkingScheduleService'
import * as AppointmentService from '../../services/AppointmentService'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { updateAppointment, setAppointment } from '../../redux/Slice/appointmentSlice'
import { updateUser } from '../../redux/Slice/authSlice'
import TimeSlot from '../../components/TimeSlot/TimeSlot'
import { useNavigate, useLocation } from 'react-router-dom'
import ModalUpdateUser from '../../components/ModalUpdateUser/ModalUpdateUser'
import * as Message from '../../components/Message/Message';
import * as UserService from '../../services/UserService';
import * as HospitalService from '../../services/HospitalService'
import dayjs from 'dayjs'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import CardSpecialty from '../../components/CardSpecialty/CardSpecialty'
import { convertGender } from '../../utils/convertGender'
import { BookingPageContainer, LeftContent, RightContent, WrapperDoctorInfo, WrapperAppointmentInfo } from './style'
import CardDoctor from '../../components/CardDoctor/CardDoctor'

const { Title, Text } = Typography;
const BookingPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type'); // sẽ là "hospital"

    const isHospital = type === 'hospital';
    const hospitalId = queryParams.get('hospitalId'); // nếu là bệnh viện thì sẽ có hospitalId
    const doctor = useSelector((state) => state.appointment.doctor);
    const hospital = useSelector((state) => state.appointment.hospital);
    const patient = useSelector((state) => state.auth.user);
    const appointment = useSelector((state) => state.appointment);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [timeSlots, setTimeSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [activeKey, setActiveKey] = useState(!doctor ? ['0'] : !appointment?.specialty ? ['1'] : !appointment?.selectedTime ? ['2'] : ['3']);
    const [isLoaded, setIsLoaded] = useState(false); // Đánh dấu dã load xong dữ liệu
    const [currentStep, setCurrentStep] = useState(!doctor ? 0 : !appointment?.specialty ? 1 : !appointment?.selectedTime ? 2 : 3);
    const onChange = key => {
        setActiveKey(key);
    };
    const queryGetAllDoctorsHospital = useQuery({
        queryKey: ["getAllDoctorsHospital", hospitalId],
        queryFn: () => HospitalService.getAllDoctorsHospital(hospitalId),
        enabled: isHospital && !!hospitalId,
    })
    const queryGetWorkingScheduleByDoctor = useQuery({
        queryKey: ["getWorkingScheduleByDoctor", doctor?._id],
        queryFn: () => WorkingScheduleService.getWorkingScheduleByDoctor(doctor?._id),
        enabled: !!doctor?._id
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
                setCurrentStep(3); // Nếu là bệnh viện thì chuyển về bước chọn chuyên khoa, nếu không thì chuyển về bước chọn bác sĩ
                setActiveKey(['4']);
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
    const mutationCreateAppointment = useMutation({
        mutationFn: (data) => {
            return AppointmentService.createAppointment(data);
        },
        onSuccess: (res) => {
            if (res?.status === "success") {
                Message.success(res?.message);
                setCurrentStep(isHospital ? 4 : 3);
                dispatch(updateAppointment({
                    stt: res?.data?.stt,
                }))
                navigate('/booking-success?type=' + (isHospital ? 'hospital' : 'doctor'));
            } else if (res?.status === "error") {
                setAvailableSlots(res?.availableSlots || []);
                dispatch(updateAppointment({
                    selectedTime: null,

                }));
                setCurrentStep(isHospital ? 2 : 1); // Nếu là bệnh viện thì chuyển về bước chọn ngày khám, nếu không thì chuyển về bước chọn giờ khám
                setActiveKey(['2']);
                Message.error(res?.message);
            }
            setIsLoaded(true); // Đánh dấu đã load xong
        },
        onError: (error) => {
            Message.error("Có lỗi xảy ra " + error?.message);
            setIsLoaded(true); // cũng đánh dấu xong để tránh disable toàn bộ
        }
    })
    const { data: doctors, isLoading: isLoadingDoctor } = queryGetAllDoctorsHospital
    const { data: workingSchedules, isLoading: isLoadingWorkingSchedule } = queryGetWorkingScheduleByDoctor
    const { isPending: isPendingCreate } = mutationCreateAppointment
    const { isPending: isPendingUpdateProfile } = mutationUpdateUpdateProfile

    const handleCreateWorkingTime = (schedule) => {
        if (!schedule?.startTime || !schedule?.endTime || !schedule?.workDate || !schedule.workDate) return;
        const timeSlots = generateTimeSlots(schedule.startTime, schedule.endTime, schedule.shiftDuration);
        setIsLoaded(false); // reset loading
        setTimeSlots(timeSlots);
        dispatch(updateAppointment({ selectedDate: schedule.workDate }));
    };
    useEffect(() => {
        if (workingSchedules?.data && workingSchedules.data.length > 0) {
            const schedule = workingSchedules.data[0];
            dispatch(updateAppointment({ schedule }));
            handleCreateWorkingTime(schedule);
        } else {
            dispatch(updateAppointment({
                selectedDate: null,
                selectedTime: null,
                schedule: null,
            }));
            setTimeSlots([]);
        }
    }, [workingSchedules])

    useEffect(() => {
        if (appointment?.selectedDate && Array.isArray(workingSchedules?.data)) {
            const schedule = workingSchedules.data.find(item => dayjs(item?.workDate).isSame(dayjs(appointment.selectedDate), 'day'));
            dispatch(updateAppointment({ schedule }));
            if (schedule) {
                handleCreateWorkingTime(schedule);
            }
        }
    }, [appointment.selectedDate]);
    function generateTimeSlots(start, end, duration = 30) {
        const slots = [];
        if (!start || !end) return slots;

        const [startHour, startMin] = start.split(':').map(Number);
        const [endHour, endMin] = end.split(':').map(Number);

        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;

        if (startTime >= endTime) return slots; // ⛔ Không tạo slot nếu giờ bắt đầu >= giờ kết thúc

        for (let time = startTime; time + duration <= endTime; time += duration) {
            const h = Math.floor(time / 60);
            const m = time % 60;
            slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }

        return slots;
    }

    // function canSelectSlot(selectedDate, time, availableSlots, now = dayjs()) {
    //     if (!selectedDate || !time) return false;
    //     const selectedDay = dayjs(selectedDate).startOf('day');
    //     const fullSelectedTime = dayjs(`${selectedDay.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm');
    //     const isToday = selectedDay.isSame(now, 'day');
    //     const isTooClose = fullSelectedTime.diff(now, 'minute') < 60;

    //     return availableSlots.includes(time) && (!isToday || !isTooClose);
    // }
    const handleCheckTime = (selectedDate, time) => {
        if (!selectedDate || !time) return false;
        const selectedDay = dayjs(selectedDate).utc().local(); // selectedDate đã là local (vì là từ schedule)
        const now = dayjs();

        // Nếu ngày được chọn KHÔNG PHẢI hôm nay → cho phép (không disable)
        if (!selectedDay.isSame(now, 'day')) return false;

        // Ghép ngày và giờ lại để kiểm tra khoảng cách thời gian
        const fullSelectedTime = dayjs(`${selectedDay.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm');

        // Nếu khung giờ < 60 phút so với hiện tại → disable
        return fullSelectedTime.diff(now, 'minute') < 60 * 4;
    };
    const handleSelectedTime = (time) => {
        setCurrentStep(isHospital ? 3 : 2); // Nếu là bệnh viện thì chuyển về bước chọn giờ khám, nếu không thì chuyển về bước chọn chuyên khoa
        setActiveKey(['3']); // Mở tab chọn giờ khám
        // Cập nhật giờ khám đã chọn
        dispatch(updateAppointment({ selectedTime: time }));
    }
    const handleEditProfile = () => {
        setActiveKey(['3']); // Mở tab Hồ sơ bệnh nhân
        setIsModalOpen(true);
    }
    const handleUpdateProfile = (data) => {
        mutationUpdateUpdateProfile.mutate(data);
    }
    const handleBookingSchedule = () => {
        if (!doctor) {
            Message.info("Vui lòng chọn bác sĩ trước khi đặt lịch khám");
            setCurrentStep(isHospital ? 0 : 1);
            setActiveKey(isHospital ? ['0'] : ['1']);
            return;
        }
        if (!appointment?.specialty) {
            Message.info("Vui lòng chọn chuyên khoa trước khi đặt lịch khám");
            setCurrentStep(isHospital ? 1 : 2);
            setActiveKey(isHospital ? ['1'] : ['2']);
            return;
        }
        if (!appointment?.selectedTime) {
            Message.info("Vui lòng chọn giờ khám trước khi đặt lịch");
            setCurrentStep(isHospital ? 2 : 3);
            setActiveKey(isHospital ? ['2'] : ['3']);
            return;
        }

        const { name, email, phone, dateOfBirth, gender, address, ethnic, idCard, insuranceCode, job } = patient;
        if (!name || !email || !phone || !dateOfBirth || !gender || !address || !idCard) {
            Message.info("Vui lòng cập nhật hồ sơ bệnh nhân trước khi đặt lịch khám");
            setCurrentStep(isHospital ? 3 : 4); // Nếu là bệnh viện thì chuyển về bước Hồ sơ bệnh nhân, nếu không thì chuyển về bước Lý do khám
            setActiveKey(isHospital ? ['3'] : ['4']);
            handleEditProfile();
            return;
        }
        if (!reason) {
            Message.info("Vui lòng nhập lý do khám bệnh trước khi đặt lịch");
            setCurrentStep(4);
            setActiveKey(['4']);
            return;
        }
        dispatch(updateAppointment({
            reason: reason,
        }))

        const appointmentData = {
            patientId: patient.id,
            doctorId: doctor._id,
            specialtyId: appointment.specialty?._id,
            scheduleId: appointment.schedule._id,
            timeSlot: appointment.selectedTime,
            reason: reason,
            type: 'doctor', // Đặt type là doctor nếu không phải bệnh viện
        };
        if (isHospital) {
            appointmentData.hospitalId = hospital._id; // Thêm thông tin bệnh viện nếu là bệnh viện
            appointmentData.type = 'hospital'; // Đặt type là hospital
        }
        mutationCreateAppointment.mutate(appointmentData);

    }
    const itemsStep = [
        isHospital && {
            title: 'Chọn bác sĩ',
            icon: <UsergroupAddOutlined />,
        },
        {
            title: 'Chọn chuyên khoa',
            icon: <UserOutlined />,
        },
        {
            title: 'Thời gian khám',
            icon: <FieldTimeOutlined />,
        },
        {
            title: 'Thông tin bệnh nhân',
            icon: <SolutionOutlined />,
        },
        {
            title: 'Hoàn tất',
            icon: <SmileOutlined />,
        },
    ].filter(Boolean); // Loại bỏ các mục undefined nếu không phải là bệnh viện
    const items = [

        isHospital && {
            key: '0',
            label: 'Chọn bác sĩ',
            children: (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Text strong>Chọn bác sĩ</Text>
                    {doctors && doctors?.data?.length > 0 ? (
                        (
                            doctors.data.map((doctor) => (
                                <CardDoctor
                                    key={doctor._id}
                                    doctor={doctor}
                                    isSelected={appointment.doctor?._id === doctor._id}
                                    onClick={() => {
                                        dispatch(updateAppointment({ doctor }));
                                        setCurrentStep(isHospital ? 1 : 0); // Nếu là bệnh viện thì chuyển về bước chọn chuyên khoa, nếu không thì chuyển về bước chọn giờ khám
                                        setActiveKey(['1']);// Mở tab chọn chuyên khoa
                                    }}
                                >
                                </CardDoctor>
                            ))
                        )
                    ) : (
                        <Text type="secondary">Chưa có bác sĩ nào cho phòng khám</Text>
                    )}
                </div>
            )
        },
        {
            key: '1',
            label: 'Chọn chuyên khoa',
            children: (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Text strong>Chọn chuyên khoa</Text>
                    {doctor?.specialties && doctor?.specialties.length > 0 ? (
                        doctor.specialties.map((specialty) => (
                            <CardSpecialty
                                key={specialty._id}
                                specialty={specialty}
                                isSelected={appointment.specialty?._id === specialty._id}
                                onClick={() => {
                                    dispatch(updateAppointment({ specialty }));
                                    setCurrentStep(isHospital ? 2 : 1); // Nếu là bệnh viện thì chuyển về bước chọn ngày khám, nếu không thì chuyển về bước chọn giờ khám
                                    setActiveKey(['2']);
                                }}
                            />
                        ))
                    ) : (
                        <Text type="secondary">Bác sĩ này không có chuyên khoa nào</Text>
                    )}
                </div>
            )
        },
        {
            key: '2',
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
                    {workingSchedules && workingSchedules?.data?.length > 0 ? (
                        <WorkingSchedule
                            workingSchedules={workingSchedules}
                            isLoading={isLoadingWorkingSchedule}
                            timeSlots={timeSlots}
                            selectedDate={appointment.selectedDate}
                            handleCreateWorkingTime={handleCreateWorkingTime}
                        />
                    ) : (
                        <Text type="secondary">Không có lịch làm việc cho bác sĩ này</Text>
                    )}

                    <Text strong>Chọn giờ khám</Text>
                    {timeSlots && timeSlots.length > 0 ? (
                        <TimeSlot
                            timeSlots={timeSlots}
                            selectedTime={appointment.selectedTime}
                            selectedDate={appointment.selectedDate}
                            schedule={appointment.schedule}
                            handleCheckTime={handleCheckTime}
                            handleSelectedTime={handleSelectedTime}
                        />
                    ) : (
                        <Text type="secondary">Không có khung giờ khám nào khả dụng</Text>
                    )}
                </div>
            ),
        },
        {
            key: '3',
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
                        <Text>{patient?.name || '--'}</Text>
                    </Flex>
                    <Flex justify='space-between' align='center' style={{ paddingBottom: "12px", borderBottom: "1px solid #f0f0f0" }}>

                        <Text strong>Giới tính</Text>
                        <Text>{convertGender(patient?.gender) || '--'}</Text>
                    </Flex>
                    <Flex justify='space-between' align='center' style={{ paddingBottom: "12px", borderBottom: "1px solid #f0f0f0" }}>
                        <Text strong>Ngày sinh</Text>
                        <Text>{formatDateToDDMMYYYY(patient?.dateOfBirth) || '--'}</Text>
                    </Flex>
                    <Flex justify='space-between' align='center' style={{ paddingBottom: "12px", borderBottom: "1px solid #f0f0f0" }}>

                        <Text strong>Số điện thoại</Text>
                        <Text>{patient?.phone || '--'}</Text>
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
            key: '4',
            label: 'Lý do khám bệnh ( tiền sử bệnh, triệu chứng,...)',
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
    ].filter(Boolean);
    const truncateText = (text, maxLength = 15) => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };
    return (
        <DefaultLayout>
            <BookingPageContainer>
                <Card>
                    <Steps
                        current={currentStep}
                        items={itemsStep}
                    />
                </Card>
                <Divider />
                <Flex
                    justify="space-between"
                    align="start"
                    gap={24}
                    wrap="wrap"
                >

                    <LeftContent>

                        <Collapse

                            onChange={onChange}
                            activeKey={activeKey}
                            items={items}
                        />


                    </LeftContent>
                    <RightContent
                    >
                        <Title level={4} style={{ marginBottom: 20 }}>Thông tin đặt khám</Title>

                        {/* Doctor info */}

                        <WrapperDoctorInfo
                        >

                            <Avatar size={56} icon={<UserOutlined />} src={isHospital ? `${import.meta.env.VITE_APP_BACKEND_URL}${hospital?.thumbnail}` : `${import.meta.env.VITE_APP_BACKEND_URL}${doctor?.user?.avatar}`} />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <Text strong style={{ fontSize: "18px" }}>
                                    {isHospital
                                        ? `Phòng khám ${truncateText(hospital?.name)}`
                                        : `Bác sĩ ${truncateText(doctor?.user?.name)}`}
                                </Text>
                                <Text type="secondary">{isHospital ? truncateText(hospital.address) : truncateText(doctor?.hospital?.address)}</Text>
                            </div>
                        </WrapperDoctorInfo>


                        {/* Appointment info */}
                        <WrapperAppointmentInfo>
                            {isHospital && (
                                <Flex justify="space-between" align="center">
                                    <Text strong style={{ fontSize: "16px" }}>👨‍⚕️ Bác sĩ </Text>
                                    {doctor ? (
                                        <Text strong style={{ fontSize: "16px", color: "#1677ff" }}>
                                            {doctor?.user?.name || "--"}
                                        </Text>
                                    ) : (
                                        <ButtonComponent
                                            type="primary"
                                            size="small"
                                            onClick={() => {
                                                if (!doctor) {
                                                    Message.info("Vui lòng chọn bác sĩ trước");
                                                    return;
                                                }
                                                setCurrentStep(0);
                                                setActiveKey(['0']);
                                            }}
                                        >
                                            Chọn bác sĩ
                                        </ButtonComponent>
                                    )}
                                </Flex>
                            )}
                            {/* Chuyên khoa */}

                            <Flex justify="space-between" align="center">
                                <Text style={{ fontSize: "16px" }}>🩺 Chuyên khoa</Text>
                                <Text strong style={{ fontSize: "16px", color: "#1677ff" }}>
                                    {appointment?.specialty?.name || "--"}
                                </Text>
                            </Flex>


                            {/* Hospital info */}

                            <Flex justify="space-between" align="center">
                                <Text style={{ fontSize: "16px" }}>🗓️ Ngày khám</Text>
                                <Text strong style={{ fontSize: "16px", color: "#1677ff" }}>
                                    {formatDateToDDMMYYYY(appointment?.selectedDate) || "--"}
                                </Text>
                            </Flex>

                            <Flex justify="space-between" align="center">
                                <Text style={{ fontSize: "16px" }}>🕒 Giờ khám</Text>
                                {dayjs(appointment?.selectedTime, ['H:mm', 'HH:mm'], true).isValid() ? (
                                    <Text strong style={{ fontSize: "16px", color: "#52c41a" }}>
                                        {`${appointment?.selectedTime} - ${addMinutesToTime(appointment?.selectedTime, appointment?.schedule?.shiftDuration)}`}
                                    </Text>
                                ) : (
                                    <Text strong type="danger" style={{ fontSize: "16px" }}>
                                        --
                                    </Text>
                                )}
                            </Flex>

                            <Flex justify="space-between" align="center">
                                <Text style={{ fontSize: "16px" }}>👤 Bệnh nhân</Text>
                                <Text strong style={{ fontSize: "16px" }}>{patient?.name}</Text>
                            </Flex>
                        </WrapperAppointmentInfo>
                        <LoadingComponent
                            isLoading={isPendingCreate}
                        >

                            <ButtonComponent
                                type="primary"
                                size="large"
                                style={{ width: "100%", borderRadius: 8 }}
                                disabled={!appointment?.selectedTime}
                                onClick={handleBookingSchedule}
                            >
                                Đặt lịch
                            </ButtonComponent>
                        </LoadingComponent>
                    </RightContent>
                </Flex>
            </BookingPageContainer>
            <ModalUpdateUser
                isModalOpen={isModalOpen}
                patient={patient}
                handleUpdateProfile={handleUpdateProfile}
                isPendingUpdateProfile={isPendingUpdateProfile}
                onCancel={() => setIsModalOpen(false)}
            >

            </ModalUpdateUser>

        </DefaultLayout >
    )
}

export default BookingPage