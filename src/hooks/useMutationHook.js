import { useMutation } from "@tanstack/react-query";

export const useMutationHook = (functionCallback) => {
    const mutation = useMutation({
        mutationFn: functionCallback,
    });
    return mutation;
};
