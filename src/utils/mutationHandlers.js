import * as Message from "../components/Message/Message";
export const handleMutationResponse = (
    data,
    {
        onSuccessCallback,
        refetchQuery,
        closeDrawer,
        clearSelection,
        closeModal,
    } = {}
) => {
    if (data?.status == "success") {
        Message.success(data?.message);
        onSuccessCallback?.();
        refetchQuery?.();
        closeDrawer?.();
        clearSelection?.();
        closeModal?.();
    } else {
        Message.error(data?.message);
    }
};

export const handleMutationError = (error, customMessage) => {
    Message.error(customMessage || error.message);
};