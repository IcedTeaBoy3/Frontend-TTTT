import { DatePicker, Typography, Flex, Select } from "antd";
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
    const today = dayjs().tz('Asia/Ho_Chi_Minh').startOf('day');
    const last30Days = today.subtract(30, 'day');
    const [dateRange, setDateRange] = useState([last30Days, today]);
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
                <Select
                    defaultValue="30"
                    style={{ width: '50%' }}
                    onChange={(value) => {
                        const startDate = today.subtract(value, 'day');
                        setDateRange([startDate, today]);
                    }}
                >
                    <Select.Option value="1">Hôm nay</Select.Option>
                    <Select.Option value="7">7 ngày</Select.Option>
                    <Select.Option value="30">30 ngày</Select.Option>
                    <Select.Option value="90">90 ngày</Select.Option>
                    <Select.Option value="180">180 ngày</Select.Option>
                    <Select.Option value="365">365 ngày</Select.Option>
                </Select>
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
