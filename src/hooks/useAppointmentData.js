import { useMutation, useQuery } from "@tanstack/react-query";
import * as AppointmentService from "../services/AppointmentService";
import { handleMutationResponse } from "../utils/mutationHandlers";
import { useState, useEffect } from "react";
import * as Message from "../components/Message/Message";

export const useAppointmentData = ({
    setIsModalOpenCreate,
    setIsDrawerOpen,
    setIsModalOpenDeleteMany,
    setIsModalOpenDelete,
    setSelectedRowKeys,
    setRowSelected,
}) => {
    const [mutationResult, setMutationResult] = useState(null);

    const queryGetAllAppointments = useQuery({
        queryKey: ["getAllAppointments"],
        queryFn: AppointmentService.getAllAppointments,
        retry: 1,
    });

    const mutationDeleteAppointment = useMutation({
        mutationKey: ["deleteAppointment"],
        mutationFn: AppointmentService.deleteAppointment,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setRowSelected(null),
                closeModal: () => setIsModalOpenDelete(false),
                refetchQuery: queryGetAllAppointments.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        },
    });

    const mutationUpdateAppointment = useMutation({
        mutationKey: ["updateAppointment"],
        mutationFn: ({ id, ...formData }) => AppointmentService.updateAppointment(id, formData),
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setRowSelected(null),
                closeDrawer: () => setIsDrawerOpen(false),
                refetchQuery: queryGetAllAppointments.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        },
    });

    const mutationDeleteManyAppointments = useMutation({
        mutationKey: ["deleteManyAppointments"],
        mutationFn: AppointmentService.deleteManyAppointments,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setSelectedRowKeys([]),
                closeModal: () => setIsModalOpenDeleteMany(false),
                refetchQuery: queryGetAllAppointments.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        },
    });

    useEffect(() => {
        if (mutationResult) {
            if (mutationResult.success) {
                Message.success(mutationResult.message);
            } else {
                Message.error(mutationResult.message);
            }
            setMutationResult(null);
        }
    }, [mutationResult]);

    return {
        queryGetAllAppointments,
        mutationDeleteAppointment,
        mutationUpdateAppointment,
        mutationDeleteManyAppointments,
    };
};
