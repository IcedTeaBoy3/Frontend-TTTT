import dayjs from "dayjs";

export const getWeekdayFromDate = (date) => {
    const weekdayVi = ["CN", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7"];
    const day = new Date(date);
    return weekdayVi[day.getDay()];
}
export const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    return dayjs(date).format("DD-MM-YYYY");
}
export const formatDateToDDMM = (date) => {
    return dayjs(date).format("DD-MM");
}