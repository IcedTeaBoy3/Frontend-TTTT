import { useMutation, useQuery } from "@tanstack/react-query";
import * as SpecialtyService from "../services/SpecialtyService";
import { handleMutationResponse } from "../utils/mutationHandlers";
import * as Message from "../components/Message/Message";
import { useState, useEffect } from "react";
export const useSpecialtyData = ({
    setIsModalOpenCreate,
    setIsDrawerOpen,
    setIsModalOpenDeleteMany,
    setIsModalOpenDelete,
    setSelectedRowKeys,
    setRowSelected,
}) => {
    const [mutationResult, setMutationResult] = useState(null);
    const queryGetAllSpecialties = useQuery({
        queryKey: ["getAllSpecialties"],
        queryFn: SpecialtyService.getAllSpecialties,
        retry: 1,
    });

    const mutationCreateSpecialty = useMutation({
        mutationKey: ["createSpecialty"],
        mutationFn: SpecialtyService.createSpecialty,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                closeModal: () => setIsModalOpenCreate(false),
                refetchQuery: queryGetAllSpecialties.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    }) 

    const mutationDeleteSpecialty = useMutation({
        mutationKey: ["deleteSpecialty"],
        mutationFn: SpecialtyService.deleteSpecialty,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setRowSelected(null),
                closeModal: () => setIsModalOpenDelete(false),
                refetchQuery: queryGetAllSpecialties.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {   
            setMutationResult({ success: false, message: error.message });
        }
    });

    const mutationUpdateSpecialty = useMutation({
        mutationKey: ["updateSpecialty"],
        mutationFn: ({ id, formData }) => SpecialtyService.updateSpecialty(id, formData),
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setRowSelected(null),
                closeDrawer: () => setIsDrawerOpen(false),
                refetchQuery: queryGetAllSpecialties.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    });

    const mutationDeleteManySpecialties= useMutation({
        mutationKey: ["deleteManySpecialties"],
        mutationFn: SpecialtyService.deleteManySpecialties,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setSelectedRowKeys([]),
                closeModal: () => setIsModalOpenDeleteMany(false),
                refetchQuery: queryGetAllSpecialties.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    });

    const mutationInsertManySpecialties= useMutation({
        mutationKey: ["insertManySpecialties"],
        mutationFn: SpecialtyService.insertManySpecialties,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                refetchQuery: queryGetAllSpecialties.refetch,
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
        queryGetAllSpecialties,
        mutationCreateSpecialty,
        mutationUpdateSpecialty,
        mutationDeleteSpecialty,
        mutationDeleteManySpecialties,
        mutationInsertManySpecialties,
    };
};