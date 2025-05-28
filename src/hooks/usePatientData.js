import { useMutation, useQuery } from "@tanstack/react-query";
import * as UserService from "../services/UserService";
import { handleMutationResponse, handleMutationError } from "../utils/mutationHandlers";

export const usePatientData = ({
    setIsOpenDrawer,
    setSelectedRowKeys,
    setRowSelected,
    setIsModalOpenDeleteMany,
    setIsModalOpenDelete,
}) => {
    const queryGetAllPatients = useQuery({
        queryKey: ["getAllPatients"],
        queryFn: UserService.getAllUsers,
        retry: 1,
    });

    const mutationDeletePatient = useMutation({
        mutationKey: ["deletePatient"],
        mutationFn: UserService.deleteUser,
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setRowSelected(null),
            closeModal: () => setIsModalOpenDelete(false),
            refetchQuery: queryGetAllPatients.refetch,
        }),
        onError: handleMutationError,
    });

    const mutationUpdatePatient = useMutation({
        mutationKey: ["updatePatient"],
        mutationFn: ({ id, ...data }) => UserService.updateUser(id, data),
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setRowSelected(null),
            closeDrawer: () => setIsOpenDrawer(false),
            refetchQuery: queryGetAllPatients.refetch,
        }),
        onError: handleMutationError,
    });

    const mutationDeleteAllPatient = useMutation({
        mutationKey: ["deleteManyPatient"],
        mutationFn: UserService.deleteManyUsers,
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setSelectedRowKeys([]),
            closeModal: () => setIsModalOpenDeleteMany(false),
            refetchQuery: queryGetAllPatients.refetch,
        }),
        onError: handleMutationError,
    });

    const mutationInsertManyPatient = useMutation({
        mutationKey: ["insertManyUsers"],
        mutationFn: UserService.insertManyUsers,
        onSuccess: (data) => handleMutationResponse(data, {
            refetchQuery: queryGetAllPatients.refetch,
        }),
        onError: handleMutationError,
    });

    return {
        queryGetAllPatients,
        mutationDeletePatient,
        mutationUpdatePatient,
        mutationDeleteAllPatient,
        mutationInsertManyPatient,
    };
};