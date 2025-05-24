import React from 'react'

import { addMinutesToTime } from '../../utils/timeUtils';
import { CustomButton } from './style';
const TimeSlot = ({ timeSlots, selectedDate, selectedTime, handleCheckTime, handleSelectedTime }) => {
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
                    styleButton={{ width: 100 }}
                    $isSelected={selectedTime === time}
                    onClick={() => handleSelectedTime(time)}
                >
                    {`${time}-${addMinutesToTime(time, 30)}`}
                </CustomButton>
            ))}
        </div>
    )
}

export default TimeSlot