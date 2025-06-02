
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import DefaultLayout from '../../components/DefaultLayout/DefaultLayout'
import InputComponent from '../../components/InputComponent/InputComponent'
import { MedicineBoxOutlined, EnvironmentFilled } from '@ant-design/icons'
import { Typography, Pagination, Flex, Space } from 'antd'
import { useLocation } from 'react-router-dom'
import * as DoctorService from '../../services/DoctorService'
import { useDebounce } from '../../hooks/useDebounce'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CardDoctor from '../../components/CardDoctor/CardDoctor'
const { Text, Title, Paragraph } = Typography
const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const keyWord = queryParams.get('keyword') || '';
    const specialty = queryParams.get('specialty') || ''

    const [inputValue, setInputValue] = useState(keyWord);
    const debouncedSearchQuery = useDebounce(inputValue, 500);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const handleSearch = (value) => {
        setInputValue(value);
    };
    // Đồng bộ URL khi người dùng thay đổi ô input
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (inputValue) {
            params.set('keyword', inputValue);
        } else {
            params.delete('keyword');
        }
        navigate({ search: params.toString() }, { replace: true });
    }, [inputValue, navigate]);

    const { data: doctors = [], isLoading, isError } = useQuery({
        queryKey: ['searchDoctors', debouncedSearchQuery, pagination.current, specialty],
        queryFn: () => DoctorService.searchDoctors(debouncedSearchQuery, specialty, pagination.current, pagination.pageSize),
        enabled: true,
        keepPreviousData: true, // giữ dữ liệu cũ trong lúc load trang mới
    });
    useEffect(() => {
        if (doctors?.total) {
            setPagination(prev => ({
                ...prev,
                total: doctors.total
            }));
        }
    }, [doctors]);


    return (
        <DefaultLayout>
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#f0f2f5",
                    padding: "100px 16px 60px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "800px",
                    }}
                >
                    {/* Ô tìm kiếm */}
                    <div
                        style={{
                            background: "#fff",
                            padding: "32px",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        <InputComponent
                            placeholder="Tìm kiếm bác sĩ, phòng khám, chuyên khoa..."
                            onSearch={handleSearch}
                            size="large"
                            defaultValue={keyWord}
                        />

                        {/* Bộ lọc */}
                        <Space style={{ marginTop: "16px", flexWrap: "wrap" }} size="middle">
                            <ButtonComponent type="default"><MedicineBoxOutlined />Chọn chuyên khoa</ButtonComponent>
                            <ButtonComponent type="default"><EnvironmentFilled />Khu vực</ButtonComponent>
                            <ButtonComponent type="default">Gần nhất</ButtonComponent>
                        </Space>
                    </div>

                    {/* Kết quả */}
                    <div
                        style={{
                            marginTop: "32px",
                            background: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        {debouncedSearchQuery ? (
                            <Title level={4} style={{ padding: "16px" }}>
                                Kết quả tìm kiếm cho: <Text strong>{`"${debouncedSearchQuery}"`}</Text>
                            </Title>
                        ) : (
                            <Title level={4} style={{ padding: "16px" }}>
                                Tất cả bác sĩ
                            </Title>
                        )}


                        {/* Danh sách bác sĩ */}
                        <div style={{ padding: "16px" }}>
                            {isLoading ? (
                                <Paragraph>Đang tải...</Paragraph>
                            ) : isError ? (
                                <Paragraph>Lỗi khi tải dữ liệu.</Paragraph>
                            ) : (doctors?.data?.length > 0 && doctors) ? (
                                doctors?.data?.map((doctor) => (
                                    <CardDoctor key={doctor._id} doctor={doctor} />
                                ))
                            ) : (
                                <Paragraph>Không tìm thấy kết quả nào.</Paragraph>
                            )}
                        </div>


                    </div>
                    {/* Phân trang */}
                    <Flex justify='center' style={{ marginTop: "16px" }}>
                        <Pagination
                            defaultCurrent={1}
                            current={pagination.current}
                            total={pagination.total}
                            pageSize={pagination.pageSize}
                            onChange={(page, pageSize) => {
                                setPagination({
                                    current: page,
                                    pageSize: pageSize,
                                });
                            }}
                            showSizeChanger
                        >
                        </Pagination>
                    </Flex>

                </div>
            </div>
        </DefaultLayout >
    )
}

export default SearchPage