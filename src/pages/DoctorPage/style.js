import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
export const Wrapper = styled.div`
    padding: 24px;
    @media (max-width: 768px) {
        padding: 12px;
    }
`;
export const AvatarWrapper = styled.div`
    position: relative;
    width: fit-content !important;
    margin: 0 auto;
    margin-top: 16px;
`;

export const UploadButton = styled(ButtonComponent)`
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translate(25%, 25%);
    border-radius: 50%;
    padding: 4px;
`;
export const AddClinicButton = styled(ButtonComponent)`
    height: 150px;
    width: 150px;
    border-radius: 6px;
    border-style: dashed;
    display: flex;
    justify-content: center;
    align-items: center;
`;