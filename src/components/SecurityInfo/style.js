import styled from "styled-components";
import { Card} from "antd";
// Wrapper tổng thể
export const Wrapper = styled.div`
  text-align: center;
  background-color: #fff;
`;

// Icon bo tròn nền xanh
export const IconCircle = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #1890ff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin: 0 auto 16px;
    transition: all 0.3s ease;
`;

// Box hover mượt
export const HoverCard = styled(Card)`
    border: none;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: default;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }
`;

export const BottomText = styled.p`
    max-width: 800px;
    margin: 48px auto 0;
    color: #444;
    font-size: 16px;
    line-height: 1.6;
`;