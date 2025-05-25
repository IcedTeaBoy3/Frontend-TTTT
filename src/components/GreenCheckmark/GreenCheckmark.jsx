
import { CheckOutlined } from '@ant-design/icons';
const GreenCheckmark = () => {
    return (
        <div
            style={{
                backgroundColor: '#b2db9f', // màu nền nhẹ
                width: 55,
                height: 55,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >

            <div
                style={{
                    backgroundColor: '#52c41a', // màu xanh kiểu Ant Design
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: 20,
                }}
            >
                <CheckOutlined style={{ fontWeight: 'bold' }} />
            </div>
        </div>
    )
}

export default GreenCheckmark