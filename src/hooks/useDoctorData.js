import { useMutation, useQuery } from "@tanstack/react-query";
import * as DoctorService from "../services/DoctorService";
import { handleMutationResponse, handleMutationError } from "../utils/mutationHandlers";
export const useDoctorData = ({
    setIsModalOpenCreate,
    setIsDrawerOpen,
    setIsModalOpenDeleteMany,
    setIsModalOpenDelete,
    setSelectedRowKeys,
    setRowSelected,
}) => {
    const queryGetAllDoctors = useQuery({
        queryKey: ["getAllDoctors"],
        queryFn: DoctorService.getAllDoctors,
        retry: 1,
    });

    const mutationCreateDoctor = useMutation({
        mutationKey: ["createDoctor"],
        mutationFn: DoctorService.createDoctor,
        onSuccess: (data) => handleMutationResponse(data, {
            closeModal: () => setIsModalOpenCreate(false),
            refetchQuery: queryGetAllDoctors.refetch,
        }),
        onError: handleMutationError,
    })

    const mutationDeleteDoctor = useMutation({
        mutationKey: ["deleteDoctor"],
        mutationFn: DoctorService.deleteDoctor,
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setRowSelected(null),
            closeModal: () => setIsModalOpenDelete(false),
            refetchQuery: queryGetAllDoctors.refetch,
        }),
        onError: handleMutationError,
    });

    const mutationUpdateDoctor = useMutation({
        mutationKey: ["updateDoctor"],
        mutationFn: ({ id, ...formData }) => DoctorService.updateDoctor(id, formData),
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setRowSelected(null),
            closeDrawer: () => setIsDrawerOpen(false),
            refetchQuery: queryGetAllDoctors.refetch,
        }),
        onError: handleMutationError,
    });

    const mutationDeleteManyDoctors= useMutation({
        mutationKey: ["deleteManyDoctors"],
        mutationFn: DoctorService.deleteManyDoctors,
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setSelectedRowKeys([]),
            closeModal: () => setIsModalOpenDeleteMany(false),
            refetchQuery: queryGetAllDoctors.refetch,
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
        queryGetAllDoctors,
        mutationCreateDoctor,
        mutationDeleteDoctor,
        mutationUpdateDoctor,
        mutationDeleteManyDoctors,
        // mutationInsertManyDoctors,
    };
};