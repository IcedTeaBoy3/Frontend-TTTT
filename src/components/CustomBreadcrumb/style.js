import styled from 'styled-components';
// Styled wrapper
export const BreadcrumbWrapper = styled.div`
    
    margin-bottom: 16px;
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