
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import DefaultLayout from '../../components/DefaultLayout/DefaultLayout'
import InputComponent from '../../components/InputComponent/InputComponent'
import { MedicineBoxOutlined, EnvironmentFilled, DownOutlined } from '@ant-design/icons'
import { Typography, Pagination, Popover } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import * as DoctorService from '../../services/DoctorService'
import * as HospitalService from '../../services/HospitalService'
import { useDebounce } from '../../hooks/useDebounce'
import { useState, useEffect, useMemo } from 'react'
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
    PaginationWrapper,
    PopupItem
} from './style'

const { Text, Title, Paragraph } = Typography
const SearchPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const keyWord = queryParams.get('keyword') || '';
    const specialty = queryParams.get('specialty') || '';
    const type = queryParams.get('type') || 'all';

    const [selectedSpecialty, setSelectedSpecialty] = useState(specialty);
    const [selectedType, setSelectedType] = useState(type);
    const [isOpen, setIsOpen] = useState(false);

    const [inputValue, setInputValue] = useState(keyWord);
    const debouncedSearchQuery = useDebounce(inputValue, 500);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const handleSearch = (value) => setInputValue(value);


    // Gọi 2 API với pageSize lớn hơn khi type === 'all'
    const doctorPageSize = selectedType === 'all' ? 100 : pagination.pageSize;
    const hospitalPageSize = selectedType === 'all' ? 100 : pagination.pageSize;

    // Các API
    const { data: doctors = {}, isLoading } = useQuery({
        queryKey: ['searchDoctors', debouncedSearchQuery, specialty, selectedType === 'all' ? 'all' : pagination.current],
        queryFn: () => DoctorService.searchDoctors(debouncedSearchQuery, specialty, selectedType === 'all' ? 1 : pagination.current, doctorPageSize),
        enabled: selectedType === 'all' || selectedType === 'doctor',
        keepPreviousData: true,
    });

    const { data: hospitals = {}, isLoading: isLoadingHospital } = useQuery({
        queryKey: ['searchHospitals', debouncedSearchQuery, specialty, selectedType === 'all' ? 'all' : pagination.current],
        queryFn: () => HospitalService.searchHospital(debouncedSearchQuery, specialty, selectedType === 'all' ? 1 : pagination.current, hospitalPageSize),
        enabled: selectedType === 'all' || selectedType === 'hospital',
        keepPreviousData: true,
    });


    const { queryGetAllSpecialties } = useSpecialtyData({});
    const { data: specialties = [], isLoading: isLoadingSpecialty } = queryGetAllSpecialties;


    const content = (
        <>
            <PopupItem onClick={() => handleSelectedType('all')}>Tất cả</PopupItem>
            <PopupItem onClick={() => handleSelectedType('doctor')}>Bác sĩ</PopupItem>
            <PopupItem onClick={() => handleSelectedType('hospital')}>Phòng khám</PopupItem>
        </>
    );
    // Chuyển dữ liệu data thành mảng rõ ràng
    const doctorData = doctors.data || [];
    const hospitalData = hospitals.data || [];
    // useMemo cho dữ liệu hiển thị
    const combinedData = useMemo(() => {
        if (selectedType === 'all') {
            const merged = [...doctorData, ...hospitalData];
            return merged.slice(
                (pagination.current - 1) * pagination.pageSize,
                pagination.current * pagination.pageSize
            );
        } else if (selectedType === 'doctor') {
            return doctorData;
        } else if (selectedType === 'hospital') {
            return hospitalData;
        }
        return [];
    }, [selectedType, doctorData, hospitalData, pagination]);

    // ✅ Cập nhật lại tổng số dữ liệu (total)
    useEffect(() => {
        if (selectedType === 'all') {
            const mergedLength = doctorData.length + hospitalData.length;
            setPagination(prev => {
                const newCurrent = Math.min(prev.current, Math.ceil(mergedLength / prev.pageSize)) || 1;
                if (prev.total === mergedLength && prev.current === newCurrent) return prev;
                return { ...prev, total: mergedLength, current: newCurrent };
            });
        } else if (selectedType === 'doctor') {
            const total = doctors.total || doctorData.length;
            setPagination(prev => {
                const newCurrent = Math.min(prev.current, Math.ceil(total / prev.pageSize)) || 1;
                if (prev.total === total && prev.current === newCurrent) return prev;
                return { ...prev, total, current: newCurrent };
            });
        } else if (selectedType === 'hospital') {
            const total = hospitals.total || hospitalData.length;
            setPagination(prev => {
                const newCurrent = Math.min(prev.current, Math.ceil(total / prev.pageSize)) || 1;
                if (prev.total === total && prev.current === newCurrent) return prev;
                return { ...prev, total, current: newCurrent };
            });
        }
    }, [selectedType, doctorData, hospitalData]);

    // Đồng bộ keyword vào URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (inputValue) params.set('keyword', inputValue);
        else params.delete('keyword');
        navigate({ search: params.toString() }, { replace: true });
    }, [inputValue, navigate]);
    // Đồng bộ URL khi người dùng thay đổi loại tìm kiếm
    // Đồng bộ type vào URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (selectedType) params.set('type', selectedType);
        else params.delete('type');
        navigate({ search: params.toString() }, { replace: true });
    }, [selectedType, navigate]);
    // ✅ Reset current = 1 khi thay đổi bộ lọc
    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            current: 1,
        }));
    }, [selectedType, debouncedSearchQuery, selectedSpecialty]);
    const handleSearchSpecialty = () => {
        const params = new URLSearchParams(location.search);
        if (selectedSpecialty) params.set('specialty', selectedSpecialty);
        else params.delete('specialty');
        navigate({ search: params.toString() }, { replace: true });
        setIsModalOpen(false);
    };
    const handleCancelSearchSpecialty = () => {
        setIsModalOpen(false);
        const params = new URLSearchParams(location.search);
        params.delete('specialty');
        navigate({ search: params.toString() }, { replace: true });
        setSelectedSpecialty(null);
    };
    const handleSelectedType = (type) => {
        setSelectedType(type);
        const params = new URLSearchParams(location.search);
        params.set('type', type); // Cập nhật type
        navigate({ search: params.toString() }, { replace: true });
    }
    const convertTypeToText = (type) => {
        switch (type) {
            case 'doctor':
                return 'Bác sĩ';
            case 'hospital':
                return 'Phòng khám';
            case 'all':
                return 'Tất cả';
            default:
                return '';
        }
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
                            <Popover
                                content={content}
                                open={isOpen}
                                onOpenChange={(open) => setIsOpen(open)}
                                title="Chọn loại tìm kiếm"
                                placement='bottomRight'
                                getPopupContainer={(trigger) => trigger.parentNode}
                            >


                                <ButtonComponent
                                    type="default"
                                    icon={<EnvironmentFilled />}
                                >
                                    Nơi khám: {convertTypeToText(selectedType)} <DownOutlined />
                                </ButtonComponent>
                            </Popover>
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
                        {/* Tiêu đề */}
                        {debouncedSearchQuery || specialty ? (
                            <ResultHeader level={4}>
                                Tìm thấy {selectedType === 'doctor'
                                    ? `${doctors?.total || 0} bác sĩ`
                                    : selectedType === 'hospital'
                                        ? `${hospitals?.total || 0} phòng khám`
                                        : `${(doctors?.data?.length || 0) + (hospitals?.data?.length || 0)} kết quả`}
                            </ResultHeader>
                        ) : (
                            <ResultHeader level={4}>
                                {selectedType === 'doctor'
                                    ? 'Tất cả bác sĩ'
                                    : selectedType === 'hospital'
                                        ? 'Tất cả phòng khám'
                                        : 'Tất cả kết quả'}
                            </ResultHeader>
                        )}

                        <DoctorList>
                            {/* --- Loại bác sĩ --- */}
                            {selectedType === 'doctor' && (
                                <>
                                    {isLoading ? (
                                        <LoadingComponent isLoading={isLoading}>
                                            <Paragraph>Đang tải dữ liệu bác sĩ...</Paragraph>
                                        </LoadingComponent>
                                    ) : doctors.data?.length > 0 ? (
                                        doctors.data.map((doctor) => (
                                            <CardDoctor
                                                key={doctor._id}
                                                doctor={doctor}
                                                isHospital={false}
                                                isLoading={isLoading}
                                            />
                                        ))
                                    ) : (
                                        <Paragraph>Không có bác sĩ nào phù hợp với tìm kiếm của bạn.</Paragraph>
                                    )}
                                </>
                            )}

                            {/* --- Loại phòng khám --- */}
                            {selectedType === 'hospital' && (
                                <>
                                    {isLoadingHospital ? (
                                        <LoadingComponent isLoading={isLoadingHospital}>
                                            <Paragraph>Đang tải dữ liệu phòng khám...</Paragraph>
                                        </LoadingComponent>
                                    ) : hospitals.data?.length > 0 ? (
                                        hospitals.data.map((hospital) => (
                                            <CardDoctor
                                                key={hospital._id}
                                                doctor={hospital}
                                                isHospital={true}
                                                isLoading={isLoadingHospital}
                                            />
                                        ))
                                    ) : (
                                        <Paragraph>Không có phòng khám nào phù hợp với tìm kiếm của bạn.</Paragraph>
                                    )}
                                </>
                            )}

                            {/* --- Loại "all" --- */}
                            {selectedType === 'all' && (
                                <>
                                    {(isLoading || isLoadingHospital) ? (
                                        <LoadingComponent isLoading>
                                            <Paragraph>Đang tải dữ liệu...</Paragraph>
                                        </LoadingComponent>
                                    ) : combinedData.length > 0 ? (
                                        combinedData.map((item) => (
                                            <CardDoctor
                                                key={item._id}
                                                doctor={item}
                                                isLoading={false}
                                                isHospital={item.type} // nếu cần phân biệt
                                            />
                                        ))
                                    ) : (
                                        <Paragraph>Không có kết quả nào phù hợp với tìm kiếm của bạn.</Paragraph>
                                    )}
                                </>
                            )}
                        </DoctorList>
                    </ResultBox>

                    {/* Phân trang */}
                    <PaginationWrapper justify="center">
                        <Pagination
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            total={pagination.total}
                            onChange={(page, pageSize) => {
                                setPagination(prev => ({
                                    ...prev,
                                    current: page,
                                    pageSize: pageSize,
                                }));
                            }}
                            showSizeChanger={false}
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