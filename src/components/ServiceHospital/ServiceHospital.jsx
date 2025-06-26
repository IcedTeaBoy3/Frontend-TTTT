
import { Space, Typography } from 'antd'
import CardDoctor from '../CardDoctor/CardDoctor'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateAppointment } from '../../redux/Slice/appointmentSlice'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { CheckCircleOutlined } from '@ant-design/icons'
const { Title, Text } = Typography
const ServiceHospital = ({ doctors, hospitalId }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleBooking = (doctor) => {
        dispatch(updateAppointment({ doctor: doctor }))
        navigate('/booking?type=hospital&hospitalId=' + hospitalId)
    }
    // Gộp chuyên khoa từ danh sách bác sĩ
    // doctors là một mảng các bác sĩ, mỗi bác sĩ có thể có nhiều chuyên khoa
    const specialties = doctors.reduce((acc, doctor) => {
        if (doctor.specialties && doctor.specialties.length > 0) {
            doctor.specialties.forEach((specialty) => {
                if (!acc.some((s) => s._id === specialty._id)) {
                    acc.push(specialty)
                }
            })
        }
        return acc
    }, [])
    return (
        <div style={{ margin: '16px 0px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>Đội ngũ bác sĩ</Title>
            {doctors && doctors.length > 0 ? (
                doctors.map((doctor) => (
                    <CardDoctor
                        key={doctor._id}
                        doctor={doctor}
                        isClinic={false}
                        onClick={() => handleBooking(doctor)}
                    />
                ))
            ) : (
                <Text type='secondary'>Chưa có bác sĩ nào</Text >
            )}
            <Title level={4} style={{ margin: '16px 0px' }}>Chuyên khoa khám</Title>
            {specialties && specialties.length > 0 ? (
                <Space wrap>
                    {specialties.map((specialty) => (
                        <ButtonComponent
                            key={specialty._id}
                            type="default"
                            onClick={() => navigate(`/search?type=all&specialtyId=${specialty._id}`)}
                            icon={<CheckCircleOutlined />}
                            styleButton={{
                                margin: '4px',
                                backgroundColor: '#f0f0f0',
                            }}
                        >
                            {specialty.name}
                        </ButtonComponent>
                    ))}
                </Space>
            ) : (
                <Text type='secondary'>Chưa có chuyên khoa nào</Text>
            )}
        </div>
    )
}

export default ServiceHospital