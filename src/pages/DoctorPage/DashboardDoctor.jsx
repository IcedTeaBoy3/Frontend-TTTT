
import { useDispatch } from 'react-redux'
import { setDoctor } from '../../redux/Slice/doctorSlice'
import * as DoctorService from '../../services/DoctorService'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
const DashboardDoctor = () => {
    const dispatch = useDispatch();

    const queryGetDoctor = useQuery({
        queryKey: ['getDoctor'],
        queryFn: DoctorService.getDoctorByUserId,

    });
    const { data: doctor, isLoading: isLoadingDoctor } = queryGetDoctor;
    useEffect(() => {
        if (doctor && doctor.data) {
            dispatch(setDoctor({
                doctorId: doctor.data._id,
                hospital: doctor.data.hospital,
                specialties: doctor.data.specialties,
                position: doctor.data.position,
                qualification: doctor.data.qualification,
                yearExperience: doctor.data.yearExperience,
                detailExperience: doctor.data.detailExperience,
                description: doctor.data.description,
            }));
        }
    }, [doctor, dispatch]);

    return (
        <div>DashboardDoctor</div>
    )
}

export default DashboardDoctor