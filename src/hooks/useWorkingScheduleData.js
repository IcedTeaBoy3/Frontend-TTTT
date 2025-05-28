import { useMutation, useQuery } from "@tanstack/react-query";
import * as WorkingScheduleService from "../services/WorkingScheduleService";
import { handleMutationResponse, handleMutationError } from "../utils/mutationHandlers";
export const useWorkingScheduleData = ({
    setIsModalOpenCreate,
    setIsDrawerOpen,
    setIsModalOpenDeleteMany,
    setIsModalOpenDelete,
    setSelectedRowKeys,
    setRowSelected,
}) => {
    const queryGetAllWorkingSchedules = useQuery({
        queryKey: ["getAllWorkingSchedules"],
        queryFn: WorkingScheduleService.getAllWorkingSchedules,
        retry: 1,
    });

    const mutationCreateWorkingSchedule= useMutation({
        mutationKey: ["createWorkingSchedule"],
        mutationFn: WorkingScheduleService.createWorkingSchedule,
        onSuccess: (data) => handleMutationResponse(data, {
            closeModal: () => setIsModalOpenCreate(false),
            refetchQuery: queryGetAllWorkingSchedules.refetch,
        }),
        onError: handleMutationError,
    })

    const mutationDeleteWorkingSchedule = useMutation({
        mutationKey: ["deleteWorkingSchedule"],
        mutationFn: WorkingScheduleService.deleteWorkingSchedule,
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setRowSelected(null),
            closeModal: () => setIsModalOpenDelete(false),
            refetchQuery: queryGetAllWorkingSchedules.refetch,
        }),
        onError: handleMutationError,
    });

    const mutationUpdateWorkingSchedule = useMutation({
        mutationKey: ["updateWorkingSchedule"],
        mutationFn: ({ id, ...formData }) => WorkingScheduleService.updateWorkingSchedule(id, formData),
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setRowSelected(null),
            closeDrawer: () => setIsDrawerOpen(false),
            refetchQuery: queryGetAllWorkingSchedules.refetch,
        }),
        onError: handleMutationError,
    });

    const mutationDeleteManyWorkingSchedules= useMutation({
        mutationKey: ["deleteManyWorkingSchedules"],
        mutationFn: WorkingScheduleService.deleteManyWorkingSchedules,
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setSelectedRowKeys([]),
            closeModal: () => setIsModalOpenDeleteMany(false),
            refetchQuery: queryGetAllWorkingSchedules.refetch,
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
        queryGetAllWorkingSchedules,
        mutationCreateWorkingSchedule,
        mutationDeleteWorkingSchedule,
        mutationUpdateWorkingSchedule,
        mutationDeleteManyWorkingSchedules,
        // mutationInsertManyDoctors,
    };
};