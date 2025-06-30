import { DatePicker, Typography, Flex, Button } from "antd";
import { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import AppointmentStats from "../../components/AppointmentStats/AppointmentStats";
import DoctorStats from "../../components/DoctorStats/DoctorStats";
import PatientStats from "../../components/PatientStats/PatientStats";
import TabsComponent from "../../components/TabsComponent/TabsComponent";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const { RangePicker } = DatePicker;
const { Title } = Typography;

const Dashboard = () => {
    // để giá trị mặc định là khoảng thời gian 30 ngày trước
    const today = dayjs().tz('Asia/Ho_Chi_Minh').startOf('day');
    const last7Days = today.subtract(6, 'day');
    const last30Days = today.subtract(29, 'day');
    const [dateRange, setDateRange] = useState(
        [last30Days, today] // Giá trị mặc định là khoảng thời gian 30 ngày trước
    );
    const debouncedDateRange = useDebounce(dateRange, 500);
    const handleDateChange = (dates) => {
        setDateRange(dates);
    };
    const items = [
        {
            key: '1',
            label: 'Lịch hẹn',
            children: <AppointmentStats dataRange={debouncedDateRange} />,
        },
        {
            key: '2',
            label: 'Bác sĩ',
            children: <DoctorStats dataRange={debouncedDateRange} />
        },
        {
            key: '3',
            label: 'Bệnh nhân',
            children: <PatientStats dataRange={debouncedDateRange} />
        },
    ];
    return (
        <>
            <Flex justify="space-between" align="center" style={{ marginBottom: '20px' }}>
                <Title level={3} >Thống kê </Title>
                <RangePicker
                    format="DD/MM/YYYY"
                    style={{ width: '300px' }}
                    placeholder={['Từ ngày', 'Đến ngày']}
                    value={dateRange}
                    onChange={handleDateChange}
                />
                <ButtonComponent
                    type="primary"
                    onClick={() => setDateRange([today, today])}
                >
                    Hôm nay
                </ButtonComponent>
                <ButtonComponent
                    type="primary"
                    style={{ marginLeft: '10px' }}
                    onClick={() => setDateRange([last7Days, today])}
                >
                    7 ngày trước
                </ButtonComponent>
                <ButtonComponent
                    type="primary"
                    onClick={() => setDateRange([last30Days, today])}
                >
                    30 ngày trước
                </ButtonComponent>
                <ButtonComponent
                    type="primary"
                    style={{ marginLeft: '10px' }}
                    onClick={() => setDateRange([])}
                >
                    Xóa bộ lọc
                </ButtonComponent>
            </Flex>
            {/* Tab thống kê chi tiết */}
            <TabsComponent items={items} />
        </>
    );
};

export default Dashboard;
