import { Breadcrumb } from 'antd';
import { BreadcrumbWrapper } from './style';
import { Link } from 'react-router-dom';
const CustomBreadcrumb = ({ items }) => {
    return (
        <BreadcrumbWrapper>
            <Breadcrumb>
                {items.map((item, index) => (
                    <Breadcrumb.Item key={index}>
                        {item.icon}
                        <Link to={item.to}>{item.label}</Link>
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
        </BreadcrumbWrapper>
    );
};

export default CustomBreadcrumb;