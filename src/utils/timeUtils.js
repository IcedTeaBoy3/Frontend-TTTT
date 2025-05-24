export const addMinutesToTime = (timeStr, minutesToAdd)  => {
    if (typeof timeStr !== "string" || !timeStr.includes(":")) {
        return "00:00";
    }
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date(0, 0, 0, hours, minutes);
    date.setMinutes(date.getMinutes() + minutesToAdd);

    const resultHours = String(date.getHours()).padStart(2, "0");
    const resultMinutes = String(date.getMinutes()).padStart(2, "0");
    return `${resultHours}:${resultMinutes}`;
}