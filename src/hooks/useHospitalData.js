import { useMutation, useQuery } from "@tanstack/react-query";
import * as HospitalService from "../services/HospitalService";
import { handleMutationResponse, handleMutationError } from "../utils/mutationHandlers";
export const useHospitalData = ({
    setIsModalOpenCreate,
    setIsDrawerOpen,
    setIsModalOpenDeleteMany,
    setIsModalOpenDelete,
    setSelectedRowKeys,
    setRowSelected,
}) => {
    const queryGetAllHospitals = useQuery({
        queryKey: ["getAllHospitals"],
        queryFn: HospitalService.getAllHospitals,
        retry: 1,
    });

    const mutationCreateHospital = useMutation({
        mutationKey: ["createHospital"],
        mutationFn: HospitalService.createHospital,
        onSuccess: (data) => handleMutationResponse(data, {
            closeModal: () => setIsModalOpenCreate(false),
            refetchQuery: queryGetAllHospitals.refetch,
        }),
        onError: handleMutationError,
    })

    const mutationDeleteHospital = useMutation({
        mutationKey: ["deleteHospital"],
        mutationFn: HospitalService.deleteHospital,
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setRowSelected(null),
            closeModal: () => setIsModalOpenDelete(false),
            refetchQuery: queryGetAllHospitals.refetch,
        }),
        onError: handleMutationError,
    });

    const mutationUpdateHospital = useMutation({
        mutationKey: ["updateHospital"],
        mutationFn: ({ id, formData }) => HospitalService.updateHospital(id, formData),
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setRowSelected(null),
            closeDrawer: () => setIsDrawerOpen(false),
            refetchQuery: queryGetAllHospitals.refetch,
        }),
        onError: handleMutationError,
    });

    const mutationDeleteManyHospitals= useMutation({
        mutationKey: ["deleteManyHospitals"],
        mutationFn: HospitalService.deleteManyHospitals,
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setSelectedRowKeys([]),
            closeModal: () => setIsModalOpenDeleteMany(false),
            refetchQuery: queryGetAllHospitals.refetch,
        }),
        onError: handleMutationError,
    });

    // const mutationInsertManyDoctors= useMutation({
    //     mutationKey: ["insertManyDoctors"],
    //     mutationFn: DoctorService.insertManyDoctors,
    //     onSuccess: (data) => handleMutationResponse(data, {
    //         refetchQuery: queryGetAllDoctors.refetch,
    //     }),
    //     onError: handleMutationError,
    // });

    return {
        queryGetAllHospitals,
        mutationCreateHospital,
        mutationDeleteHospital,
        mutationUpdateHospital,
        mutationDeleteManyHospitals,
        // mutationInsertManyDoctors,
    };
};