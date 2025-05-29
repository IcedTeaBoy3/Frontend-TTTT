import { useMutation, useQuery } from "@tanstack/react-query";
import * as UserService from "../services/UserService";
import { handleMutationResponse } from "../utils/mutationHandlers";
import { useState,useEffect } from "react";
import * as Message from "../components/Message/Message";
export const usePatientData = ({
    setIsOpenDrawer,
    setSelectedRowKeys,
    setRowSelected,
    setIsModalOpenDeleteMany,
    setIsModalOpenDelete,
}) => {
    const [mutationResult, setMutationResult] = useState(null);
    const queryGetAllPatients = useQuery({
        queryKey: ["getAllPatients"],
        queryFn: UserService.getAllUsers,
        retry: 1,
    });

    const mutationDeletePatient = useMutation({
        mutationKey: ["deletePatient"],
        mutationFn: UserService.deleteUser,
        onSuccess: (data) => {
            const result =  handleMutationResponse(data, {
                clearSelection: () => setRowSelected(null),
                closeModal: () => setIsModalOpenDelete(false),
                refetchQuery: queryGetAllPatients.refetch,
            })
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        },
    });

    const mutationUpdatePatient = useMutation({
        mutationKey: ["updatePatient"],
        mutationFn: ({ id, ...data }) => UserService.updateUser(id, data),
        onSuccess: (data) =>  {
            const result = handleMutationResponse(data, {
                clearSelection: () => setRowSelected(null),
                closeDrawer: () => setIsOpenDrawer(false),
                refetchQuery: queryGetAllPatients.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    });

    const mutationDeleteAllPatient = useMutation({
        mutationKey: ["deleteManyPatient"],
        mutationFn: UserService.deleteManyUsers,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setSelectedRowKeys([]),
                closeModal: () => setIsModalOpenDeleteMany(false),
                refetchQuery: queryGetAllPatients.refetch,
            });
            setMutationResult(result);
        },
        onError: (handleMutationError) => {
            setMutationResult({ success: false, message: handleMutationError.message });
        }
    });

    const mutationInsertManyPatient = useMutation({
        mutationKey: ["insertManyUsers"],
        mutationFn: UserService.insertManyUsers,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                refetchQuery: queryGetAllPatients.refetch,
                clearSelection: () => setSelectedRowKeys([]),
                closeModal: () => setIsModalOpenDeleteMany(false),
            })
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
        queryGetAllPatients,
        mutationDeletePatient,
        mutationUpdatePatient,
        mutationDeleteAllPatient,
        mutationInsertManyPatient,
    };
};