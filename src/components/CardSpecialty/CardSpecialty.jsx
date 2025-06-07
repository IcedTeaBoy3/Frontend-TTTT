import { Flex, Image, Typography } from 'antd'
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
                direction="column"
                justify="start"
                gap={10}
                align="center"
            >
                <Image
                    width={30}
                    height={30}
                    src={`${import.meta.env.VITE_APP_BACKEND_URL}${specialty?.image}`}
                    alt="Chuyên khoa"

                />
                <Text strong>{specialty?.name}</Text>
            </Flex>
        </StyledCard >

    )
}

export default CardSpecialty