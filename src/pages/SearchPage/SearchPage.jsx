
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import DefaultLayout from '../../components/DefaultLayout/DefaultLayout'
import InputComponent from '../../components/InputComponent/InputComponent'
import { MedicineBoxOutlined, EnvironmentFilled } from '@ant-design/icons'
import { Typography, Pagination, Flex, Space } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import * as DoctorService from '../../services/DoctorService'
import { useDebounce } from '../../hooks/useDebounce'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import CardDoctor from '../../components/CardDoctor/CardDoctor'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import { useSpecialtyData } from '../../hooks/useSpecialtyData'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import CardSpecialty from '../../components/CardSpecialty/CardSpecialty'
import {
    Wrapper,
    Container,
    SearchBox,
    FilterWrapper,
    ResultBox,
    ResultHeader,
    DoctorList,
    PaginationWrapper
} from './style'

const { Text, Title, Paragraph } = Typography
const SearchPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const keyWord = queryParams.get('keyword') || '';
    const specialty = queryParams.get('specialty') || ''

    const [selectedSpecialty, setSelectedSpecialty] = useState(specialty); // mặc định lấy từ URL

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
    const { queryGetAllSpecialties } = useSpecialtyData({});
    const { data: specialties = [], isLoading: isLoadingSpecialty } = queryGetAllSpecialties;

    useEffect(() => {
        if (doctors?.total) {
            setPagination(prev => ({
                ...prev,
                total: doctors.total
            }));
        }
    }, [doctors]);
    const handleSearchSpecialty = () => {
        const params = new URLSearchParams(location.search);
        if (selectedSpecialty) {
            params.set('specialty', selectedSpecialty);
        } else {
            params.delete('specialty');
        }
        navigate({ search: params.toString() }, { replace: true });
        setIsModalOpen(false);
    };
    const handleCancelSearchSpecialty = () => {
        setIsModalOpen(false);
        const params = new URLSearchParams(location.search);
        params.delete('specialty');
        navigate({ search: params.toString() }, { replace: true });
        setSelectedSpecialty(null); // Reset selected specialty
    }
    return (
        <DefaultLayout>
            <Wrapper>
                <Container>
                    {/* Ô tìm kiếm */}
                    <SearchBox>
                        <InputComponent
                            placeholder="Tìm kiếm bác sĩ, phòng khám, chuyên khoa..."
                            onSearch={handleSearch}
                            size="large"
                            defaultValue={keyWord}
                        />

                        {/* Bộ lọc */}
                        <FilterWrapper>
                            <ButtonComponent
                                type="default"
                                icon={<MedicineBoxOutlined />}
                                onClick={() => setIsModalOpen(true)}
                                style={{
                                    color: selectedSpecialty ? '#1677ff' : undefined,
                                    borderColor: selectedSpecialty ? '#1677ff' : undefined,
                                }}
                            >
                                {selectedSpecialty
                                    ? `${specialties?.data?.find(item => item._id === selectedSpecialty)?.name || 'Tất cả'}`
                                    : 'Chuyên khoa'}
                            </ButtonComponent>
                            <ButtonComponent type="default" icon={<EnvironmentFilled />}>
                                Khu vực
                            </ButtonComponent>
                        </FilterWrapper>
                    </SearchBox>

                    {/* Kết quả */}
                    <ResultBox>
                        {debouncedSearchQuery || specialty ? (
                            <ResultHeader level={4}>
                                Tìm thấy {`"${doctors?.total}"`} kết quả
                            </ResultHeader>
                        ) : (
                            <ResultHeader level={4}>Tất cả bác sĩ</ResultHeader>
                        )}

                        {/* Danh sách bác sĩ */}
                        <DoctorList>
                            {isLoading ? (
                                <Paragraph>Đang tải...</Paragraph>
                            ) : isError ? (
                                <Paragraph>Lỗi khi tải dữ liệu.</Paragraph>
                            ) : doctors?.data?.length > 0 && doctors ? (
                                doctors.data.map((doctor) => (
                                    <CardDoctor key={doctor._id} doctor={doctor} />
                                ))
                            ) : (
                                <Paragraph>Không tìm thấy kết quả nào.</Paragraph>
                            )}
                        </DoctorList>
                    </ResultBox>

                    {/* Phân trang */}
                    <PaginationWrapper justify="center">
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
                        />
                    </PaginationWrapper>
                </Container>
            </Wrapper>
            <ModalComponent
                title="Chọn chuyên khoa"
                isOpen={isModalOpen}
                onOk={handleSearchSpecialty}
                onCancel={handleCancelSearchSpecialty}
                okText="Áp dụng"
                cancelText="Xoá bộ lọc"
                width={500}
            >
                {specialties && specialties?.data?.length > 0 ? (
                    <LoadingComponent isLoading={isLoadingSpecialty}>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {specialties.data.map((item) => (
                                <CardSpecialty
                                    key={item._id}
                                    specialty={item}
                                    isSelected={selectedSpecialty === item._id}
                                    onClick={() => {
                                        if (selectedSpecialty === item._id) {
                                            setSelectedSpecialty(null); // Bỏ chọn
                                        } else {
                                            setSelectedSpecialty(item._id); // Chọn mới
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </LoadingComponent>
                ) : (
                    <Paragraph>Không có chuyên khoa nào.</Paragraph>
                )}
            </ModalComponent>
        </DefaultLayout >
    )
}

export default SearchPage