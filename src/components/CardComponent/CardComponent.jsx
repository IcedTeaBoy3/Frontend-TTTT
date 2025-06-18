import { Card, Avatar, Tag } from 'antd';
import { RightOutlined, ArrowRightOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import defaultAvatar from '../../assets/avatar-default-icon.png';
const { Meta } = Card;
import { WarpperCardStyle, TwoLineDescription } from './style'
const CardComponent = ({ avatar, name, specialty, hospital, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const description = <>
        <p style={{ margin: 0 }}><Tag color='blue' style={{ marginRight: '0px' }}>{specialty}</Tag></p>
        <p style={{ margin: 0 }}>{hospital}</p>
    </>
    const [imgSrc, setImgSrc] = useState(`${import.meta.env.VITE_APP_BACKEND_URL}${avatar}`);
    return (
        <WarpperCardStyle
            style={{ textAlign: 'center' }}
            hoverable={true}
            actions={[

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 8px',
                        color: isHovered ? '#1890ff' : '#000'
                    }}>
                    <span>Đặt lịch khám</span>
                    {isHovered ? <ArrowRightOutlined /> : <RightOutlined />}
                </div>
            ]}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >

            <Avatar
                size={100}
                src={imgSrc}
                style={{ margin: '0 auto', display: 'block', marginBottom: '16px' }}
                onError={() => {
                    setImgSrc(defaultAvatar); // ảnh mặc định khi lỗi
                    return false;
                }}
            />

            <Meta
                title={<span style={{ color: isHovered ? '#1890ff' : '#000', textDecoration: isHovered ? 'underline' : 'none' }}>{name}</span>}
                description={<TwoLineDescription>{description}</TwoLineDescription>}
            />
        </WarpperCardStyle>
    )
}

export default CardComponent