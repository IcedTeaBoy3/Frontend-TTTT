import { Breadcrumb } from 'antd';
import { BreadcrumbWrapper } from './style';
import { Link } from 'react-router-dom';

const CustomBreadcrumb = ({ items }) => {
    // items: [{ label: 'Trang chủ', to: '/', icon: <HomeOutlined /> }, ...]

    const breadcrumbItems = items.map(item => ({
        title: (
            <span>
                {item.icon}
                <Link to={item.to} style={{ marginLeft: item.icon ? 4 : 0 }}>
                    {item.label}
                </Link>
            </span>
        )
    }));

    return (
        <BreadcrumbWrapper>
            <Breadcrumb items={breadcrumbItems} />
        </BreadcrumbWrapper>
    );
};

export default CustomBreadcrumb;
