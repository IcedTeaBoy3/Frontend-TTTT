import styled from "styled-components";
import { Input } from "antd";

const { Search } = Input;

export const InputContainer = styled(Search)`
    width: 100%;
    max-width: 800px;

    .ant-input {
        height: 40px;
        border-radius: 25px 0 0 25px;
        font-size: 16px;
    }

    .ant-input-search-button {
        height: 40px;
        border-radius: 0 25px 25px 0;
        background-color: blue;
        border-color: #1890ff;
        font-weight: bold;

        &:hover {
            background-color: #40a9ff;
            border-color: #40a9ff;
        }
    }

    .ant-input-group-addon {
        overflow: hidden; /* tránh cắt tròn bị xấu */
    }
`;
