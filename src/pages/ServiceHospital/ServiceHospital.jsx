
import { Space, Typography } from 'antd'
import CardDoctor from '../../components/CardDoctor/CardDoctor'
import CardSpecialty from '../../components/CardSpecialty/CardSpecialty'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateAppointment } from '../../redux/Slice/appointmentSlice'
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
            <Title level={4} style={{ marginBottom: '16px' }}>Danh sách bác sĩ</Title>
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
                <Text>Chưa có bác sĩ nào</Text >
            )}
            <Title level={4} style={{ margin: '16px 0px' }}>Danh sách chuyên khoa</Title>
            {specialties && specialties.length > 0 ? (
                specialties.map((specialty) => (
                    <CardSpecialty
                        key={specialty._id}
                        specialty={specialty}
                        isSelected={false}
                        onClick={() => navigate(`/search?specialty=${specialty._id}`)}
                    />
                ))
            ) : (
                <Text>Chưa có chuyên khoa nào</Text>
            )}
        </div>
    )
}

export default ServiceHospital