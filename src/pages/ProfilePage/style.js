import styled from "styled-components";

export const ProfilePageContainer = styled.div`
    min-height: 100vh;
    max-width: 1200px;
    padding: 85px 0;
    margin: 0 auto;
`
export const ProfilePageContent = styled.div`
    display: flex;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 16px rgba(0,0,0,0.1);
    flex-direction: row;
    flex-wrap: wrap;
`;

export const LeftContent = styled.div`
    padding: 24px;
    min-width: 260px;
    background-color: #f0f0f0;
    border-right: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const RightContent= styled.div`
    flex: 1;
    padding: 30px;
`