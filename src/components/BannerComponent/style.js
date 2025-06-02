import styled from "styled-components";

export const BannerContainer = styled.div`
    background-color: #1890ff;
    position: relative;
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
`;
export const BannerImage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${(props) => props.image});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: right;
    opacity: 0.3;
`;