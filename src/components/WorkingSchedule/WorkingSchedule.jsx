
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { getWeekdayFromDate, formatDateToDDMM } from '../../utils/dateUtils';
import { CustomCard } from './style.js';
import { Card } from "antd";
import dayjs from 'dayjs';
const WorkingSchedule = ({ workingSchedules, isLoading, selectedDate, handleCreateWorkingTime }) => {
    return (
        <LoadingComponent isLoading={isLoading}>
            <div style={{ display: "flex", gap: 12, overflowY: "auto", paddingBottom: 8, flexWrap: "wrap", maxHeight: '100' }}>
                {workingSchedules?.data?.map((schedule) => {
                    const dateObj = new Date(schedule.workDate);;
                    return (
                        <CustomCard
                            key={schedule._id}
                            hoverable={true}
                            $isSelected={dayjs(selectedDate).isSame(schedule.workDate, 'day')}
                            onClick={() => handleCreateWorkingTime(schedule)}
                        >
                            <Card.Meta
                                title={`${getWeekdayFromDate(dateObj)}, ${formatDateToDDMM(dateObj)}`}
                                description={`${schedule.startTime} - ${schedule.endTime}`}
                            />
                        </CustomCard>
                    );
                })}
            </div>
        </LoadingComponent>
    )
}

export default WorkingSchedule