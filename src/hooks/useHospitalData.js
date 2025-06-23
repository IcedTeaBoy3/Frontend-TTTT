import { useMutation, useQuery } from "@tanstack/react-query";
import * as HospitalService from "../services/HospitalService";
import { handleMutationResponse } from "../utils/mutationHandlers";
import * as Message from "../components/Message/Message";
import { useState, useEffect } from "react";
export const useHospitalData = ({
    setIsModalOpenCreate,
    setIsDrawerOpen,
    setIsModalOpenDeleteMany,
    setIsModalOpenDelete,
    setSelectedRowKeys,
    setRowSelected,
    type,
    status,
}) => {
    const [mutationResult, setMutationResult] = useState(null);
    const queryGetAllHospitals = useQuery({
        queryKey: ["getAllHospitals"],
        queryFn: () => HospitalService.getAllHospitals(type, status),
        retry: 1,
    });

    const mutationCreateHospital = useMutation({
        mutationKey: ["createHospital"],
        mutationFn: HospitalService.createHospital,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                closeModal: () => setIsModalOpenCreate(false),
                refetchQuery: queryGetAllHospitals.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    })

    const mutationDeleteHospital = useMutation({
        mutationKey: ["deleteHospital"],
        mutationFn: HospitalService.deleteHospital,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setRowSelected(null),
                closeModal: () => setIsModalOpenDelete(false),
                refetchQuery: queryGetAllHospitals.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    });

    const mutationUpdateHospital = useMutation({
        mutationKey: ["updateHospital"],
        mutationFn: ({ id, formData }) => HospitalService.updateHospital(id, formData),
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setRowSelected(null),
                closeDrawer: () => setIsDrawerOpen(false),
                refetchQuery: queryGetAllHospitals.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    });

    const mutationDeleteManyHospitals= useMutation({
        mutationKey: ["deleteManyHospitals"],
        mutationFn: HospitalService.deleteManyHospitals,
        onSuccess: (data) => {
            const result = handleMutationResponse(data, {
                clearSelection: () => setSelectedRowKeys([]),
                closeModal: () => setIsModalOpenDeleteMany(false),
                refetchQuery: queryGetAllHospitals.refetch,
            });
            setMutationResult(result);
        },
        onError: (error) => {
            setMutationResult({ success: false, message: error.message });
        }
    });

    // const mutationInsertManyDoctors= useMutation({
    //     mutationKey: ["insertManyDoctors"],
    //     mutationFn: DoctorService.insertManyDoctors,
    //     onSuccess: (data) => handleMutationResponse(data, {
    //         refetchQuery: queryGetAllDoctors.refetch,
    //     }),
    //     onError: handleMutationError,
    // });
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
        queryGetAllHospitals,
        mutationCreateHospital,
        mutationDeleteHospital,
        mutationUpdateHospital,
        mutationDeleteManyHospitals,
        // mutationInsertManyDoctors,
    };
};