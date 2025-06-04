
import { addMinutesToTime } from '../../utils/timeUtils';
import { CustomButton } from './style';
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
const TimeSlot = ({ timeSlots, schedule, selectedDate, selectedTime, handleCheckTime, handleSelectedTime }) => {
    return (
        <div
            style={{
                maxHeight: 160,
                overflowY: "auto",
            }}
        >
            <Row gutter={[12, 12]} justify="start">
                {timeSlots?.map((time, index) => (
                    <Col key={index} xs={12} sm={8} md={6} lg={4}>
                        <CustomButton
                            hoverable="true"
                            type="primary"
                            disabled={handleCheckTime(selectedDate, time)}
                            stylebutton={{ width: "100%" }}
                            $isSelected={
                                selectedTime === time &&
                                dayjs(schedule?.workDate).isSame(dayjs(selectedDate), "day")
                            }
                            onClick={() => handleSelectedTime(time)}
                        >
                            {`${time}-${addMinutesToTime(time, 30)}`}
                        </CustomButton>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default TimeSlot