import { useMutation, useQuery } from "@tanstack/react-query";
import * as DoctorService from "../services/DoctorService";
import { handleMutationResponse } from "../utils/mutationHandlers";
import { useState, useEffect } from "react";
import * as Message from "../components/Message/Message";

export const useDoctorData = ({
    setIsModalOpenCreate,
    setIsDrawerOpen,
    setIsModalOpenDeleteMany,
    setIsModalOpenDelete,
    setSelectedRowKeys,
    setRowSelected,
}) => {
    const [mutationResult, setMutationResult] = useState(null);

    const queryGetAllDoctors = useQuery({
        queryKey: ["getAllDoctors"],
        queryFn: DoctorService.getAllDoctors,
        retry: 1,
    });

    const mutationCreateDoctor = useMutation({
        mutationKey: ["createDoctor"],
        mutationFn: DoctorService.createDoctor,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                closeModal: () => setIsModalOpenCreate(false),
                refetchQuery: queryGetAllDoctors.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        },
    });

    const mutationDeleteDoctor = useMutation({
        mutationKey: ["deleteDoctor"],
        mutationFn: DoctorService.deleteDoctor,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setRowSelected(null),
                closeModal: () => setIsModalOpenDelete(false),
                refetchQuery: queryGetAllDoctors.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    });

    const mutationUpdateDoctor = useMutation({
        mutationKey: ["updateDoctor"],
        mutationFn: ({ id, formData }) => DoctorService.updateDoctor(id, formData),
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setRowSelected(null),
                closeDrawer: () => setIsDrawerOpen(false),
                refetchQuery: queryGetAllDoctors.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    });

    const mutationDeleteManyDoctors = useMutation({
        mutationKey: ["deleteManyDoctors"],
        mutationFn: DoctorService.deleteManyDoctors,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setSelectedRowKeys([]),
                closeModal: () => setIsModalOpenDeleteMany(false),
                refetchQuery: queryGetAllDoctors.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    });

    // Hiển thị message phản hồi sau mutation
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
        queryGetAllDoctors,
        mutationCreateDoctor,
        mutationDeleteDoctor,
        mutationUpdateDoctor,
        mutationDeleteManyDoctors,
        // mutationInsertManyDoctors, // Uncomment nếu cần dùng
    };
};
