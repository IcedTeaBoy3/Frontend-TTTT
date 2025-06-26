import styled from 'styled-components';
// Styled wrapper
export const BreadcrumbWrapper = styled.div`
    padding: 16px 24px;
    border-radius: 8px;
    margin-bottom: 16px;
    background-color: #f0f2f5;
    .ant-breadcrumb {
        font-size: 16px;
    }

    .ant-breadcrumb-link {
        color: #1890ff;

        a:hover {
            color: #1890ff;
            text-decoration: underline;
        }
    }

    .ant-breadcrumb-separator {
        color: #999;
    }
`;