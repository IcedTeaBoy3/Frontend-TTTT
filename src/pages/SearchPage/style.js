import styled from 'styled-components';
import { Typography, Flex } from 'antd';

export const Wrapper = styled.div`
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 100px 16px 60px;
  display: flex;
  justify-content: center;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 800px;
`;

export const SearchBox = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const FilterWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ResultBox = styled.div`
  margin-top: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const ResultHeader = styled(Typography.Title)`
  padding: 16px !important;
`;

export const DoctorList = styled.div`
  padding: 16px;
`;

export const PaginationWrapper = styled(Flex)`
  margin-top: 16px;
`;