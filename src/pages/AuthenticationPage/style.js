
import styled from "styled-components";
export const BackgroundContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;

    background-image: url(${props => props.backgroundImage});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;

    /* Overlay để làm tối background giúp nội dung nổi bật */
    /* &::before {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4); 
        z-index: 1;
    } */

    /* Nội dung hiển thị trên overlay */
    /* & > * {
        position: relative;
        z-index: 2;
        text-align: center;
    } */

    @media (max-width: 768px) {
        padding: 30px 15px;
    }

    @media (max-width: 480px) {
        padding: 20px 10px;
        flex-direction: column;
    }
`;