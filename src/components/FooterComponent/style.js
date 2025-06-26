
import styled from 'styled-components';
export const FooterWrapper = styled.div`
    padding: 30px 0px;
    margin: 0 auto;
    min-height: 50vh;
    max-width: 1200px;
`;

export const FooterTitle = styled.h3`
    font-weight: bold;
    border-left: 4px solid #1890ff;
    padding-left: 10px;
    margin-bottom: 12px;
`;

export const FooterText = styled.p`
    font-size: 14px;
    margin: 4px 0;
`;

export const FooterBottom = styled.div`
  text-align: center;
  margin-top: 50px;
  border-top: 1px solid #ccc;
  padding-top: 20px;
`;
export const SocialLinks = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
`;

export const SocialIcon = styled.a`
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #333;
    transition: color 0.3s;
    text-decoration: none;

    &:hover {
        color: #1890ff;
    }

    svg {
        margin-right: 6px;
    }
`;
