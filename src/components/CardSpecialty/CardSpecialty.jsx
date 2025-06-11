import { Flex, Image, Typography, Space } from 'antd'
import { StyledCard } from './style';
const { Text } = Typography;
const CardSpecialty = ({ specialty, isSelected, onClick, ...rests }) => {
    return (
        <StyledCard
            isSelected={isSelected}
            onClick={onClick}
            {...rests}
        >

            <Flex

                justify="start"
                align="center"
                gap={20}
            >
                <Image
                    width={50}
                    height={50}
                    src={`${import.meta.env.VITE_APP_BACKEND_URL}${specialty?.image}`}
                    alt="Chuyên khoa"
                />
                <Space direction="vertical">

                    <Text strong style={{ textAlign: 'center' }}>{specialty?.name}</Text>

                    <Text
                        type="secondary"

                    >
                        {specialty?.description}
                    </Text>
                </Space>
            </Flex>
        </StyledCard >

    )
}

export default CardSpecialty