import { useMutation, useQuery } from "@tanstack/react-query";
import * as WorkingScheduleService from "../services/WorkingScheduleService";
import { handleMutationResponse } from "../utils/mutationHandlers";
import { useState, useEffect } from "react";
import * as Message from "../components/Message/Message";

export const useWorkingScheduleData = ({
    setIsModalOpenCreate,
    setIsDrawerOpen,
    setIsModalOpenDeleteMany,
    setIsModalOpenDelete,
    setSelectedRowKeys,
    setRowSelected,
}) => {
    const [mutationResult, setMutationResult] = useState(null);

    const queryGetAllWorkingSchedules = useQuery({
        queryKey: ["getAllWorkingSchedules"],
        queryFn: WorkingScheduleService.getAllWorkingSchedules,
        retry: 1,
    });
    const useGetWorkingScheduleByDoctor = (doctorId) => useQuery({
        queryKey: ["getWorkingScheduleByDoctor", doctorId],
        queryFn: () => WorkingScheduleService.getWorkingScheduleByDoctor(doctorId),
        enabled: !!doctorId, // chỉ chạy khi doctorId có giá trị
        retry: 1,
    });

    const mutationCreateWorkingSchedule = useMutation({
        mutationKey: ["createWorkingSchedule"],
        mutationFn: WorkingScheduleService.createWorkingSchedule,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                closeModal: () => setIsModalOpenCreate(false),
                refetchQuery: queryGetAllWorkingSchedules.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        },
    });

    const mutationDeleteWorkingSchedule = useMutation({
        mutationKey: ["deleteWorkingSchedule"],
        mutationFn: WorkingScheduleService.deleteWorkingSchedule,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setRowSelected(null),
                closeModal: () => setIsModalOpenDelete(false),
                refetchQuery: queryGetAllWorkingSchedules.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    });

    const mutationUpdateWorkingSchedule = useMutation({
        mutationKey: ["updateWorkingSchedule"],
        mutationFn: ({ id, ...formData }) => WorkingScheduleService.updateWorkingSchedule(id, formData),
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setRowSelected(null),
                closeDrawer: () => setIsDrawerOpen(false),
                refetchQuery: queryGetAllWorkingSchedules.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    });

    const mutationDeleteManyWorkingSchedules = useMutation({
        mutationKey: ["deleteManyWorkingSchedules"],
        mutationFn: WorkingScheduleService.deleteManyWorkingSchedules,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setSelectedRowKeys([]),
                closeModal: () => setIsModalOpenDeleteMany(false),
                refetchQuery: queryGetAllWorkingSchedules.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    });

    // Hiển thị thông báo kết quả mutation
    useEffect(() => {
        if (mutationResult) {
            if (mutationResult.success) {
                Message.success(mutationResult.message);
            } else {
                Message.error(mutationResult.message);
            }
            setMutationResult(null); // Reset sau khi hiển thị
        }
    }, [mutationResult]);

    return {
        queryGetAllWorkingSchedules,
        useGetWorkingScheduleByDoctor,
        mutationCreateWorkingSchedule,
        mutationDeleteWorkingSchedule,
        mutationUpdateWorkingSchedule,
        mutationDeleteManyWorkingSchedules,
        // mutationInsertManyWorkingSchedules, // Uncomment nếu sau này có thêm
    };
};
