
import { useDispatch } from 'react-redux'
import { setDoctor } from '../../redux/Slice/doctorSlice'
import { useEffect } from 'react'
import * as DoctorService from '../../services/DoctorService'
const DashboardDoctor = () => {
    const dispatch = useDispatch();
    const fetchDoctor = async () => {
        try {
            const doctor = await DoctorService.getDoctorByUserId();
            if (doctor) {
                dispatch(setDoctor({
                    doctorId: doctor.data._id,
                    hospital: doctor.data.hospital,
                    specialties: doctor.data.specialties,
                    position: doctor.data.position,
                    qualification: doctor.data.qualification,
                    experience: doctor.data.experience,
                    description: doctor.data.description
                }));
            }
        } catch (error) {
            console.error("Error fetching doctor by userId:", error);
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, [dispatch]);
    return (
        <div>DashboardDoctor</div>
    )
}

export default DashboardDoctor