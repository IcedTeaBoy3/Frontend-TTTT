import { useMutation, useQuery } from "@tanstack/react-query";
import * as SpecialtyService from "../services/SpecialtyService";
import { handleMutationResponse, handleMutationError } from "../utils/mutationHandlers";
export const useSpecialtyData = ({
    setIsModalOpenCreate,
    setIsDrawerOpen,
    setIsModalOpenDeleteMany,
    setIsModalOpenDelete,
    setSelectedRowKeys,
    setRowSelected,
}) => {
    const queryGetAllSpecialties = useQuery({
        queryKey: ["getAllSpecialties"],
        queryFn: SpecialtyService.getAllSpecialties,
        retry: 1,
    });

    const mutationCreateSpecialty = useMutation({
        mutationKey: ["createSpecialty"],
        mutationFn: SpecialtyService.createSpecialty,
        onSuccess: (data) => handleMutationResponse(data, {
            closeModal: () => setIsModalOpenCreate(false),
            refetchQuery: queryGetAllSpecialties.refetch,
        }),
        onError: handleMutationError,
    })

    const mutationDeleteSpecialty = useMutation({
        mutationKey: ["deleteSpecialty"],
        mutationFn: SpecialtyService.deleteSpecialty,
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setRowSelected(null),
            closeModal: () => setIsModalOpenDelete(false),
            refetchQuery: queryGetAllSpecialties.refetch,
        }),
        onError: handleMutationError,
    });

    const mutationUpdateSpecialty = useMutation({
        mutationKey: ["updateSpecialty"],
        mutationFn: ({ id, formData }) => SpecialtyService.updateSpecialty(id, formData),
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setRowSelected(null),
            closeDrawer: () => setIsDrawerOpen(false),
            refetchQuery: queryGetAllSpecialties.refetch,
        }),
        onError: handleMutationError,
    });

    const mutationDeleteManySpecialties= useMutation({
        mutationKey: ["deleteManySpecialties"],
        mutationFn: SpecialtyService.deleteManySpecialties,
        onSuccess: (data) => handleMutationResponse(data, {
            clearSelection: () => setSelectedRowKeys([]),
            closeModal: () => setIsModalOpenDeleteMany(false),
            refetchQuery: queryGetAllSpecialties.refetch,
        }),
        onError: handleMutationError,
    });

    const mutationInsertManySpecialties= useMutation({
        mutationKey: ["insertManySpecialties"],
        mutationFn: SpecialtyService.insertManySpecialties,
        onSuccess: (data) => handleMutationResponse(data, {
            refetchQuery: queryGetAllSpecialties.refetch,
        }),
        onError: handleMutationError,
    });

    return {
        queryGetAllSpecialties,
        mutationCreateSpecialty,
        mutationUpdateSpecialty,
        mutationDeleteSpecialty,
        mutationDeleteManySpecialties,
        mutationInsertManySpecialties,
    };
};