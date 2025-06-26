import { DatePicker, Space } from "antd";
import { useState } from 'react';
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import AppointmentStats from "../../components/AppointmentStats/AppointmentStats";
import { useDebounce } from '../../hooks/useDebounce';
import DoctorStats from "../../components/DoctorStats/DoctorStats";
import PatientStats from "../../components/PatientStats/PatientStats";
import TabsComponent from "../../components/TabsComponent/TabsComponent";
const { RangePicker } = DatePicker;

const Dashboard = () => {
    const [dateRange, setDateRange] = useState([]);
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
            <Space direction="horizontal">
                <RangePicker
                    format="DD/MM/YYYY"
                    style={{ width: '300px' }}
                    placeholder={['Từ ngày', 'Đến ngày']}
                    value={dateRange}
                    onChange={handleDateChange}
                />
                <ButtonComponent
                    type="primary"
                    style={{ marginLeft: '10px' }}
                    onClick={() => setDateRange([])}
                >
                    Xóa bộ lọc
                </ButtonComponent>
            </Space>
            {/* Tab thống kê chi tiết */}
            <TabsComponent items={items} />
        </>
    );
};

export default Dashboard;
