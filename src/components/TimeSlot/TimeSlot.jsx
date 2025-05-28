
import { addMinutesToTime } from '../../utils/timeUtils';
import { CustomButton } from './style';
import dayjs from 'dayjs';
const TimeSlot = ({ timeSlots, schedule, selectedDate, selectedTime, handleCheckTime, handleSelectedTime }) => {
    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                maxHeight: 160,
                overflowY: "auto",
                paddingRight: 4,
            }}
        >
            {timeSlots?.map((time, index) => (
                <CustomButton
                    hoverable="true"
                    key={index}
                    type="primary"
                    disabled={handleCheckTime(selectedDate, time)}
                    stylebutton={{ width: 100 }}
                    $isSelected={selectedTime === time && dayjs(schedule?.workDate).isSame(dayjs(selectedDate), 'day')}
                    onClick={() => handleSelectedTime(time)}
                >
                    {`${time}-${addMinutesToTime(time, 30)}`}
                </CustomButton>
            ))}
        </div>
    )
}

export default TimeSlot